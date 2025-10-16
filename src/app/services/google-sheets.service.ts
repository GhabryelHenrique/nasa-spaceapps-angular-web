import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface RegistrationRow {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  city: string;
  education: string;
  birthDate: string;
  participationMode: string;
  emailAddress: string;
  interestAreas: string;
  howHeard: string;
  ddd: string;
  gender: string;
}

export interface FeedbackRow {
  timestamp: string;
  name: string;
  email: string;
  role: string;
  participationMode: string;
  previousParticipation: string;
  areaOfExpertise: string;

  // Avaliações numéricas
  communicationRating: string;
  scheduleClarity: string;
  venueNASADigital: string;
  venueIFTM: string;
  venueSankhya: string;
  venueUFU: string;
  venueUNA: string;
  venueUniube: string;

  // Palestras
  talkUberlandia: string;
  talkGabrielle: string;
  talkCasosSucesso: string;
  talkIA: string;
  talkDicasHackathon: string;
  talkPitch: string;
  talkAstronauta: string;
  talkCienciaEspaco: string;

  // Suporte e estrutura
  mentorsSupport: string;
  volunteersQuality: string;
  discordStructure: string;
  challengesDiversity: string;
  teamFormation: string;
  challengeDifficulty: string;
  projectSatisfaction: string;
  recommendation: string;
  overallSatisfaction: string;

  // Feedback qualitativo
  positiveAspects: string;
  improvementSuggestions: string;
  highlights: string;
  additionalComments: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  // IDs das planilhas do Google Sheets
  private readonly REGISTRATION_SPREADSHEET_ID = '1U9DX-_bsEHT0goXNtSmFctEOO3UflkD3zkyDPeyrdjQ';
  private readonly FEEDBACK_SPREADSHEET_ID = '1KQ79MBgj0mSVg0QpPms6yHw6gAillmaqMn_WJ3p0zHU';
  private readonly REGISTRATION_GID = '276652387'; // GID da aba de inscrições

  constructor(private http: HttpClient) {}

