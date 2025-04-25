<?php
require_once 'config.php';

header('Content-Type: application/json');

$conn = getDBConnection();

// Obter todas as empresas
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT * FROM empresas";
    $result = $conn->query($query);
    
    $empresas = [];
    while ($row = $result->fetch_assoc()) {
        $empresas[] = $row;
    }
    
    echo json_encode($empresas);
    $conn->close();
    exit;
}

// Adicionar nova empresa
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $nome = sanitizeInput($data['nome']);
    $cnpj = sanitizeInput($data['cnpj']);
    
    // Validação básica do CNPJ
    if (!preg_match('/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/', $cnpj)) {
        echo json_encode(['success' => false, 'message' => 'CNPJ inválido. Formato esperado: XX.XXX.XXX/XXXX-XX']);
        exit;
    }
    
    // Verifica se o CNPJ já existe
    $stmt = $conn->prepare("SELECT id FROM empresas WHERE cnpj = ?");
    $stmt->bind_param("s", $cnpj);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'CNPJ já cadastrado.']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    // Insere a nova empresa
    $stmt = $conn->prepare("INSERT INTO empresas (nome, cnpj) VALUES (?, ?)");
    $stmt->bind_param("ss", $nome, $cnpj);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Empresa cadastrada com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar empresa: ' . $conn->error]);
    }
    
    $stmt->close();
    $conn->close();
    exit;
}
?>