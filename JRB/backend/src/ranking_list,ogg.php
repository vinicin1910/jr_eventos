<?php
include __DIR__ . '/sql.php';
header('Content-Type: application/json; charset=utf-8');
mysqli_set_charset($conexao, "utf8mb4");

/*
  Este código assume que a tabela athletes tem uma coluna 'medal'
  com valores 'gold', 'silver' ou 'bronze' para cada atleta que ganhou medalha.
*/

$sql = "
SELECT 
    t.name AS team_name,
    SUM(CASE WHEN a.medal = 'gold' THEN 1 ELSE 0 END) AS gold,
    SUM(CASE WHEN a.medal = 'silver' THEN 1 ELSE 0 END) AS silver,
    SUM(CASE WHEN a.medal = 'bronze' THEN 1 ELSE 0 END) AS bronze
FROM teams t
LEFT JOIN athletes a ON a.team_id = t.id
GROUP BY t.id
";

$result = $conexao->query($sql);

$saida = [];
while ($row = $result->fetch_assoc()) {
    $gold   = (int)$row['gold'];
    $silver = (int)$row['silver'];
    $bronze = (int)$row['bronze'];

    // Calcula pontos com a nova pontuação
    $points = ($gold * 9) + ($silver * 6) + ($bronze * 3);

    $saida[] = [
        'team_name' => $row['team_name'],
        'gold'      => $gold,
        'silver'    => $silver,
        'bronze'    => $bronze,
        'points'    => $points
    ];
}

// Ordena por pontos (maior para menor)
usort($saida, function($a, $b) {
    return $b['points'] <=> $a['points'];
});

echo json_encode($saida, JSON_UNESCAPED_UNICODE);
$conexao->close();
