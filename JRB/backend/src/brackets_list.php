<?php
include __DIR__ . '/sql.php';
header('Content-Type: application/json; charset=utf-8');
mysqli_set_charset($conexao, "utf8mb4");

// Funções de categoria (mesmas do categories_list.php)
function normalizeKidsBelt($belt) {
    $b = strtolower(trim((string)$belt));
    $kidsBelts = [
        'cinza','cinza/branca','cinza/preta','branca',
        'amarela','amarela/branca','amarela/preta',
        'laranja','laranja/branca','laranja/preta',
        'verde','verde/branca','verde/preta'
    ];
    return $b;
}

function beltGroup($belt, $catEtaria) {
    $b = strtolower(trim((string)$belt));
    $adultBelts = ['branca','azul','roxa','marrom','preta'];
    $infantis = [
        'pre-mirim-1','pre-mirim-2','mirim',
        'infantil-1','infanto-juvenil-1','infanto-juvenil-2'
    ];
    if (in_array($catEtaria, $infantis)) return normalizeKidsBelt($b);
    return in_array($b, $adultBelts) ? $b : 'branca';
}

function categoriaEtaria($idade) {
    if ($idade <= 5) return 'pre-mirim-1';
    if ($idade <= 6) return 'pre-mirim-2';
    if ($idade <= 8) return 'mirim';
    if ($idade <= 10) return 'infantil-1';
    if ($idade <= 12) return 'infanto-juvenil-1';
    if ($idade <= 14) return 'infanto-juvenil-2';
    if ($idade <= 17) return 'juvenil';
    if ($idade <= 29) return 'adulto';
    if ($idade <= 32) return 'master-1';
    if ($idade <= 35) return 'master-2';
    if ($idade <= 38) return 'master-3';
    if ($idade <= 41) return 'master-4';
    if ($idade <= 44) return 'master-5';
    if ($idade <= 47) return 'master-6';
    return 'master-7';
}

function faixaPeso($categoria, $genero, $peso, $config) {
    $genero = strtolower(trim($genero));
    $peso = floatval($peso);
    if (!isset($config[$categoria][$genero])) return 'Sem faixa';
    foreach ($config[$categoria][$genero] as $faixa) {
        if ($peso <= $faixa['max']) return $faixa['label'];
    }
    return 'Sem faixa';
}

// Carrega config de categorias (copie aqui o $categoriasConfig completo)
include __DIR__ . '/categories_list.php'; // separa em arquivo se quiser

// Consulta atletas
$sql = "SELECT full_name, belt, gender, age, weight_kg FROM athletes";
$result = $conexao->query($sql);

$porCategoria = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $catEtaria = categoriaEtaria($row['age']);
        $faixa = faixaPeso($catEtaria, $row['gender'], $row['weight_kg'], $categoriasConfig);
        $grupoFaixa = beltGroup($row['belt'], $catEtaria);
        $key = "{$catEtaria} - {$faixa} - {$grupoFaixa}";

        if (!isset($porCategoria[$key])) {
            $porCategoria[$key] = [];
        }

        $porCategoria[$key][] = $row['full_name'];
    }
}

// Monta chaveamento
$saida = [];

foreach ($porCategoria as $key => $atletas) {
    $fights = [];
    $round = 1;
    $position = 1;

    // Embaralha os atletas
    shuffle($atletas);

    // Cria pares
    for ($i = 0; $i < count($atletas); $i += 2) {
        $a = $atletas[$i];
        $b = $atletas[$i + 1] ?? 'TBD';

        $fights[] = [
            'round' => $round,
            'position' => $position++,
            'a_entry_id' => $a,
            'b_entry_id' => $b,
            'winner_entry_id' => null
        ];
    }

    $saida[] = [
        'category_key' => $key,
        'fights' => $fights
    ];
}

echo json_encode($saida, JSON_UNESCAPED_UNICODE);
$conexao->close();
