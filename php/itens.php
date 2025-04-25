<?php
require_once 'config.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$conn = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $codigo = isset($_GET['codigo']) ? sanitizeInput($_GET['codigo']) : null;
    
    $query = "SELECT i.*, e.nome as empresa_nome, e.cnpj as empresa_cnpj 
              FROM itens i LEFT JOIN empresas e ON i.empresa_id = e.id";
    
    if ($codigo) {
        $query .= " WHERE i.codigo = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $codigo);
    } else {
        $stmt = $conn->prepare($query);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($codigo) {
        echo json_encode($result->fetch_assoc() ?: []);
    } else {
        $itens = [];
        while ($row = $result->fetch_assoc()) {
            $itens[] = $row;
        }
        echo json_encode($itens);
    }
    
    $stmt->close();
    $conn->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $codigo = sanitizeInput($data['codigo']);
    $nomeProduto = sanitizeInput($data['nome_produto']);
    $tipoItem = sanitizeInput($data['tipo_item']);
    $estoqueAtual = intval($data['estoque_atual']);
    $estoqueCritico = intval($data['estoque_critico']);
    $estoqueSeguranca = intval($data['estoque_seguranca']);
    $estoqueMaximo = intval($data['estoque_maximo']);
    $estoqueMinimo = intval($data['estoque_minimo']);
    $empresaId = isset($data['empresa_id']) ? intval($data['empresa_id']) : null;
    
    // Campos específicos por tipo
    $caEpi = $tipoItem === 'EPI' ? sanitizeInput($data['ca_epi']) : null;
    $tamanhoEpi = $tipoItem === 'EPI' ? sanitizeInput($data['tamanho_epi']) : null;
    $tipoMaterial = $tipoItem === 'Material' ? sanitizeInput($data['tipo_material']) : null;
    $dimensoesMaterial = $tipoItem === 'Material' ? sanitizeInput($data['dimensoes_material']) : null;

    // Verifica se é atualização ou novo item
    $stmt = $conn->prepare("SELECT id FROM itens WHERE codigo = ?");
    $stmt->bind_param("s", $codigo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Atualiza item existente
        $stmt = $conn->prepare("UPDATE itens SET 
            nome_produto = ?, tipo_item = ?, estoque_atual = ?, estoque_critico = ?, 
            estoque_seguranca = ?, estoque_maximo = ?, estoque_minimo = ?, empresa_id = ?,
            ca_epi = ?, tamanho_epi = ?, tipo_material = ?, dimensoes_material = ?
            WHERE codigo = ?");
        
        $stmt->bind_param("ssiiiiissssss", $nomeProduto, $tipoItem, $estoqueAtual, $estoqueCritico,
            $estoqueSeguranca, $estoqueMaximo, $estoqueMinimo, $empresaId, $caEpi, $tamanhoEpi,
            $tipoMaterial, $dimensoesMaterial, $codigo);
    } else {
        // Insere novo item
        $stmt = $conn->prepare("INSERT INTO itens (
            codigo, nome_produto, tipo_item, estoque_atual, estoque_critico,
            estoque_seguranca, estoque_maximo, estoque_minimo, empresa_id, ca_epi, tamanho_epi,
            tipo_material, dimensoes_material
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->bind_param("ssiiiiissssss", $codigo, $nomeProduto, $tipoItem, $estoqueAtual, $estoqueCritico,
            $estoqueSeguranca, $estoqueMaximo, $estoqueMinimo, $empresaId, $caEpi, $tamanhoEpi,
            $tipoMaterial, $dimensoesMaterial);
    }
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item salvo com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar item: ' . $conn->error]);
    }
    
    $stmt->close();
    $conn->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $codigo = sanitizeInput($_GET['codigo']);
    
    $stmt = $conn->prepare("DELETE FROM itens WHERE codigo = ?");
    $stmt->bind_param("s", $codigo);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item excluído com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao excluir item: ' . $conn->error]);
    }
    
    $stmt->close();
    $conn->close();
    exit;
}
?>