<?php
// Configurações do banco de dados
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // Altere para seu usuário do MySQL
define('DB_PASS', ''); // Altere para sua senha do MySQL
define('DB_NAME', 'controle_estoque');

// Conexão com o banco de dados
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die("Erro de conexão: " . $conn->connect_error);
    }
    
    return $conn;
}

// Função para limpar dados de entrada
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}
?>