  /**
   * Carrega dados de inscrição do arquivo JSON local
   * Os dados já estão anonimizados (nome com iniciais, CPF parcialmente oculto)
   */
  getRegistrationDataFromLocal(): Observable<RegistrationRow[]> {
    return this.http.get<RegistrationRow[]>('assets/data/registrations.json').pipe(
      catchError(error => {
        console.error('Erro ao carregar dados locais:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Carrega dados de inscrição diretamente do Google Sheets
   */
  getRegistrationDataFromGoogleSheets(): Observable<RegistrationRow[]> {
    return this.getRegistrationData(this.REGISTRATION_SPREADSHEET_ID, this.REGISTRATION_GID);
  }

  /**
   * Carrega dados de feedback diretamente do Google Sheets
   */
  getFeedbackDataFromGoogleSheets(): Observable<FeedbackRow[]> {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${this.FEEDBACK_SPREADSHEET_ID}/export?format=csv`;

    return this.http.get(csvUrl, { responseType: 'text' }).pipe(
      map(csvData => this.parseFeedbackCSV(csvData)),
      catchError(error => {
        console.error('Erro ao buscar dados de feedback do Google Sheets:', error);
        console.error('Certifique-se que a planilha está configurada como pública para leitura.');
        return throwError(() => error);
      })
    );
  }

  getRegistrationData(spreadsheetId: string, gid?: string): Observable<RegistrationRow[]> {
    // Acessa a planilha como CSV público, com GID específico se fornecido
    let csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
    if (gid) {
      csvUrl += `&gid=${gid}`;
    }

    return this.http.get(csvUrl, { responseType: 'text' }).pipe(
      map(csvData => this.parseCSV(csvData)),
      catchError(error => {
        console.error('Erro ao buscar dados do Google Sheets:', error);
        console.error('Certifique-se que a planilha está configurada como pública para leitura.');
        return throwError(() => error);
      })
    );
  }

  private parseCSV(csvData: string): RegistrationRow[] {
    const lines = csvData.split('\n');

    if (lines.length <= 1) {
      console.warn('CSV contains no data (header only or empty)');
      return [];
    }

    // Remove a primeira linha (cabeçalhos)
    const dataLines = lines.slice(1);
    const validLines = dataLines.filter(line => line.trim() !== '');
    const processedData = validLines.map((line) => {
      const columns = this.parseCSVLine(line);
      return {
        timestamp: columns[0] || '',           // Carimbo de data/hora
        name: '',                             // Nome e Sobrenome (dados sensíveis - não armazenado)
        email: '',                            // Seu melhor email (dados sensíveis - não armazenado)
        phone: columns[3] || '',              // Telefone de Contato
        cpf: '',                              // CPF (dados sensíveis - não armazenado)
        city: columns[5] || '',               // Cidade onde reside
        education: columns[6] || '',          // Escolaridade
        birthDate: columns[7] || '',          // Data de Nascimento
        participationMode: columns[8] || '',  // Gostaria de fazer o hackathon Presencialmente ou Remotamente?
        emailAddress: '',                     // Endereço de e-mail (dados sensíveis - não armazenado)
        interestAreas: columns[10] || '',     // Áreas de interesse
        howHeard: columns[11] || '',          // Como você ficou sabendo do Hackathon?
        ddd: this.extractDDD(columns[3] || ''), // Extrai DDD do telefone
        gender: columns[12] || ''             // Gênero
      };
    });
    return processedData;
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  private extractDDD(phone: string): string {
    if (!phone) return '';

    // Remove todos os caracteres não numéricos
    const numbersOnly = phone.replace(/\D/g, '');

    // Se tem 11 dígitos (9 + DDD), pega os primeiros 2
    if (numbersOnly.length >= 10) {
      return numbersOnly.substring(0, 2);
    }

    // Se tem menos dígitos, tenta identificar padrões comuns
    if (numbersOnly.length >= 8) {
      // Pode ser que esteja sem DDD, retorna vazio
      return '';
    }

    return '';
  }

  private parseFeedbackCSV(csvData: string): FeedbackRow[] {
    const lines = csvData.split('\n');

    if (lines.length <= 1) {
      console.warn('CSV de feedback vazio ou apenas com cabeçalho');
      return [];
    }

    // Remove a primeira linha (cabeçalhos)
    const dataLines = lines.slice(1);
    const validLines = dataLines.filter(line => line.trim() !== '');

    console.log('=== PARSING FEEDBACK CSV ===');
    console.log('Total de linhas válidas:', validLines.length);

    const processedData = validLines.map((line, index) => {
      const columns = this.parseCSVLine(line);

      // Log da primeira linha para debug
      if (index === 0) {
        console.log('Primeira linha - Total de colunas:', columns.length);
        columns.forEach((col, i) => {
          if (col) console.log(`Coluna ${i}: ${col.substring(0, 50)}...`);
        });
      }

      return {
        timestamp: columns[0] || '',
        name: columns[1] || '',
        email: columns[2] || '',
        role: columns[3] || '',
        participationMode: columns[4] || '',
        previousParticipation: columns[5] || '',
        areaOfExpertise: columns[6] || '',

        // Avaliações numéricas
        communicationRating: columns[7] || '',
        scheduleClarity: columns[8] || '',
        venueNASADigital: columns[9] || '',
        venueIFTM: columns[10] || '',
        venueSankhya: columns[11] || '',
        venueUFU: columns[12] || '',
        venueUNA: columns[13] || '',
        venueUniube: columns[14] || '',

        // Palestras (colunas 15-22)
        talkUberlandia: columns[15] || '',
        talkGabrielle: columns[16] || '',
        talkCasosSucesso: columns[17] || '',
        talkIA: columns[18] || '',
        talkDicasHackathon: columns[19] || '',
        talkPitch: columns[20] || '',
        talkAstronauta: columns[21] || '',
        talkCienciaEspaco: columns[22] || '',

        // Suporte e estrutura (colunas 23-31)
        mentorsSupport: columns[23] || '',
        volunteersQuality: columns[24] || '',
        discordStructure: columns[25] || '',
        challengesDiversity: columns[26] || '',
        teamFormation: columns[27] || '',
        challengeDifficulty: columns[28] || '',
        projectSatisfaction: columns[29] || '',
        recommendation: columns[30] || '',
        overallSatisfaction: columns[31] || '',

        // Feedback qualitativo (colunas 32-35)
        positiveAspects: columns[32] || '',
        improvementSuggestions: columns[33] || '',
        highlights: columns[34] || '',
        additionalComments: columns[35] || ''
      };
    });

    console.log('Dados processados:', processedData.length, 'feedbacks');
    console.log('Primeiro feedback processado:', processedData[0]);
    console.log('=== END PARSING FEEDBACK ===');

    return processedData;
  }
}
