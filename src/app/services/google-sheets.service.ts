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

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {

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

  getRegistrationData(spreadsheetId: string, range: string = 'A:L'): Observable<RegistrationRow[]> {
    // Acessa a planilha como CSV público
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;

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
}
