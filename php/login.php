<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitizeInput($_POST['email']);
    $password = sanitizeInput($_POST['password']);
    
    $conn = getDBConnection();
    
    $stmt = $conn->prepare("SELECT id, username, password FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        if (password_verify($password, $user['password'])) {
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            
            echo json_encode(['success' => true, 'redirect' => 'movimentacao.html']);
        } else {
            echo json_encode(['success' => false, 'message' => 'E-mail ou senha incorretos']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'E-mail não cadastrado']);
    }
    
    $stmt->close();
    $conn->close();
}
?>