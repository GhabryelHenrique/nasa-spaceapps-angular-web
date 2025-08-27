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
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationDataService {
  private registrationData: RegistrationData[] = [];

  constructor() {}

  async loadExcelData(file: File): Promise<RegistrationData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          console.log('Resultado do FileReader:', e.target.result);
          console.log('Tipo do resultado:', typeof e.target.result);
          console.log('Tamanho do arquivo:', e.target.result?.byteLength || 'N/A');
          
          // Verifica se o resultado existe e tem conteúdo
          if (!e.target.result || e.target.result.byteLength === 0) {
            throw new Error('Arquivo vazio ou não pôde ser lido');
          }
          
          const data = new Uint8Array(e.target.result);
          console.log('Dados convertidos para Uint8Array:', data.length, 'bytes');
          
          // Verifica a assinatura do arquivo para detectar o formato
          const fileSignature = this.detectFileFormat(data);
          console.log('Formato detectado:', fileSignature);
          
          // Se for HTML/XML disfarçado de Excel, tenta processar diferentemente
          if (fileSignature === 'HTML' || fileSignature === 'Texto/CSV') {
            console.log('Detectado arquivo HTML/XML/CSV. Analisando conteúdo...');
            const textContent = new TextDecoder('utf-8').decode(data);
            console.log('Conteúdo do arquivo (primeiros 1000 chars):', textContent.substring(0, 1000));
            console.log('Contém <table>:', textContent.includes('<table'));
            console.log('Contém worksheet:', textContent.includes('worksheet'));
            console.log('Contém <ss:', textContent.includes('<ss:'));
            console.log('Contém DOCTYPE:', textContent.toLowerCase().includes('<!doctype'));
            console.log('Contém HTML:', textContent.toLowerCase().includes('<html'));
            
            // Verifica se é um CSV simples
            const lines = textContent.split('\n');
            const firstLines = lines.slice(0, 5);
            console.log('Primeiras 5 linhas como texto:', firstLines);
            
            // Se parece ser CSV (linhas separadas por vírgula/ponto-e-vírgula)
            if (this.looksLikeCSV(textContent)) {
              console.log('Arquivo parece ser CSV. Processando como CSV...');
              try {
                resolve(this.processCSVContent(textContent));
                return;
              } catch (csvError) {
                console.error('Erro ao processar como CSV:', csvError);
              }
            }
            
            // Se contém estrutura de tabela Excel em XML
            if (textContent.includes('<table') || textContent.includes('worksheet') || textContent.includes('<ss:')) {
              try {
                // Força leitura como string/texto XML
                const workbook = XLSX.read(textContent, { 
                  type: 'string',
                  cellText: false,
                  cellDates: true,
                  raw: false
                });
                console.log('Sucesso na leitura de Excel XML como string');
                resolve(this.processWorkbook(workbook));
                return;
              } catch (xmlError) {
                console.error('Erro ao processar como Excel XML:', xmlError);
              }
            }
            
            // Se for um arquivo HTML exportado do Google Sheets ou Excel Online
            if (textContent.includes('<table')) {
              try {
                resolve(this.processHTMLTable(textContent));
                return;
              } catch (htmlError) {
                console.error('Erro ao processar tabela HTML:', htmlError);
              }
            }

            // Última tentativa: forçar processamento como texto/dados brutos
            console.log('Tentando extrair dados como texto bruto...');
            try {
              resolve(this.processRawTextData(textContent));
              return;
            } catch (textError) {
              console.error('Erro ao processar como texto bruto:', textError);
              throw new Error(`Arquivo não pôde ser processado. Conteúdo detectado: ${fileSignature}. ` +
                             `Por favor, salve como Excel (.xlsx) ou CSV (.csv) válido.`);
            }
          }
          
          // Tenta ler o workbook com diferentes estratégias baseadas no formato
          let workbook;
          const readOptions = {
            cellText: false,
            cellDates: true,
            raw: false,
            codepage: 65001 // UTF-8
          };

          try {
            // Primeira tentativa com tipo detectado
            workbook = XLSX.read(data, { 
              type: 'array',
              ...readOptions
            });
            console.log('Sucesso na leitura com type: array');
          } catch (xlsxError) {
            console.error('Erro ao ler com XLSX.read (array):', xlsxError);
            
            try {
              // Segunda tentativa: força como binary
              const binaryString = Array.from(data).map(byte => String.fromCharCode(byte)).join('');
              workbook = XLSX.read(binaryString, { 
                type: 'binary',
                ...readOptions
              });
              console.log('Sucesso na leitura com type: binary');
            } catch (binaryError) {
              console.error('Erro ao ler com XLSX.read (binary):', binaryError);
              
              try {
                // Terceira tentativa: como buffer direto
                workbook = XLSX.read(e.target.result, { 
                  type: 'buffer',
                  ...readOptions
                });
                console.log('Sucesso na leitura com type: buffer');
              } catch (bufferError) {
                console.error('Erro ao ler com XLSX.read (buffer):', bufferError);
                
                try {
                  // Quarta tentativa: forçar como base64
                  const base64String = btoa(String.fromCharCode(...data));
                  workbook = XLSX.read(base64String, { 
                    type: 'base64',
                    ...readOptions
                  });
                  console.log('Sucesso na leitura com type: base64');
                } catch (base64Error) {
                  console.error('Erro ao ler com XLSX.read (base64):', base64Error);
                  const errorMessage = base64Error instanceof Error ? base64Error.message : String(base64Error);
                  throw new Error(`Não foi possível ler o arquivo. Formatos testados falharam. Último erro: ${errorMessage}`);
                }
              }
            }
          }
          
          console.log('Workbook lido com sucesso:', workbook);
          console.log('Abas encontradas:', workbook.SheetNames);

          resolve(this.processWorkbook(workbook));
        } catch (error) {
          console.error('Erro ao processar arquivo Excel:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          reject(new Error(`Erro ao processar arquivo Excel: ${errorMessage}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Erro ao ler o arquivo. Verifique se o arquivo não está corrompido.'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

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

    // Estatísticas de motivação
    const motivationMap = new Map<string, number>();
    this.registrationData.forEach(reg => {
      if (reg.motivations) {
        const motivations = reg.motivations.split(',').map(m => m.trim());
        motivations.forEach(motivation => {
          if (motivation) {
            motivationMap.set(motivation, (motivationMap.get(motivation) || 0) + 1);
          }
        });
      }
    });

    const motivationStats = Array.from(motivationMap.entries())
      .map(([motivation, count]) => ({ motivation, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

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
    const cityMap = new Map<string, number>();
    this.registrationData.forEach(reg => {
      if (reg.city) {
        cityMap.set(reg.city, (cityMap.get(reg.city) || 0) + 1);
      }
    });

    const cityStats = Array.from(cityMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalRegistrations,
      uberlandiaRegistrations,
      dailyRegistrations,
      motivationStats,
      experienceStats,
      cityStats,
      averagePerDay: Math.round(averagePerDay * 100) / 100
    };
  }

  getRegistrationData(): RegistrationData[] {
    return this.registrationData;
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

  // Método para carregar dados de demonstração
  loadDemoData(): void {
    const demoData: RegistrationData[] = [
      {
        timestamp: '2024-08-01 10:00:00',
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(34) 99999-9999',
        city: 'Uberlândia',
        motivations: 'Aprender tecnologia espacial, Networking, Inovação',
        experience: 'Iniciante',
        interests: 'Programação, Astronomia',
        availability: 'Fim de semana completo',
        expectations: 'Aprender e contribuir'
      },
      {
        timestamp: '2024-08-02 14:30:00',
        name: 'Maria Santos',
        email: 'maria@email.com',
        phone: '(34) 88888-8888',
        city: 'Uberlândia',
        motivations: 'Inovação, Desafio técnico, Colaboração',
        experience: 'Intermediário',
        interests: 'Engenharia, Design',
        availability: 'Fim de semana completo',
        expectations: 'Desenvolver soluções criativas'
      },
      {
        timestamp: '2024-08-03 09:15:00',
        name: 'Pedro Costa',
        email: 'pedro@email.com',
        phone: '(11) 77777-7777',
        city: 'São Paulo',
        motivations: 'Tecnologia espacial, Networking',
        experience: 'Avançado',
        interests: 'Data Science, Machine Learning',
        availability: 'Apenas sábado',
        expectations: 'Compartilhar conhecimento'
      },
      {
        timestamp: '2024-08-04 16:45:00',
        name: 'Ana Oliveira',
        email: 'ana@email.com',
        phone: '(31) 66666-6666',
        city: 'Belo Horizonte',
        motivations: 'Aprender tecnologia espacial, Inovação',
        experience: 'Iniciante',
        interests: 'Astronomia, Física',
        availability: 'Domingo',
        expectations: 'Primeira experiência em hackathon'
      },
      {
        timestamp: '2024-08-05 11:20:00',
        name: 'Carlos Ferreira',
        email: 'carlos@email.com',
        phone: '(34) 55555-5555',
        city: 'Uberlândia',
        motivations: 'Desafio técnico, Colaboração, Networking',
        experience: 'Intermediário',
        interests: 'Robótica, IoT',
        availability: 'Fim de semana completo',
        expectations: 'Desenvolver protótipo funcional'
      },
      {
        timestamp: '2024-08-06 13:00:00',
        name: 'Lucia Almeida',
        email: 'lucia@email.com',
        phone: '(21) 44444-4444',
        city: 'Rio de Janeiro',
        motivations: 'Inovação, Aprender tecnologia espacial',
        experience: 'Avançado',
        interests: 'Inteligência Artificial, Sensores',
        availability: 'Fim de semana completo',
        expectations: 'Aplicar IA em problemas espaciais'
      },
      {
        timestamp: '2024-08-07 08:30:00',
        name: 'Rafael Souza',
        email: 'rafael@email.com',
        phone: '(34) 33333-3333',
        city: 'Uberlândia',
        motivations: 'Colaboração, Desafio técnico',
        experience: 'Iniciante',
        interests: 'Programação, Eletrônica',
        availability: 'Sábado',
        expectations: 'Aprender na prática'
      },
      {
        timestamp: '2024-08-08 15:10:00',
        name: 'Fernanda Lima',
        email: 'fernanda@email.com',
        phone: '(85) 22222-2222',
        city: 'Fortaleza',
        motivations: 'Networking, Inovação, Aprender tecnologia espacial',
        experience: 'Intermediário',
        interests: 'UX/UI, Design Thinking',
        availability: 'Domingo',
        expectations: 'Contribuir com design de interface'
      },
      {
        timestamp: '2024-08-09 17:25:00',
        name: 'Marcos Rocha',
        email: 'marcos@email.com',
        phone: '(34) 11111-1111',
        city: 'Uberlândia',
        motivations: 'Desafio técnico, Tecnologia espacial',
        experience: 'Avançado',
        interests: 'Sistemas Embarcados, Hardware',
        availability: 'Fim de semana completo',
        expectations: 'Desenvolver hardware inovador'
      },
      {
        timestamp: '2024-08-10 12:40:00',
        name: 'Juliana Moreira',
        email: 'juliana@email.com',
        phone: '(47) 99999-0000',
        city: 'Florianópolis',
        motivations: 'Colaboração, Inovação',
        experience: 'Intermediário',
        interests: 'Sustentabilidade, Meio Ambiente',
        availability: 'Fim de semana completo',
        expectations: 'Soluções sustentáveis para o espaço'
      }
    ];

    this.registrationData = demoData;
    console.log('Dados de demonstração carregados:', this.registrationData.length, 'registros');
  }
}
