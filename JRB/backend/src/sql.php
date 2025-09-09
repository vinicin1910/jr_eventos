<?php
$dbHost = "localhost";
$dbUsername = "root";
$dbPassword = "@Vinicius07deus"; // mesma senha do phpMyAdmin
$dbName = "jr_eventos";

$conexao = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

if ($conexao->connect_error) {
    die("Erro de conexão: " . $conexao->connect_error);
}

// Não colocar echo aqui — apenas manter a conexão ativa
mysqli_set_charset($conexao, "utf8mb4");
?>