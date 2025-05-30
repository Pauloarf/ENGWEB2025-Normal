const fs = require('fs');
const path = require('path');

// Caminhos
const inputPath = path.join(__dirname, 'rawDB', 'eurovisao.json');
const outputPath = path.join(__dirname, 'db', 'eurovisao.json');

// Utilitário para limpar nomes de chaves inválidas no MongoDB
function sanitizeKey(key) {
  return key.replace(/\./g, '_').replace(/\$/g, '');
}

// Garante que todos os objetos têm as mesmas chaves
function uniformizeKeys(array) {
  const allKeys = new Set();

  array.forEach(obj => {
    Object.keys(obj).forEach(key => allKeys.add(key));
  });

  return array.map(obj => {
    const newObj = {};
    allKeys.forEach(key => {
      newObj[key] = obj.hasOwnProperty(key) ? obj[key] : null;
    });
    return newObj;
  });
}

// Normaliza músicas de cada edição
function normalizeMusicList(musicas) {
  return musicas.map(m => {
    const normalized = {};
    for (let key in m) {
      let newKey = sanitizeKey(key);
      let value = m[key];

      // Corrigir tipo (número em string → número)
      if (typeof value === 'string' && /^\d+$/.test(value)) {
        value = Number(value);
      }

      // Corrigir múltiplos nomes juntos
      if (newKey === 'intérprete' && typeof value === 'string') {
        value = value.split('  ').map(s => s.trim());
        if (value.length === 1) value = value[0]; // manter como string se único
      }

      normalized[newKey] = value;
    }

    // Uniformizar campos esperados
    const expectedFields = ['id', 'link', 'título', 'país', 'compositor', 'intérprete', 'letra'];
    expectedFields.forEach(field => {
      if (!normalized.hasOwnProperty(field)) {
        normalized[field] = null;
      }
    });

    return normalized;
  });
}

// Carrega, transforma e grava
function processEurovisao() {
  // Verifica se ficheiro existe
  if (!fs.existsSync(inputPath)) {
    console.error(`Erro: ficheiro não encontrado em ${inputPath}`);
    return;
  }

  // Ler JSON bruto
  const rawData = fs.readFileSync(inputPath, 'utf8');
  let rawJson;

  try {
    rawJson = JSON.parse(rawData);
  } catch (e) {
    console.error('Erro ao fazer parse do JSON:', e.message);
    return;
  }

  const normalizedArray = [];

  // Processar cada edição
  for (const edicaoId in rawJson) {
    const edicao = rawJson[edicaoId];
    const normalized = {};

    for (let key in edicao) {
      const cleanKey = sanitizeKey(key);
      let value = edicao[key];

      if (cleanKey === 'musicas' && Array.isArray(value)) {
        value = normalizeMusicList(value);
      }

      if (typeof value === 'string' && /^\d+$/.test(value) && cleanKey === 'anoEdição') {
        value = Number(value);
      }

      normalized[cleanKey] = value;
    }

    // Uniformizar campos esperados nas edições
    const expectedFields = ['id', 'anoEdição', 'musicas', 'organizacao', 'vencedor'];
    expectedFields.forEach(field => {
      if (!normalized.hasOwnProperty(field)) {
        normalized[field] = null;
      }
    });

    normalizedArray.push(normalized);
  }

  // Garante que todos os objetos têm as mesmas chaves
  const finalArray = uniformizeKeys(normalizedArray);

  // Cria diretório de output se necessário
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Escreve ficheiro final
  fs.writeFileSync(outputPath, JSON.stringify(finalArray, null, 2), 'utf8');
  console.log(`✔ Ficheiro normalizado gravado em ${outputPath}`);
}

// Executar
processEurovisao();
