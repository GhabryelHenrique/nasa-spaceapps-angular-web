import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

export interface RegistrationData {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  motivations: string;
  experience: string;
  interests: string;
  availability: string;
  expectations: string;
}

export interface RegistrationStats {
  totalRegistrations: number;
  uberlandiaRegistrations: number;
  dailyRegistrations: { date: string; count: number }[];
  motivationStats: { motivation: string; count: number }[];
  experienceStats: { level: string; count: number }[];
  cityStats: { city: string; count: number }[];
  averagePerDay: number;
  ageStats: { ageGroup: string; count: number }[];
  participationModeStats: { mode: string; count: number }[];
  phoneAreaStats: { area: string; count: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationDataService {
  private registrationData: RegistrationData[] = [];

  constructor() {}

  private parseValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Se é um objeto Date, converte para string formatada
    if (value instanceof Date) {
      return value.toISOString();
    }

    // Se é um número, converte para string
    if (typeof value === 'number') {
      // Se parece ser uma data serial do Excel (números grandes)
      if (value > 40000 && value < 60000) {
        try {
          const excelDate = new Date((value - 25569) * 86400 * 1000);
          return excelDate.toISOString();
        } catch {
          return String(value);
        }
      }
      return String(value);
    }

    // Converte para string e limpa espaços
    let stringValue = String(value).trim();

    // Remove caracteres especiais problemáticos
    stringValue = stringValue.replace(/[\r\n\t]/g, ' ');
    stringValue = stringValue.replace(/\s+/g, ' ');

    return stringValue;
  }

  getRegistrationStats(): RegistrationStats {
    const totalRegistrations = this.registrationData.length;
    const uberlandiaRegistrations = this.registrationData.filter(
      reg => reg.city.toLowerCase().includes('uberlândia') ||
             reg.city.toLowerCase().includes('uberlandia')
    ).length;

    // Calcular registros por dia
    const dailyMap = new Map<string, number>();
    this.registrationData.forEach(reg => {
      if (reg.timestamp) {
        try {
          const date = new Date(reg.timestamp);
          if (isNaN(date.getTime())) {
            // Se a data é inválida, usa data atual
            const currentDate = new Date().toISOString().split('T')[0];
            dailyMap.set(currentDate, (dailyMap.get(currentDate) || 0) + 1);
          } else {
            const dateStr = date.toISOString().split('T')[0];
            dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1);
          }
        } catch (dateError) {
          console.warn('Erro ao processar timestamp:', reg.timestamp, dateError);
          // Se falhar, usa data atual
          const currentDate = new Date().toISOString().split('T')[0];
          dailyMap.set(currentDate, (dailyMap.get(currentDate) || 0) + 1);
        }
      }
    });

    const dailyRegistrations = Array.from(dailyMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calcular média por dia
    const averagePerDay = dailyRegistrations.length > 0
      ? totalRegistrations / dailyRegistrations.length
      : 0;

    // Estatísticas de principais motivadores (baseado em escolaridade e perfil)
    const motivationStats = this.calculateMotivationStats();

    // Estatísticas de experiência
    const experienceMap = new Map<string, number>();
    this.registrationData.forEach(reg => {
      if (reg.experience) {
        experienceMap.set(reg.experience, (experienceMap.get(reg.experience) || 0) + 1);
      }
    });

    const experienceStats = Array.from(experienceMap.entries())
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => b.count - a.count);

    // Estatísticas de cidade
    const cityStats = this.calculateCityStats();

    // Estatísticas de idade
    const ageStats = this.calculateAgeStats();

    // Estatísticas de modo de participação
    const participationModeStats = this.calculateParticipationModeStats();

    // Estatísticas de código de área (DDD)
    const phoneAreaStats = this.calculatePhoneAreaStats();

    return {
      totalRegistrations,
      uberlandiaRegistrations,
      dailyRegistrations,
      motivationStats,
      experienceStats,
      cityStats,
      averagePerDay: Math.round(averagePerDay * 100) / 100,
      ageStats,
      participationModeStats,
      phoneAreaStats
    };
  }

  getRegistrationData(): RegistrationData[] {
    return this.registrationData;
  }

