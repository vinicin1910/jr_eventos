// backend/src/categories-config.js

// 1) Normaliza faixas infantis
// - branca emparelha com cinza (inclui variações)
// - amarelo, laranja e verde juntos (inclui variações)
export function normalizeKidsBelt(belt) {
  const b = String(belt || '').toLowerCase().trim();
  const gray = ['cinza','cinza/branca','cinza/preta','branca'];
  const ylg = [
    'amarela','amarela/branca','amarela/preta',
    'laranja','laranja/branca','laranja/preta',
    'verde','verde/branca','verde/preta',
  ];
  if (gray.includes(b)) return 'kids_gray_merged';
  if (ylg.includes(b)) return 'kids_yellow_orange_green';
  return b; // juvenil/adulto/master usam a própria (branca, azul, roxa, marrom, preta)
}

// 2) Divisões por idade (atualizadas conforme solicitado)
const divisions = [
  { key: 'pre-mirim-1',        label: 'Pré-Mirim 1',        min: 4,  max: 5 },
  { key: 'pre-mirim-2',        label: 'Pré-Mirim 2',        min: 6,  max: 7 },
  { key: 'mirim',              label: 'Mirim',              min: 8,  max: 9 },
  { key: 'infantil-1',         label: 'Infantil 1',         min: 10, max: 11 },
  { key: 'infanto-juvenil-1',  label: 'Infanto-Juvenil 1',  min: 12, max: 13 },
  { key: 'infanto-juvenil-2',  label: 'Infanto-Juvenil 2',  min: 14, max: 15 },
  { key: 'juvenil',            label: 'Juvenil',            min: 16, max: 17 },
  { key: 'adulto',             label: 'Adulto',             min: 18, max: 29 },
  { key: 'master-1',           label: 'Master 1',           min: 30, max: 35 },
  { key: 'master-2',           label: 'Master 2',           min: 36, max: 40 },
  { key: 'master-3',           label: 'Master 3',           min: 41, max: 45 },
  { key: 'master-4',           label: 'Master 4',           min: 46, max: 50 },
  { key: 'master-5',           label: 'Master 5',           min: 51, max: 55 },
  { key: 'master-6',           label: 'Master 6',           min: 56, max: 60 },
  { key: 'master-7',           label: 'Master 7',           min: 61, max: 99 }
];

