// backend/src/categories-config.js

// 1) Normaliza faixas infantis
// - branca emparelha com cinza (inclui variações)
// - amarelo, laranja e verde juntos (inclui variações)
export function normalizeKidsBelt(belt) {
  const b = belt.toLowerCase();
  const gray = ['cinza','cinza/branca','cinza/preta','branca'];
  const ylg = ['amarela','amarela/branca','amarela/preta','laranja','laranja/branca','laranja/preta','verde','verde/branca'];
  if (gray.includes(b)) return 'kids_gray_merged';
  if (ylg.includes(b)) return 'kids_yellow_orange_green';
  return b; // para juvenil/adulto retorna a própria (branca, azul, roxa, marrom, preta)
}

// 2) Divisões por idade (ajuste se quiser faixas etárias exatas)
const divisions = [
  { key: 'pre-mirim', min: 4, max: 5 },
  { key: 'mirim', min: 6, max: 7 },
  { key: 'infantil', min: 8, max: 12 },
  { key: 'infanto-juvenil', min: 13, max: 15 },
  { key: 'juvenil', min: 16, max: 17 },
  { key: 'adulto', min: 18, max: 29 },
  { key: 'master', min: 30, max: 99 }
];

// 3) Tabela de pesos por divisão e gênero
// IMPORTANTE: Ajuste estes valores para os pesos oficiais que você utiliza.
// Exemplo ilustrativo simplificado.
const weightTables = {
  'pre-mirim': {
    masculino: [ {label:'Até 19.0kg', max:19}, {label:'Até 23.0kg', max:23}, {label:'Até 27.0kg', max:27}, {label:'Acima', max:999} ],
    feminino:  [ {label:'Até 19.0kg', max:19}, {label:'Até 23.0kg', max:23}, {label:'Até 27.0kg', max:27}, {label:'Acima', max:999} ]
  },
  mirim: {
    masculino: [ {label:'Até 25.0kg', max:25}, {label:'Até 29.0kg', max:29}, {label:'Até 33.0kg', max:33}, {label:'Até 37.0kg', max:37}, {label:'Acima', max:999} ],
    feminino:  [ {label:'Até 25.0kg', max:25}, {label:'Até 29.0kg', max:29}, {label:'Até 33.0kg', max:33}, {label:'Até 37.0kg', max:37}, {label:'Acima', max:999} ]
  },
  infantil: {
    masculino: [ {label:'Até 31.0kg', max:31}, {label:'Até 35.0kg', max:35}, {label:'Até 39.0kg', max:39}, {label:'Até 43.0kg', max:43}, {label:'Acima', max:999} ],
    feminino:  [ {label:'Até 31.0kg', max:31}, {label:'Até 35.0kg', max:35}, {label:'Até 39.0kg', max:39}, {label:'Até 43.0kg', max:43}, {label:'Acima', max:999} ]
  },
  'infanto-juvenil': {
    masculino: [ {label:'Até 47.0kg', max:47}, {label:'Até 51.0kg', max:51}, {label:'Até 55.0kg', max:55}, {label:'Até 59.0kg', max:59}, {label:'Até 63.0kg', max:63}, {label:'Acima', max:999} ],
    feminino:  [ {label:'Até 47.0kg', max:47}, {label:'Até 51.0kg', max:51}, {label:'Até 55.0kg', max:55}, {label:'Até 59.0kg', max:59}, {label:'Até 63.0kg', max:63}, {label:'Acima', max:999} ]
  },
  juvenil: {
    masculino: [ {label:'Galo', max:55.0}, {label:'Pluma', max:61.5}, {label:'Pena', max:68.0}, {label:'Leve', max:74.0}, {label:'Médio', max:80.3}, {label:'Meio-Pesado', max:86.3}, {label:'Pesado', max:92.3}, {label:'Super-Pesado', max:97.5}, {label:'Pesadíssimo', max:999} ],
    feminino:  [ {label:'Galo', max:48.5}, {label:'Pluma', max:53.5}, {label:'Pena', max:58.5}, {label:'Leve', max:64.0}, {label:'Médio', max:69.0}, {label:'Meio-Pesado', max:74.0}, {label:'Pesado', max:79.3}, {label:'Super-Pesado', max:999} ]
  },
  adulto: {
    masculino: [ {label:'Galo', max:57.5}, {label:'Pluma', max:64.0}, {label:'Pena', max:70.0}, {label:'Leve', max:76.0}, {label:'Médio', max:82.3}, {label:'Meio-Pesado', max:88.3}, {label:'Pesado', max:94.3}, {label:'Super-Pesado', max:100.5}, {label:'Pesadíssimo', max:999} ],
    feminino:  [ {label:'Galo', max:48.5}, {label:'Pluma', max:53.5}, {label:'Pena', max:58.5}, {label:'Leve', max:64.0}, {label:'Médio', max:69.0}, {label:'Meio-Pesado', max:74.0}, {label:'Pesado', max:79.3}, {label:'Super-Pesado', max:999} ]
  },
  master1: {
    masculino: [ {label:'Galo', max:57.5}, {label:'Pluma', max:64.0}, {label:'Pena', max:70.0}, {label:'Leve', max:76.0}, {label:'Médio', max:82.3}, {label:'Meio-Pesado', max:88.3}, {label:'Pesado', max:94.3}, {label:'Super-Pesado', max:100.5}, {label:'Pesadíssimo', max:999} ],
    feminino:  [ {label:'Galo', max:48.5}, {label:'Pluma', max:53.5}, {label:'Pena', max:58.5}, {label:'Leve', max:64.0}, {label:'Médio', max:69.0}, {label:'Meio-Pesado', max:74.0}, {label:'Pesado', max:79.3}, {label:'Super-Pesado', max:999} ]
  },
  master2: {
    masculino: [ {label:'Galo', max:57.5}, {label:'Pluma', max:64.0}, {label:'Pena', max:70.0}, {label:'Leve', max:76.0}, {label:'Médio', max:82.3}, {label:'Meio-Pesado', max:88.3}, {label:'Pesado', max:94.3}, {label:'Super-Pesado', max:100.5}, {label:'Pesadíssimo', max:999} ],
    feminino:  [ {label:'Galo', max:48.5}, {label:'Pluma', max:53.5}, {label:'Pena', max:58.5}, {label:'Leve', max:64.0}, {label:'Médio', max:69.0}, {label:'Meio-Pesado', max:74.0}, {label:'Pesado', max:79.3}, {label:'Super-Pesado', max:999} ]
  },
  master3: {
    masculino: [ {label:'Galo', max:57.5}, {label:'Pluma', max:64.0}, {label:'Pena', max:70.0}, {label:'Leve', max:76.0}, {label:'Médio', max:82.3}, {label:'Meio-Pesado', max:88.3}, {label:'Pesado', max:94.3}, {label:'Super-Pesado', max:100.5}, {label:'Pesadíssimo', max:999} ],
    feminino:  [ {label:'Galo', max:48.5}, {label:'Pluma', max:53.5}, {label:'Pena', max:58.5}, {label:'Leve', max:64.0}, {label:'Médio', max:69.0}, {label:'Meio-Pesado', max:74.0}, {label:'Pesado', max:79.3}, {label:'Super-Pesado', max:999} ]
  },
  master4: {
    masculino: [ {label:'Galo', max:57.5}, {label:'Pluma', max:64.0}, {label:'Pena', max:70.0}, {label:'Leve', max:76.0}, {label:'Médio', max:82.3}, {label:'Meio-Pesado', max:88.3}, {label:'Pesado', max:94.3}, {label:'Super-Pesado', max:100.5}, {label:'Pesadíssimo', max:999} ],
    feminino:  [ {label:'Galo', max:48.5}, {label:'Pluma', max:53.5}, {label:'Pena', max:58.5}, {label:'Leve', max:64.0}, {label:'Médio', max:69.0}, {label:'Meio-Pesado', max:74.0}, {label:'Pesado', max:79.3}, {label:'Super-Pesado', max:999} ]
  },
  master5: {
    masculino: [ {label:'Galo', max:57.5}, {label:'Pluma', max:64.0}, {label:'Pena', max:70.0}, {label:'Leve', max:76.0}, {label:'Médio', max:82.3}, {label:'Meio-Pesado', max:88.3}, {label:'Pesado', max:94.3}, {label:'Super-Pesado', max:100.5}, {label:'Pesadíssimo', max:999} ],
    feminino:  [ {label:'Galo', max:48.5}, {label:'Pluma', max:53.5}, {label:'Pena', max:58.5}, {label:'Leve', max:64.0}, {label:'Médio', max:69.0}, {label:'Meio-Pesado', max:74.0}, {label:'Pesado', max:79.3}, {label:'Super-Pesado', max:999} ]
  },
  master6: {
    masculino: [ {label:'Galo', max:57.5}, {label:'Pluma', max:64.0}, {label:'Pena', max:70.0}, {label:'Leve', max:76.0}, {label:'Médio', max:82.3}, {label:'Meio-Pesado', max:88.3}, {label:'Pesado', max:94.3}, {label:'Super-Pesado', max:100.5}, {label:'Pesadíssimo', max:999} ],
    feminino:  [ {label:'Galo', max:48.5}, {label:'Pluma', max:53.5}, {label:'Pena', max:58.5}, {label:'Leve', max:64.0}, {label:'Médio', max:69.0}, {label:'Meio-Pesado', max:74.0}, {label:'Pesado', max:79.3}, {label:'Super-Pesado', max:999} ]
  },
  master7: {
    masculino: [ {label:'Galo', max:57.5}, {label:'Pluma', max:64.0}, {label:'Pena', max:70.0}, {label:'Leve', max:76.0}, {label:'Médio', max:82.3}, {label:'Meio-Pesado', max:88.3}, {label:'Pesado', max:94.3}, {label:'Super-Pesado', max:100.5}, {label:'Pesadíssimo', max:999} ],
    feminino:  [ {label:'Galo', max:48.5}, {label:'Pluma', max:53.5}, {label:'Pena', max:58.5}, {label:'Leve', max:64.0}, {label:'Médio', max:69.0}, {label:'Meio-Pesado', max:74.0}, {label:'Pesado', max:79.3}, {label:'Super-Pesado', max:999} ]
  }
};

// 4) Mapeia faixa para "grupo de faixa" dependendo da idade
function beltGroup(age, belt) {
  if (age <= 15) return normalizeKidsBelt(belt);
  // Juvenil/Adulto/Master usam faixas normais
  const b = belt.toLowerCase();
  const allowed = ['branca','azul','roxa','marrom','preta'];
  if (!allowed.includes(b)) return 'branca'; // fallback seguro
  return b;
}

function pickDivision(age) {
  return divisions.find(d => age >= d.min && age <= d.max)?.key || 'adulto';
}

function pickWeightClass(divisionKey, gender, weightKg) {
  const table = weightTables[divisionKey]?.[gender];
  if (!table) return {label: 'Aberto', max: 999};
  return table.find(w => Number(weightKg) <= w.max) || table[table.length-1];
}

export function categorizeAthlete({ age, belt, gender, weight_kg }) {
  const division = pickDivision(age);
  const belt_group = beltGroup(age, belt);
  const weight = pickWeightClass(division, gender, Number(weight_kg));
  const is_absolute = 0;
  const weight_label = weight.label;
  const category_key = `${division}-${gender}-${belt_group}-${weight_label}`;
  return { division, belt_group, gender, weight_class: weight_label, category_key, is_absolute };
}
