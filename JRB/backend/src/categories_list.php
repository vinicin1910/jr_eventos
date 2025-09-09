<?php
include __DIR__ . '/sql.php';
header('Content-Type: application/json; charset=utf-8');
mysqli_set_charset($conexao, "utf8mb4");

// --- CONFIGURAÇÃO DAS CATEGORIAS (convertida do JS) ---
$categoriasConfig = [
    'pre-mirim-1' => [
        'masculino' => [
            ['label'=>'Até 19.0kg', 'max'=>19], ['label'=>'Até 23.0kg', 'max'=>23],
            ['label'=>'Até 27.0kg', 'max'=>27], ['label'=>'Acima', 'max'=>999]
        ],
        'feminino' => [
            ['label'=>'Até 19.0kg', 'max'=>19], ['label'=>'Até 23.0kg', 'max'=>23],
            ['label'=>'Até 27.0kg', 'max'=>27], ['label'=>'Acima', 'max'=>999]
        ]
    ],
    'pre-mirim-2' => [
        'masculino' => [
            ['label'=>'Até 21.0kg', 'max'=>21], ['label'=>'Até 25.0kg', 'max'=>25],
            ['label'=>'Até 29.0kg', 'max'=>29], ['label'=>'Até 33.0kg', 'max'=>33],
            ['label'=>'Acima', 'max'=>999]
        ],
        'feminino' => [
            ['label'=>'Até 21.0kg', 'max'=>21], ['label'=>'Até 25.0kg', 'max'=>25],
            ['label'=>'Até 29.0kg', 'max'=>29], ['label'=>'Até 33.0kg', 'max'=>33],
            ['label'=>'Acima', 'max'=>999]
        ]
    ],
    // ... cole aqui o restante do seu config JS convertido para PHP ...
];

// --- FUNÇÕES ---

function normalizeKidsBelt($belt) {
    $b = strtolower(trim((string)$belt));
    $gray = ['cinza','cinza/branca','cinza/preta','branca'];
    $ylg = [
        'amarela','amarela/branca','amarela/preta',
        'laranja','laranja/branca','laranja/preta',
        'verde','verde/branca'
    ];
    if (in_array($b, $gray)) return 'kids_gray_merged';
    if (in_array($b, $ylg)) return 'kids_yellow_orange_green';
    return $b;
}

function beltGroup($age, $belt) {
    if ((int)$age <= 15) return normalizeKidsBelt($belt);
    $b = strtolower(trim((string)$belt));
    $allowed = ['branca','azul','roxa','marrom','preta'];
    if (!in_array($b, $allowed)) return 'branca';
    return $b;
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

    if (!isset($config[$categoria][$genero])) {
        return 'Sem faixa';
    }

    foreach ($config[$categoria][$genero] as $faixa) {
        if ($peso <= $faixa['max']) {
            return $faixa['label'];
        }
    }
    return 'Sem faixa';
}

// --- CONSULTA ATLETAS ---
$sql = "SELECT full_name, belt, gender, age, weight_kg FROM athletes";
$result = $conexao->query($sql);

$agrupadas = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $catEtaria = categoriaEtaria($row['age']);
        $faixa = faixaPeso($catEtaria, $row['gender'], $row['weight_kg'], $categoriasConfig);
        $grupoFaixa = beltGroup($row['age'], $row['belt']);

        $chave = "{$catEtaria} - {$faixa} - {$grupoFaixa}";

        if (!isset($agrupadas[$chave])) {
            $agrupadas[$chave] = 0;
        }
        $agrupadas[$chave]++;
    }
}

// --- MONTA SAÍDA ---
$saida = [];
foreach ($agrupadas as $key => $count) {
    $saida[] = [    
        'category_key' => $key,
        'count' => $count
    ];
}

echo json_encode($saida, JSON_UNESCAPED_UNICODE);
$conexao->close();
