<?php
include __DIR__ . '/../../../backend/src/sql.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome      = trim($_POST["full_name"] ?? '');
    $faixa     = trim($_POST["belt"] ?? '');
    $genero    = trim($_POST["gender"] ?? '');
    $idade     = intval($_POST["age"] ?? 0);
    $peso      = floatval($_POST["weight_kg"] ?? 0);
    $equipe_id = intval($_POST["team_id"] ?? 0);

    if ($nome && $faixa && $genero && $idade > 0 && $peso > 0 && $equipe_id > 0) {
        $sql = "INSERT INTO athletes (full_name, belt, gender, age, weight_kg, team_id)
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conexao->prepare($sql);

        if ($stmt === false) {
            die("Erro no prepare: " . $conexao->error);
        }

        $stmt->bind_param("sssidi", $nome, $faixa, $genero, $idade, $peso, $equipe_id);

        if ($stmt->execute()) {
            echo "✅ Inscrição registrada com sucesso!";
        } else {
            echo "❌ Erro ao salvar: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "⚠️ Todos os campos são obrigatórios.";
    }
}

$conexao->close();

