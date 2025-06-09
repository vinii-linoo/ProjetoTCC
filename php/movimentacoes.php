<?php
require_once 'config.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$conn = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $tipo = isset($_GET['tipo']) ? sanitizeInput($_GET['tipo']) : '';
    $filtro = isset($_GET['filtro']) ? sanitizeInput($_GET['filtro']) : '';
    $itemCodigo = isset($_GET['item_codigo']) ? sanitizeInput($_GET['item_codigo']) : '';
    
    $query = "SELECT m.*, i.nome_produto, i.codigo as item_codigo, e.nome as empresa_nome, e.cnpj as empresa_cnpj
              FROM movimentacoes m 
              JOIN itens i ON m.item_id = i.id 
              JOIN empresas e ON m.empresa_id = e.id";
    
    $where = [];
    $params = [];
    $types = '';
    
    if ($tipo) {
        $where[] = "m.tipo = ?";
        $params[] = $tipo;
        $types .= 's';
    }
    
    if ($filtro) {
        $where[] = "(i.nome_produto LIKE ? OR i.codigo LIKE ?)";
        $params[] = "%$filtro%";
        $params[] = "%$filtro%";
        $types .= 'ss';
    }
    
    if ($itemCodigo) {
        $where[] = "i.codigo = ?";
        $params[] = $itemCodigo;
        $types .= 's';
    }
    
    if (!empty($where)) {
        $query .= " WHERE " . implode(" AND ", $where);
    }
    
    $query .= " ORDER BY m.data DESC, m.created_at DESC";
    
    $stmt = $conn->prepare($query);
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $movimentacoes = [];
    while ($row = $result->fetch_assoc()) {
        $movimentacoes[] = $row;
    }
    
    echo json_encode($movimentacoes);
    $stmt->close();
    $conn->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $tipo = sanitizeInput($data['tipo']);
    $codigoItem = sanitizeInput($data['codigo_item']);
    $cnpjEmpresa = sanitizeInput($data['cnpj_empresa']);
    $quantidade = intval($data['quantidade']);
    $dataMov = sanitizeInput($data['data']);
    
    // Validações
    if (!in_array($tipo, ['entrada', 'saida'])) {
        echo json_encode(['success' => false, 'message' => 'Tipo de movimentação inválido.']);
        exit;
    }
    
    if ($quantidade <= 0) {
        echo json_encode(['success' => false, 'message' => 'Quantidade deve ser maior que zero.']);
        exit;
    }
    
    // Busca ID do item
    $stmt = $conn->prepare("SELECT id, estoque_atual, estoque_maximo FROM itens WHERE codigo = ?");
    $stmt->bind_param("s", $codigoItem);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Item não encontrado.']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $item = $result->fetch_assoc();
    $itemId = $item['id'];
    
    // Busca ID da empresa
    $stmt = $conn->prepare("SELECT id FROM empresas WHERE cnpj = ?");
    $stmt->bind_param("s", $cnpjEmpresa);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Empresa não encontrada.']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $empresa = $result->fetch_assoc();
    $empresaId = $empresa['id'];
    
    // Valida estoque
    if ($tipo === 'entrada') {
        $novoEstoque = $item['estoque_atual'] + $quantidade;
        if ($novoEstoque > $item['estoque_maximo']) {
            echo json_encode([
                'success' => false, 
                'message' => 'Estoque máximo excedido.',
                'estoque_atual' => $item['estoque_atual'],
                'estoque_maximo' => $item['estoque_maximo'],
                'quantidade_excedente' => $novoEstoque - $item['estoque_maximo']
            ]);
            $stmt->close();
            $conn->close();
            exit;
        }
    } else {
        if ($quantidade > $item['estoque_atual']) {
            echo json_encode([
                'success' => false, 
                'message' => 'Estoque insuficiente.',
                'estoque_atual' => $item['estoque_atual'],
                'quantidade_solicitada' => $quantidade
            ]);
            $stmt->close();
            $conn->close();
            exit;
        }
    }
    
    // Insere movimentação
    $stmt = $conn->prepare("INSERT INTO movimentacoes (tipo, item_id, empresa_id, quantidade, data) 
                           VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("siiss", $tipo, $itemId, $empresaId, $quantidade, $dataMov);
    
    if ($stmt->execute()) {
        // Atualiza estoque do item
        $novoEstoque = $tipo === 'entrada' 
            ? $item['estoque_atual'] + $quantidade 
            : $item['estoque_atual'] - $quantidade;
        
        $stmtUpdate = $conn->prepare("UPDATE itens SET 
                                    estoque_atual = ?, empresa_id = ? 
                                    WHERE id = ?");
        $stmtUpdate->bind_param("iii", $novoEstoque, $empresaId, $itemId);
        $stmtUpdate->execute();
        $stmtUpdate->close();
        
        echo json_encode(['success' => true, 'message' => 'Movimentação registrada com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao registrar movimentação: ' . $conn->error]);
    }
    
    $stmt->close();
    $conn->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = sanitizeInput($_GET['id']);
    
    // Primeiro obtemos os dados da movimentação para atualizar o estoque
    $stmt = $conn->prepare("SELECT m.tipo, m.quantidade, i.id as item_id, i.estoque_atual 
                           FROM movimentacoes m 
                           JOIN itens i ON m.item_id = i.id 
                           WHERE m.id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Movimentação não encontrada.']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $movimentacao = $result->fetch_assoc();
    
    // Calcula o novo estoque
    $novoEstoque = $movimentacao['tipo'] === 'entrada' 
        ? $movimentacao['estoque_atual'] - $movimentacao['quantidade']
        : $movimentacao['estoque_atual'] + $movimentacao['quantidade'];
    
    // Atualiza o estoque do item
    $stmtUpdate = $conn->prepare("UPDATE itens SET estoque_atual = ? WHERE id = ?");
    $stmtUpdate->bind_param("ii", $novoEstoque, $movimentacao['item_id']);
    
    if ($stmtUpdate->execute()) {
        // Agora exclui a movimentação
        $stmtDelete = $conn->prepare("DELETE FROM movimentacoes WHERE id = ?");
        $stmtDelete->bind_param("i", $id);
        
        if ($stmtDelete->execute()) {
            echo json_encode(['success' => true, 'message' => 'Movimentação excluída com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao excluir movimentação: ' . $conn->error]);
        }
        $stmtDelete->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar estoque: ' . $conn->error]);
    }
    
    $stmtUpdate->close();
    $stmt->close();
    $conn->close();
    exit;
}
?>