  setRegistrationData(data: RegistrationData[]): void {
    this.registrationData = data;
  }

  private calculateAgeStats(): { ageGroup: string; count: number }[] {
    const ageGroups = new Map<string, number>();

    this.registrationData.forEach(reg => {
      if (reg.interests) {
        try {
          // reg.interests agora contém a data de nascimento como string
          let birthDate: Date;
          
          // Tenta diferentes formatos de data
          const birthDateStr = reg.interests.trim();
          
          // Formato brasileiro: DD/MM/YYYY
          const brazilianDatePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
          const match = birthDateStr.match(brazilianDatePattern);
          
          if (match) {
            const [, day, month, year] = match;
            birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else {
            // Tenta parsing direto
            birthDate = new Date(birthDateStr);
          }
          
          if (!isNaN(birthDate.getTime())) {
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }

            // Validação de idade razoável (entre 10 e 100 anos)
            if (age >= 10 && age <= 100) {
              let ageGroup: string;
              if (age < 20) ageGroup = '< 20 anos';
              else if (age < 25) ageGroup = '20-24 anos';
              else if (age < 30) ageGroup = '25-29 anos';
              else if (age < 35) ageGroup = '30-34 anos';
              else ageGroup = '35+ anos';

              ageGroups.set(ageGroup, (ageGroups.get(ageGroup) || 0) + 1);
            } else {
              console.warn('Idade inválida calculada:', age, 'para data:', birthDateStr);
            }
          } else {
            console.warn('Data de nascimento inválida:', birthDateStr);
          }
        } catch (error) {
          console.warn('Erro ao calcular idade:', error, 'para:', reg.interests);
        }
      }
    });

    return Array.from(ageGroups.entries())
      .map(([ageGroup, count]) => ({ ageGroup, count }))
      .sort((a, b) => {
        const order = ['< 20 anos', '20-24 anos', '25-29 anos', '30-34 anos', '35+ anos'];
        return order.indexOf(a.ageGroup) - order.indexOf(b.ageGroup);
      });
  }

  private calculateParticipationModeStats(): { mode: string; count: number }[] {
    const modeMap = new Map<string, number>();

    this.registrationData.forEach(reg => {
      if (reg.availability) {
        const availability = reg.availability.toLowerCase();
        let mode: string;

        if (availability.includes('remotamente de qualquer lugar do mundo')) {
          mode = '💻 Remoto';
        } else if (availability.includes('presencialmente em uberlândia')) {
          mode = '👥 Presencial';
        } else {
          mode = '❓ Não especificado';
        }

        modeMap.set(mode, (modeMap.get(mode) || 0) + 1);
      }
    });

    return Array.from(modeMap.entries())
      .map(([mode, count]) => ({ mode, count }))
      .sort((a, b) => b.count - a.count);
  }

  private calculatePhoneAreaStats(): { area: string; count: number }[] {
    const areaMap = new Map<string, number>();

    this.registrationData.forEach(reg => {
      if (reg.phone) {
        let phoneStr = String(reg.phone).replace(/\D/g, '');
        
        // Remove o código do país 55 se presente
        if (phoneStr.length >= 12 && phoneStr.startsWith('55')) {
          phoneStr = phoneStr.substring(2);
        }
        
        if (phoneStr.length >= 10) {
          const area = phoneStr.substring(0, 2);
          const areaName = this.getAreaName(area);
          areaMap.set(areaName, (areaMap.get(areaName) || 0) + 1);
        }
      }
    });

    return Array.from(areaMap.entries())
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }

  private getAreaName(ddd: string): string {
    const areas: { [key: string]: string } = {
      '11': 'São Paulo (11)',
      '21': 'Rio de Janeiro (21)',
      '31': 'Belo Horizonte (31)',
      '34': 'Uberlândia (34)',
      '85': 'Fortaleza (85)',
      '47': 'Joinville (47)',
      '22': 'Campos/RJ (22)',
      '16': 'Ribeirão Preto (16)',
      '61': 'Brasília (61)',
      '38': 'Montes Claros (38)',
      '64': 'Rio Verde (64)'
    };

    return areas[ddd] || `DDD ${ddd}`;
  }

