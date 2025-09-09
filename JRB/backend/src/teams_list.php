<?php
include __DIR__ . '/../../backend/src/sql.php';

header('Content-Type: application/json; charset=utf-8');
mysqli_set_charset($conexao, "utf8mb4");

$teams = [];
$result = $conexao->query("SELECT id, name FROM teams ORDER BY name ASC");

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $teams[] = $row;
    }
}

echo json_encode($teams, JSON_UNESCAPED_UNICODE);

$conexao->close();