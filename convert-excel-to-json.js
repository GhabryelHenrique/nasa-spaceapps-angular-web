const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Caminho do arquivo Excel
const excelFilePath = path.join(__dirname, 'src', 'assets', 'data', 'INSCRICAO DO NASA SPACE APPS 2025 (respostas) (5).xlsx');
const outputJsonPath = path.join(__dirname, 'src', 'assets', 'data', 'registrations.json');

// Função para extrair DDD do telefone
function extractDDD(phone) {
  if (!phone) return '';
  const numbersOnly = String(phone).replace(/\D/g, '');
  if (numbersOnly.length >= 10) {
    return numbersOnly.substring(0, 2);
  }
  return '';
}

// Função para anonimizar nome (mantém apenas iniciais)
function anonymizeName(name) {
  if (!name) return '';
  const parts = String(name).trim().split(' ');
  if (parts.length === 0) return '';

  // Retorna apenas as iniciais
  return parts.map(part => part.charAt(0).toUpperCase()).join('.');
}

// Função para ocultar CPF (mantém apenas os 3 primeiros dígitos)
function anonymizeCPF(cpf) {
  if (!cpf) return '';
  const numbersOnly = String(cpf).replace(/\D/g, '');
  if (numbersOnly.length < 3) return '***';

  // Mantém os 3 primeiros dígitos e oculta o resto
  return numbersOnly.substring(0, 3) + '.***.***-**';
}

try {
  console.log('Lendo arquivo Excel:', excelFilePath);

  // Lê o arquivo Excel
  const workbook = XLSX.readFile(excelFilePath);

  // Pega a primeira planilha
  const sheetName = workbook.SheetNames[0];
  console.log('Nome da planilha:', sheetName);

  const worksheet = workbook.Sheets[sheetName];

  // Converte para JSON
  const rawData = XLSX.utils.sheet_to_json(worksheet);

  console.log(`Total de registros encontrados: ${rawData.length}`);

  // Processa os dados para ocultar informações sensíveis
  const processedData = rawData.map(row => {
    // Detecta automaticamente os nomes das colunas (podem variar)
    const keys = Object.keys(row);

    return {
      timestamp: row[keys[0]] || '',
      name: anonymizeName(row[keys[1]]), // Anonimiza nome
      email: '', // Remove email completamente
      phone: row[keys[3]] || '',
      cpf: anonymizeCPF(row[keys[4]]), // Anonimiza CPF
      city: row[keys[5]] || '',
      education: row[keys[6]] || '',
      birthDate: row[keys[7]] || '',
      participationMode: row[keys[8]] || '',
      emailAddress: '', // Remove email secundário
      interestAreas: row[keys[10]] || '',
      howHeard: row[keys[11]] || '',
      ddd: extractDDD(row[keys[3]]),
      gender: row[keys[12]] || ''
    };
  });

  // Salva o JSON processado
  fs.writeFileSync(outputJsonPath, JSON.stringify(processedData, null, 2), 'utf8');

  console.log(`✅ Arquivo JSON criado com sucesso: ${outputJsonPath}`);
  console.log(`Total de registros processados: ${processedData.length}`);
  console.log('\nExemplo do primeiro registro (com dados anonimizados):');
  console.log(JSON.stringify(processedData[0], null, 2));

} catch (error) {
  console.error('❌ Erro ao converter arquivo:', error);
  process.exit(1);
}