// 3) Tabelas de peso por divisão e gênero (base CBJJ adaptada; ajuste se necessário)
const weightTables = {
  'pre-mirim-1': {
    masculino: [
      { label:'Até 19.0kg', max:19 }, { label:'Até 23.0kg', max:23 },
      { label:'Até 27.0kg', max:27 }, { label:'Acima', max:999 }
    ],
    feminino: [
      { label:'Até 19.0kg', max:19 }, { label:'Até 23.0kg', max:23 },
      { label:'Até 27.0kg', max:27 }, { label:'Acima', max:999 }
    ]
  },
  'pre-mirim-2': {
    masculino: [
      { label:'Até 21.0kg', max:21 }, { label:'Até 25.0kg', max:25 },
      { label:'Até 29.0kg', max:29 }, { label:'Até 33.0kg', max:33 },
      { label:'Acima', max:999 }
    ],
    feminino: [
      { label:'Até 21.0kg', max:21 }, { label:'Até 25.0kg', max:25 },
      { label:'Até 29.0kg', max:29 }, { label:'Até 33.0kg', max:33 },
      { label:'Acima', max:999 }
    ]
  },
  mirim: {
    masculino: [
      { label:'Até 25.0kg', max:25 }, { label:'Até 29.0kg', max:29 },
      { label:'Até 33.0kg', max:33 }, { label:'Até 37.0kg', max:37 },
      { label:'Acima', max:999 }
    ],
    feminino: [
      { label:'Até 25.0kg', max:25 }, { label:'Até 29.0kg', max:29 },
      { label:'Até 33.0kg', max:33 }, { label:'Até 37.0kg', max:37 },
      { label:'Acima', max:999 }
    ]
  },
  'infantil-1': {
    masculino: [
      { label:'Até 29.0kg', max:29 }, { label:'Até 33.0kg', max:33 },
      { label:'Até 37.0kg', max:37 }, { label:'Até 41.0kg', max:41 },
      { label:'Acima', max:999 }
    ],
    feminino: [
      { label:'Até 29.0kg', max:29 }, { label:'Até 33.0kg', max:33 },
      { label:'Até 37.0kg', max:37 }, { label:'Até 41.0kg', max:41 },
      { label:'Acima', max:999 }
    ]
  },
  'infanto-juvenil-1': {
    masculino: [
      { label:'Até 38.0kg', max:38 }, { label:'Até 42.0kg', max:42 },
      { label:'Até 46.0kg', max:46 }, { label:'Até 50.0kg', max:50 },
      { label:'Até 54.0kg', max:54 }, { label:'Acima', max:999 }
    ],
    feminino: [
      { label:'Até 38.0kg', max:38 }, { label:'Até 42.0kg', max:42 },
      { label:'Até 46.0kg', max:46 }, { label:'Até 50.0kg', max:50 },
      { label:'Até 54.0kg', max:54 }, { label:'Acima', max:999 }
    ]
  },
  'infanto-juvenil-2': {
    masculino: [
      { label:'Até 42.0kg', max:42 }, { label:'Até 46.0kg', max:46 },
      { label:'Até 50.0kg', max:50 }, { label:'Até 54.0kg', max:54 },
      { label:'Até 58.0kg', max:58 }, { label:'Acima', max:999 }
    ],
    feminino: [
      { label:'Até 42.0kg', max:42 }, { label:'Até 46.0kg', max:46 },
      { label:'Até 50.0kg', max:50 }, { label:'Até 54.0kg', max:54 },
      { label:'Até 58.0kg', max:58 }, { label:'Acima', max:999 }
    ]
  },
  juvenil: {
    masculino: [
      { label:'Galo', max:55.0 }, { label:'Pluma', max:61.5 },
      { label:'Pena', max:68.0 }, { label:'Leve', max:74.0 },
      { label:'Médio', max:80.3 }, { label:'Meio-Pesado', max:86.3 },
      { label:'Pesado', max:92.3 }, { label:'Super-Pesado', max:97.5 },
      { label:'Pesadíssimo', max:999 }
    ],
    feminino: [
      { label:'Galo', max:48.5 }, { label:'Pluma', max:53.5 },
      { label:'Pena', max:58.5 }, { label:'Leve', max:64.0 },
      { label:'Médio', max:69.0 }, { label:'Meio-Pesado', max:74.0 },
      { label:'Pesado', max:79.3 }, { label:'Super-Pesado', max:999 }
    ]
  },
  adulto: {
    masculino: [
      { label:'Galo', max:57.5 }, { label:'Pluma', max:64.0 },
      { label:'Pena', max:70.0 }, { label:'Leve', max:76.0 },
      { label:'Médio', max:82.3 }, { label:'Meio-Pesado', max:88.3 },
      { label:'Pesado', max:94.3 }, { label:'Super-Pesado', max:100.5 },
      { label:'Pesadíssimo', max:999 }
    ],
    feminino: [
      { label:'Galo', max:48.5 }, { label:'Pluma', max:53.5 },
      { label:'Pena', max:58.5 }, { label:'Leve', max:64.0 },
      { label:'Médio', max:69.0 }, { label:'Meio-Pesado', max:74.0 },
      { label:'Pesado', max:79.3 }, { label:'Super-Pesado', max:999 }
    ]
  },
  // Masters (usando, por padrão, as mesmas faixas de Adulto; ajuste se quiser)
  'master-1': {
    masculino: [
      { label:'Galo', max:57.5 }, { label:'Pluma', max:64.0 },
      { label:'Pena', max:70.0 }, { label:'Leve', max:76.0 },
      { label:'Médio', max:82.3 }, { label:'Meio-Pesado', max:88.3 },
      { label:'Pesado', max:94.3 }, { label:'Super-Pesado', max:100.5 },
      { label:'Pesadíssimo', max:999 }
    ],
    feminino: [
      { label:'Galo', max:48.5 }, { label:'Pluma', max:53.5 },
      { label:'Pena', max:58.5 }, { label:'Leve', max:64.0 },
      { label:'Médio', max:69.0 }, { label:'Meio-Pesado', max:74.0 },
      { label:'Pesado', max:79.3 }, { label:'Super-Pesado', max:999 }
    ]
  },
  'master-2': {
    masculino: [
      { label:'Galo', max:57.5 }, { label:'Pluma', max:64.0 },
      { label:'Pena', max:70.0 }, { label:'Leve', max:76.0 },
      { label:'Médio', max:82.3 }, { label:'Meio-Pesado', max:88.3 },
      { label:'Pesado', max:94.3 }, { label:'Super-Pesado', max:100.5 },
      { label:'Pesadíssimo', max:999 }
    ],
    feminino: [
      { label:'Galo', max:48.5 }, { label:'Pluma', max:53.5 },
      { label:'Pena', max:58.5 }, { label:'Leve', max:64.0 },
      { label:'Médio', max:69.0 }, { label:'Meio-Pesado', max:74.0 },
      { label:'Pesado', max:79.3 }, { label:'Super-Pesado', max:999 }
    ]
  },
  'master-3': {
    masculino: [
      { label:'Galo', max:57.5 }, { label:'Pluma', max:64.0 },
      { label:'Pena', max:70.0 }, { label:'Leve', max:76.0 },
      { label:'Médio', max:82.3 }, { label:'Meio-Pesado', max:88.3 },
      { label:'Pesado', max:94.3 }, { label:'Super-Pesado', max:100.5 },
      { label:'Pesadíssimo', max:999 }
    ],
    feminino: [
      { label:'Galo', max:48.5 }, { label:'Pluma', max:53.5 },
      { label:'Pena', max:58.5 }, { label:'Leve', max:64.0 },
      { label:'Médio', max:69.0 }, { label:'Meio-Pesado', max:74.0 },
      { label:'Pesado', max:79.3 }, { label:'Super-Pesado', max:999 }
    ]
  },
  'master-4': {
    masculino: [
      { label:'Galo', max:57.5 }, { label:'Pluma', max:64.0 },
      { label:'Pena', max:70.0 }, { label:'Leve', max:76.0 },
      { label:'Médio', max:82.3 }, { label:'Meio-Pesado', max:88.3 },
      { label:'Pesado', max:94.3 }, { label:'Super-Pesado', max:100.5 },
      { label:'Pesadíssimo', max:999 }
    ],
    feminino: [
      { label:'Galo', max:48.5 }, { label:'Pluma', max:53.5 },
      { label:'Pena', max:58.5 }, { label:'Leve', max:64.0 },
      { label:'Médio', max:69.0 }, { label:'Meio-Pesado', max:74.0 },
      { label:'Pesado', max:79.3 }, { label:'Super-Pesado', max:999 }
    ]
  },
  'master-5': {
    masculino: [
      { label:'Galo', max:57.5 }, { label:'Pluma', max:64.0 },
      { label:'Pena', max:70.0 }, { label:'Leve', max:76.0 },
      { label:'Médio', max:82.3 }, { label:'Meio-Pesado', max:88.3 },
      { label:'Pesado', max:94.3 }, { label:'Super-Pesado', max:100.5 },
      { label:'Pesadíssimo', max:999 }
    ],
    feminino: [
      { label:'Galo', max:48.5 }, { label:'Pluma', max:53.5 },
      { label:'Pena', max:58.5 }, { label:'Leve', max:64.0 },
      { label:'Médio', max:69.0 }, { label:'Meio-Pesado', max:74.0 },
      { label:'Pesado', max:79.3 }, { label:'Super-Pesado', max:999 }
    ]
  },
  'master-6': {
    masculino: [
      { label:'Galo', max:57.5 }, { label:'Pluma', max:64.0 },
      { label:'Pena', max:70.0 }, { label:'Leve', max:76.0 },
      { label:'Médio', max:82.3 }, { label:'Meio-Pesado', max:88.3 },
      { label:'Pesado', max:94.3 }, { label:'Super-Pesado', max:100.5 },
      { label:'Pesadíssimo', max:999 }
    ],
    feminino: [
      { label:'Galo', max:48.5 }, { label:'Pluma', max:53.5 },
      { label:'Pena', max:58.5 }, { label:'Leve', max:64.0 },
      { label:'Médio', max:69.0 }, { label:'Meio-Pesado', max:74.0 },
      { label:'Pesado', max:79.3 }, { label:'Super-Pesado', max:999 }
    ]
  },
  'master-7': {
    masculino: [
      { label:'Galo', max:57.5 }, { label:'Pluma', max:64.0 },
      { label:'Pena', max:70.0 }, { label:'Leve', max:76.0 },
      { label:'Médio', max:82.3 }, { label:'Meio-Pesado', max:88.3 },
      { label:'Pesado', max:94.3 }, { label:'Super-Pesado', max:100.5 },
      { label:'Pesadíssimo', max:999 }
    ],
    feminino: [
      { label:'Galo', max:48.5 }, { label:'Pluma', max:53.5 },
      { label:'Pena', max:58.5 }, { label:'Leve', max:64.0 },
      { label:'Médio', max:69.0 }, { label:'Meio-Pesado', max:74.0 },
      { label:'Pesado', max:79.3 }, { label:'Super-Pesado', max:999 }
    ]
  }
};

