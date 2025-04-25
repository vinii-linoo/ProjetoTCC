<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitizeInput($_POST['newUsername']);
    $email = sanitizeInput($_POST['newEmail']);
    $password = sanitizeInput($_POST['newPassword']);
    $confirmPassword = sanitizeInput($_POST['confirmPassword']);
    
    // Validações
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Por favor, insira um e-mail válido.']);
        exit;
    }
    
    if ($password !== $confirmPassword) {
        echo json_encode(['success' => false, 'message' => 'As senhas não coincidem.']);
        exit;
    }
    
    $conn = getDBConnection();
    
    // Verifica se o e-mail já existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'E-mail já cadastrado.']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    // Hash da senha
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insere o novo usuário
    $stmt = $conn->prepare("INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $hashedPassword);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registro bem-sucedido!', 'redirect' => 'login.html']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao registrar usuário.']);
    }
    
    $stmt->close();
    $conn->close();
}
?>