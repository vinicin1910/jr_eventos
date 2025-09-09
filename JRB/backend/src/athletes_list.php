<?php
include __DIR__ . '/../../backend/src/sql.php'; // conexão $conexao

header('Content-Type: application/json; charset=utf-8');

$athletes = [];
$sql = "SELECT a.full_name, a.belt, a.age, t.name AS team_name,
               COALESCE(a.status, 'ativo') AS status
        FROM athletes a
        JOIN teams t ON a.team_id = t.id
        ORDER BY a.full_name ASC";

$result = $conexao->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $athletes[] = $row;
    }
}

echo json_encode($athletes, JSON_UNESCAPED_UNICODE);

$conexao->close();
?>
