<?php
include __DIR__ . '/../../../backend/src/sql.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome = trim($_POST["name"]);

    if (!empty($nome)) {
        $stmt = $conexao->prepare("INSERT INTO teams (name) VALUES (?)");
        $stmt->bind_param("s", $nome);

        if ($stmt->execute()) {
            echo "✅ Equipe adicionada com sucesso!";
        } else {
            echo "❌ Erro: " . $conexao->error;
        }

        $stmt->close();
    } else {
        echo "⚠️ O nome não pode estar vazio.";
    }
}

$conexao->close();
?>