// 4) Helpers

function normalizeGender(gender) {
  const g = String(gender || '').toLowerCase().trim();
  if (g === 'm' || g === 'masculino') return 'masculino';
  if (g === 'f' || g === 'feminino') return 'feminino';
  // fallback seguro
  return 'masculino';
}

function beltGroup(age, belt) {
  if (Number(age) <= 15) return normalizeKidsBelt(belt);
  const b = String(belt || '').toLowerCase().trim();
  const allowed = ['branca','azul','roxa','marrom','preta'];
  if (!allowed.includes(b)) return 'branca';
  return b;
}

function pickDivision(age) {
  const a = Number(age);
  return divisions.find(d => a >= d.min && a <= d.max)?.key || 'adulto';
}

function pickWeightClass(divisionKey, gender, weightKg) {
  const gKey = normalizeGender(gender);
  const table = weightTables[divisionKey]?.[gKey];
  if (!table) return { label: 'Aberto', max: 999 };
  const found = table.find(w => Number(weightKg) <= w.max);
  return found || table[table.length - 1];
}

// 5) API principal de categorização
export function categorizeAthlete({ age, belt, gender, weight_kg }) {
  const division = pickDivision(age);
  const belt_group = beltGroup(age, belt);
  const weight = pickWeightClass(division, gender, Number(weight_kg));
  const weight_label = weight.label;
  const genderKey = normalizeGender(gender);

  // Category key estável e legível
  const category_key = `${division}-${genderKey}-${belt_group}-${weight_label}`;

  // absoluto é tratado fora (inscrição separada)
  const is_absolute = 0;

  return {
    division,
    belt_group,
    gender: genderKey,
    weight_class: weight_label,
    category_key,
    is_absolute
  };
}

// (Opcional) exporta as tabelas para uso em telas/configurações
export const DIVISIONS = divisions;
export const WEIGHT_TABLES = weightTables;
