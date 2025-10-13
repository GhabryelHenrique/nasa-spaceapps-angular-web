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
  email: string;
  overallSatisfaction: string;
  organizationRating: string;
  venueRating: string;
  foodRating: string;
  communicationRating: string;
  supportRating: string;
  positiveAspects: string;
  improvementSuggestions: string;
  highlights: string;
  technicalIssues: string;
  futureParticipation: string;
  recommendation: string;
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

    const processedData = validLines.map((line) => {
      const columns = this.parseCSVLine(line);
      return {
        timestamp: columns[0] || '',
        email: columns[1] || '',
        overallSatisfaction: columns[2] || '',
        organizationRating: columns[3] || '',
        venueRating: columns[4] || '',
        foodRating: columns[5] || '',
        communicationRating: columns[6] || '',
        supportRating: columns[7] || '',
        positiveAspects: columns[8] || '',
        improvementSuggestions: columns[9] || '',
        highlights: columns[10] || '',
        technicalIssues: columns[11] || '',
        futureParticipation: columns[12] || '',
        recommendation: columns[13] || '',
        additionalComments: columns[14] || ''
      };
    });

    return processedData;
  }
}