  private calculateMotivationStats(): { motivation: string; count: number }[] {
    const motivationMap = new Map<string, number>();

    this.registrationData.forEach(reg => {
      if (reg.motivations) {
        const normalizedMotivation = this.normalizeMotivation(reg.motivations);
        const groupedMotivation = this.findSimilarMotivation(normalizedMotivation, motivationMap);

        if (groupedMotivation) {
          motivationMap.set(groupedMotivation, (motivationMap.get(groupedMotivation) || 0) + 1);
        } else {
          motivationMap.set(normalizedMotivation, (motivationMap.get(normalizedMotivation) || 0) + 1);
        }
      }
    });

    return Array.from(motivationMap.entries())
      .map(([motivation, count]) => ({ motivation, count }))
      .sort((a, b) => b.count - a.count);
  }

  private normalizeMotivation(motivation: string): string {
    return motivation
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s]/g, '') // Remove pontuação
      .replace(/\s+/g, ' ') // Normaliza espaços
      .trim();
  }

  private findSimilarMotivation(newMotivation: string, existingMap: Map<string, number>): string | null {
    for (const existingMotivation of existingMap.keys()) {
      if (this.areMotivationsSimilar(newMotivation, existingMotivation)) {
        return existingMotivation;
      }
    }
    return null;
  }

  private areMotivationsSimilar(motivation1: string, motivation2: string): boolean {
    // 1. Verificação de inclusão (uma contém a outra)
    if (motivation1.includes(motivation2) || motivation2.includes(motivation1)) {
      return true;
    }

    // 2. Verificação de similaridade por palavras-chave
    const keywords1 = this.extractKeywords(motivation1);
    const keywords2 = this.extractKeywords(motivation2);

    const commonKeywords = keywords1.filter(word => keywords2.includes(word));
    const totalKeywords = new Set([...keywords1, ...keywords2]).size;

    // Se mais de 60% das palavras são comuns, considera similar
    const similarity = commonKeywords.length / Math.max(keywords1.length, keywords2.length);
    if (similarity > 0.6) {
      return true;
    }

    // 3. Verificação de distância de Levenshtein para textos curtos
    if (motivation1.length <= 20 && motivation2.length <= 20) {
      const distance = this.levenshteinDistance(motivation1, motivation2);
      const maxLength = Math.max(motivation1.length, motivation2.length);
      const similarity2 = 1 - (distance / maxLength);
      return similarity2 > 0.7;
    }

    return false;
  }

  private extractKeywords(text: string): string[] {
    const stopWords = ['o', 'a', 'os', 'as', 'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas',
                       'por', 'para', 'com', 'sem', 'sobre', 'ate', 'desde', 'entre', 'pela', 'pelo', 'pelas', 'pelos',
                       'e', 'ou', 'mas', 'que', 'se', 'como', 'quando', 'onde', 'porque', 'pois', 'assim',
                       'muito', 'mais', 'menos', 'bem', 'mal', 'melhor', 'pior', 'maior', 'menor',
                       'um', 'uma', 'uns', 'umas', 'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas',
                       'aquele', 'aquela', 'aqueles', 'aquelas', 'meu', 'minha', 'meus', 'minhas', 'seu', 'sua', 'seus', 'suas'];

    return text
      .split(' ')
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .filter(word => word.length > 0);
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private calculateCityStats(): { city: string; count: number }[] {
    const cityMap = new Map<string, number>();

    this.registrationData.forEach(reg => {
      if (reg.city) {
        const normalizedCity = this.normalizeCityName(reg.city);
        const groupedCity = this.findSimilarCity(normalizedCity, cityMap);
        
        if (groupedCity) {
          cityMap.set(groupedCity, (cityMap.get(groupedCity) || 0) + 1);
        } else {
          cityMap.set(normalizedCity, (cityMap.get(normalizedCity) || 0) + 1);
        }
      }
    });

    // Retorna todas as cidades (sem limitação)
    return Array.from(cityMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
  }

  private findSimilarCity(newCity: string, existingMap: Map<string, number>): string | null {
    for (const existingCity of existingMap.keys()) {
      if (this.areCitiesSimilar(newCity, existingCity)) {
        return existingCity;
      }
    }
    return null;
  }

  private areCitiesSimilar(city1: string, city2: string): boolean {
    const normalized1 = this.normalizeForComparison(city1);
    const normalized2 = this.normalizeForComparison(city2);

    // Verificação exata
    if (normalized1 === normalized2) {
      return true;
    }

    // Verificação de inclusão
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
      return true;
    }

    // Para cidades com nomes curtos, usa distância de Levenshtein
    if (normalized1.length <= 15 && normalized2.length <= 15) {
      const distance = this.levenshteinDistance(normalized1, normalized2);
      const maxLength = Math.max(normalized1.length, normalized2.length);
      const similarity = 1 - (distance / maxLength);
      return similarity > 0.8; // 80% de similaridade
    }

    return false;
  }

  private normalizeForComparison(city: string): string {
    return city
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s]/g, '') // Remove pontuação
      .replace(/\s+/g, '') // Remove espaços
      .trim();
  }

  private normalizeCityName(city: string): string {
    // Remove espaços extras, pontuação e normaliza
    let normalized = city.trim();

    // Remove sufixos comuns (estado, região, etc.)
    normalized = normalized.replace(/[,-].*$/, '').trim();
    normalized = normalized.replace(/\s*\([^)]*\)\s*/g, '').trim();
    normalized = normalized.replace(/\s*[-/]\s*(mg|minas gerais|sp|são paulo|rj|rio de janeiro|go|goias|goiás|pr|parana|paraná|sc|santa catarina|rs|rio grande do sul|ce|ceara|ceará|ba|bahia|pe|pernambuco|al|alagoas|ma|maranhao|maranhão|ms|mato grosso do sul|df|distrito federal|am|amazonas|se|sergipe)\s*$/gi, '').trim();

    // Correções específicas de ortografia e variações conhecidas
    const corrections: { [key: string]: string } = {
      // Uberlândia e variações
      'uberlandia': 'Uberlândia',
      'uberlândia': 'Uberlândia',
      'uber': 'Uberlândia',
      'uberl': 'Uberlândia',
      'ubêrlandia': 'Uberlândia',
      
      // Outras cidades principais
      'brasilia': 'Brasília',
      'brasília': 'Brasília',
      'sao paulo': 'São Paulo',
      'são paulo': 'São Paulo',
      'rio de janeiro': 'Rio de Janeiro',
      'belo horizonte': 'Belo Horizonte',
      'fortaleza': 'Fortaleza',
      'araguari mg': 'Araguari',
      'araguari minas gerais': 'Araguari',
      'catalao': 'Catalão',
      'catalão go': 'Catalão',
      'catalão goiás': 'Catalão',
      'uberaba mg': 'Uberaba',
      'ituiutaba': 'Ituiutaba',
      'patos de minas': 'Patos de Minas',
      'araxa': 'Araxá',
      'araxá mg': 'Araxá',
      'ibia': 'Ibiá',
      'ibiá mg': 'Ibiá',
      'goiatuba': 'Goiatuba',
      'aparecida de goiania': 'Aparecida de Goiânia',
      'aguas lindas de goias': 'Águas Lindas de Goiás',
      'aguas lindas de goiás': 'Águas Lindas de Goiás',
      'tres coroas': 'Três Coroas',
      'três coroas': 'Três Coroas',
      'foz do iguacu': 'Foz do Iguaçu',
      'foz do iguaçu': 'Foz do Iguaçu',
      'maceio': 'Maceió',
      'maceió alagoas': 'Maceió',
      'sao luis': 'São Luís',
      'são luís ma': 'São Luís',
      'saobernardo ma': 'São Bernardo',
      'são bernardo ma': 'São Bernardo',
      'rio quente go': 'Rio Quente',
      'corumbaiba go': 'Corumbaíba',
      'paranaiba ms': 'Paranaíba',
      'paranaíba ms': 'Paranaíba',
      'icaparaima pr': 'Icaraíma',
      'icaraíma pr': 'Icaraíma',
      'realeza pr': 'Realeza',
      'palhoca sc': 'Palhoça',
      'palhoça sc': 'Palhoça',
      'criciuma': 'Criciúma',
      'criciúma': 'Criciúma',
      'sapucaia do sul': 'Sapucaia do Sul',
      'catuipe': 'Catuípe',
      'belford roxo': 'Belford Roxo',
      'cabo frio rj': 'Cabo Frio',
      'nova iguacu': 'Nova Iguaçu',
      'nova iguaçu': 'Nova Iguaçu',
      'santo andre': 'Santo André',
      'santo andré': 'Santo André',
      'sao carlos': 'São Carlos',
      'são carlos': 'São Carlos',
      'sertaozinho': 'Sertãozinho',
      'sertãozinho': 'Sertãozinho',
      'penapolis': 'Penápolis',
      'penápolis': 'Penápolis',
      'vargem grande paulista': 'Vargem Grande Paulista',
      'itaquaquecetuba': 'Itaquaquecetuba',
      'maua': 'Mauá',
      'mauá': 'Mauá',
      'barueri sp': 'Barueri',
      'artur nogueira sp': 'Artur Nogueira',
      'ribeira preto': 'Ribeirão Preto',
      'ribeirao preto': 'Ribeirão Preto',
      'guaira': 'Guaíra',
      'guaíra': 'Guaíra',
      'aracaju': 'Aracaju',
      'gravata': 'Gravatá',
      'gravatá': 'Gravatá',
      'olinda pe': 'Olinda',
      'manaus': 'Manaus',
      'mocambique': 'Moçambique',
      'moçambique': 'Moçambique'
    };

    const lowerNormalized = normalized.toLowerCase().trim();
    
    // Aplica correções
    if (corrections[lowerNormalized]) {
      return corrections[lowerNormalized];
    }

    // Capitaliza primeira letra de cada palavra
    return normalized.replace(/\b\w/g, letter => letter.toUpperCase());
  }

  // Método para detectar o formato do arquivo pela assinatura
  private detectFileFormat(data: Uint8Array): string {
    try {
      // Verifica assinaturas conhecidas
      const signature = Array.from(data.slice(0, 8)).map(byte => byte.toString(16).padStart(2, '0')).join('').toLowerCase();
      console.log('Assinatura do arquivo (primeiros 8 bytes):', signature);

      // XLSX/DOCX (ZIP-based) - PK
      if (data[0] === 0x50 && data[1] === 0x4B) {
        return 'XLSX (ZIP-based)';
      }

      // XLS (OLE2) - D0CF11E0A1B11AE1
      if (data[0] === 0xD0 && data[1] === 0xCF && data[2] === 0x11 && data[3] === 0xE0) {
        return 'XLS (OLE2)';
      }

      // CSV ou texto
      if (this.isTextFile(data)) {
        return 'Texto/CSV';
      }

      // HTML
      const textStart = new TextDecoder().decode(data.slice(0, 100)).toLowerCase();
      if (textStart.includes('<html') || textStart.includes('<!doctype') || textStart.includes('<table')) {
        return 'HTML';
      }

      return 'Formato desconhecido';
    } catch (error) {
      console.warn('Erro ao detectar formato:', error);
      return 'Erro na detecção';
    }
  }

  // Verifica se é um arquivo de texto
  private isTextFile(data: Uint8Array): boolean {
    try {
      const sample = data.slice(0, 1000);
      let textChars = 0;

      for (const byte of sample) {
        // Caracteres ASCII imprimíveis + quebras de linha
        if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
          textChars++;
        }
      }

      return (textChars / sample.length) > 0.8;
    } catch {
      return false;
    }
  }

  // Método para diagnóstico do arquivo Excel
  private diagnoseExcelStructure(worksheet: any): void {
    try {
      // Pega o range da planilha
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
      console.log('Range da planilha:', worksheet['!ref']);
      console.log('Primeira célula:', range.s);
      console.log('Última célula:', range.e);

      // Mostra algumas células específicas para debug
      const sampleCells = ['A1', 'B1', 'C1', 'A2', 'B2', 'C2'];
      sampleCells.forEach(cell => {
        if (worksheet[cell]) {
          console.log(`Célula ${cell}:`, worksheet[cell]);
        }
      });
    } catch (diagError) {
      console.warn('Erro ao diagnosticar estrutura:', diagError);
    }
  }

  // Método para processar workbook Excel
  private processWorkbook(workbook: any): RegistrationData[] {
    // Verifica se há abas no workbook
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('O arquivo Excel não contém nenhuma planilha válida.');
    }

    // Pega a primeira aba do Excel
    const sheetName = workbook.SheetNames[0];
    console.log('Usando aba:', sheetName);

    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      throw new Error(`Não foi possível acessar a aba "${sheetName}".`);
    }

    // Diagnóstico da estrutura da planilha
    console.log('Executando diagnóstico da planilha...');
    this.diagnoseExcelStructure(worksheet);

    // Converte para JSON com headers automáticos
    let jsonData;
    try {
      jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        blankrows: false,
        raw: false
      }) as any[][];
    } catch (jsonError) {
      console.error('Erro ao converter planilha para JSON:', jsonError);
      throw new Error('Erro ao processar os dados da planilha. Verifique se o formato está correto.');
    }

    return this.processJSONData(jsonData);
  }

  // Método para processar tabela HTML
  private processHTMLTable(htmlContent: string): RegistrationData[] {
    console.log('Processando tabela HTML...');

    // Extrai dados da tabela HTML usando regex ou parsing básico
    const tableRegex = /<table[^>]*>(.*?)<\/table>/is;
    const tableMatch = htmlContent.match(tableRegex);

    if (!tableMatch) {
      throw new Error('Não foi possível encontrar uma tabela válida no arquivo HTML.');
    }

    const tableContent = tableMatch[1];
    const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
    const rows: string[] = [];
    let rowMatch;

    while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
      rows.push(rowMatch[1]);
    }

    if (rows.length === 0) {
      throw new Error('Nenhuma linha de dados encontrada na tabela HTML.');
    }

    // Converte linhas HTML para array de arrays
    const jsonData = rows.map(row => {
      const cellRegex = /<t[hd][^>]*>(.*?)<\/t[hd]>/gis;
      const cells: string[] = [];
      let cellMatch;

      while ((cellMatch = cellRegex.exec(row)) !== null) {
        // Remove tags HTML e decodifica entities
        const cellText = cellMatch[1]
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .trim();
        cells.push(cellText);
      }

      return cells;
    });

    console.log('Dados extraídos da tabela HTML:', jsonData.slice(0, 3));
    return this.processJSONData(jsonData);
  }

  // Método para processar dados JSON (comum para Excel e HTML)
  private processJSONData(jsonData: any[][]): RegistrationData[] {
    console.log('Total de linhas encontradas:', jsonData.length);
    console.log('Primeiras 3 linhas:', jsonData.slice(0, 3));

    if (jsonData.length === 0) {
      throw new Error('Os dados estão vazios. Verifique se há dados na planilha.');
    }

    if (jsonData.length < 2) {
      throw new Error('Os dados devem conter pelo menos uma linha de cabeçalho e uma linha de dados.');
    }

    // A primeira linha contém os cabeçalhos
    const headers = jsonData[0];
    console.log('Cabeçalhos encontrados:', headers);

    // Remove linhas vazias e processa os dados
    const rows = jsonData.slice(1).filter(row =>
      row && row.some(cell => cell !== null && cell !== undefined && cell !== '')
    );

    console.log(`Processando ${rows.length} linhas de dados`);

    this.registrationData = rows.map((row, index) => {
      try {
        // Mapeamento mais flexível - tenta encontrar dados em diferentes colunas
        const record = {
          timestamp: this.parseValue(row[0]) || '',
          name: this.parseValue(row[1]) || '',
          email: this.parseValue(row[2]) || '',
          phone: this.parseValue(row[3]) || '',
          city: this.parseValue(row[4]) || '',
          motivations: this.parseValue(row[5]) || '',
          experience: this.parseValue(row[6]) || '',
          interests: this.parseValue(row[7]) || '',
          availability: this.parseValue(row[8]) || '',
          expectations: this.parseValue(row[9]) || ''
        };

        // Log detalhado para debug
        if (index < 3) {
          console.log(`Linha ${index + 2} processada:`, record);
        }

        return record;
      } catch (rowError) {
        console.warn(`Erro ao processar linha ${index + 2}:`, rowError, 'Dados da linha:', row);
        return {
          timestamp: '',
          name: '',
          email: '',
          phone: '',
          city: '',
          motivations: '',
          experience: '',
          interests: '',
          availability: '',
          expectations: ''
        };
      }
    });

    // Remove registros completamente vazios
    this.registrationData = this.registrationData.filter(record =>
      record.name || record.email || record.city
    );

    console.log(`Dados processados com sucesso: ${this.registrationData.length} registros válidos`);
    return this.registrationData;
  }

  // Verifica se o conteúdo parece ser CSV
  private looksLikeCSV(content: string): boolean {
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    if (lines.length < 2) return false;

    // Verifica se as primeiras linhas têm padrão consistente de separadores
    const separators = [',', ';', '\t'];

    for (const sep of separators) {
      const firstLineCount = (lines[0].split(sep)).length;
      if (firstLineCount < 2) continue;

      // Verifica se pelo menos 3 linhas têm número similar de colunas
      let consistentLines = 0;
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        const colCount = lines[i].split(sep).length;
        if (Math.abs(colCount - firstLineCount) <= 1) {
          consistentLines++;
        }
      }

      if (consistentLines >= 3) {
        console.log(`CSV detectado com separador '${sep}', ${firstLineCount} colunas`);
        return true;
      }
    }

    return false;
  }

  // Processa conteúdo CSV
  private processCSVContent(csvContent: string): RegistrationData[] {
    console.log('Processando arquivo como CSV...');

    // Detecta o separador
    const separators = [',', ';', '\t'];
    let separator = ',';
    let maxColumns = 0;

    for (const sep of separators) {
      const firstLine = csvContent.split('\n')[0];
      const colCount = firstLine.split(sep).length;
      if (colCount > maxColumns) {
        maxColumns = colCount;
        separator = sep;
      }
    }

    console.log(`Usando separador: '${separator}'`);

    // Converte CSV para array de arrays
    const lines = csvContent.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const csvData = lines.map(line => {
      // Tratamento básico de CSV (sem aspas complexas)
      return line.split(separator).map(cell => cell.trim().replace(/^"|"$/g, ''));
    });

    console.log('Dados CSV processados:', csvData.slice(0, 3));
    return this.processJSONData(csvData);
  }

  // Processa dados como texto bruto (última tentativa)
  private processRawTextData(content: string): RegistrationData[] {
    console.log('Analisando texto bruto para encontrar padrões de dados...');

    // Remove tags HTML se houver
    let cleanContent = content.replace(/<[^>]+>/g, '');

    // Decodifica entities HTML comuns
    cleanContent = cleanContent
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));

    // Divide em linhas e filtra linhas vazias
    const lines = cleanContent.split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    console.log(`${lines.length} linhas encontradas no texto`);
    console.log('Primeiras 10 linhas:', lines.slice(0, 10));

    if (lines.length < 2) {
      throw new Error('Não foi possível encontrar dados estruturados no arquivo.');
    }

    // Tenta diferentes padrões de separação
    const separators = ['\t', ',', ';', '|', ' ', /\s{2,}/];

    for (const sep of separators) {
      try {
        const testData = lines.map(line => {
          if (sep instanceof RegExp) {
            return line.split(sep);
          } else {
            return line.split(sep);
          }
        }).filter(row => row.length > 1);

        if (testData.length >= 2) {
          const firstRowLength = testData[0].length;
          const consistentRows = testData.filter(row =>
            Math.abs(row.length - firstRowLength) <= 1
          );

          if (consistentRows.length >= Math.min(3, testData.length)) {
            console.log(`Padrão encontrado com separador '${sep}': ${firstRowLength} colunas, ${consistentRows.length} linhas consistentes`);
            return this.processJSONData(consistentRows);
          }
        }
      } catch (error) {
        console.warn(`Erro ao tentar separador '${sep}':`, error);
      }
    }

    throw new Error('Não foi possível identificar um padrão de dados válido no arquivo.');
  }
}
