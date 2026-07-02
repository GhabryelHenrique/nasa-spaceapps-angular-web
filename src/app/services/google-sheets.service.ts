import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Linha da planilha de inscritos, já anonimizada: nome, e-mail, CPF e telefone
 * completo nunca saem deste serviço — do telefone é mantido apenas o DDD.
 */
export interface InscritoRow {
  timestamp: Date | null;
  city: string;
  education: string;
  birthDate: string;
  participationMode: string;
  interestAreas: string;
  howHeard: string;
  gender: string;
  ddd: string;
}

export interface MentorRow {
  timestamp: Date | null;
  organization: string;
  availability: string;
  timeSlot: string;
  areas: string;
  education: string;
  skills: string;
  referredBy: string;
}

export interface FeedbackRow {
  timestamp: Date | null;
  education: string;
  role: string;
  participationMode: string;
  previousParticipation: string;
  areaOfExpertise: string;

  // Notas 1–5
  communicationRating: number | null;
  scheduleClarity: number | null;
  mentorsSupport: number | null;
  volunteersQuality: number | null;
  discordStructure: number | null;
  challengesDiversity: number | null;
  challengeDifficulty: number | null;
  projectSatisfaction: number | null;
  overallSatisfaction: number | null;

  // Escala 0–10 (pergunta de recomendação, base do NPS)
  recommendationScore: number | null;

  // Avaliações categóricas (Excelente/Bom/OK/Ruim/Muito Ruim); '' = não avaliou
  venues: Record<string, string>;
  talks: Record<string, string>;

  teamFormationEasy: string;

  // Qualitativo
  liked: string;
  toImprove: string;
  mustHave: string;
  finalComments: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  // GID da aba de respostas do formulário de inscrição
  private readonly INSCRITOS_GID = '276652387';

  constructor(private http: HttpClient) {}

  getInscritos(): Observable<InscritoRow[]> {
    return this.fetchCsv(environment.dataSheets.inscritos, this.INSCRITOS_GID).pipe(
      map(rows => this.mapInscritos(rows))
    );
  }

  getMentores(): Observable<MentorRow[]> {
    return this.fetchCsv(environment.dataSheets.mentores).pipe(
      map(rows => this.mapMentores(rows))
    );
  }

  getFeedback(): Observable<FeedbackRow[]> {
    return this.fetchCsv(environment.dataSheets.feedback).pipe(
      map(rows => this.mapFeedback(rows))
    );
  }

  private fetchCsv(spreadsheetId: string, gid?: string): Observable<string[][]> {
    let csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
    if (gid) {
      csvUrl += `&gid=${gid}`;
    }

    return this.http.get(csvUrl, { responseType: 'text' }).pipe(
      map(csv => this.parseCsv(csv)),
      catchError(error => {
        console.error(`Erro ao buscar planilha ${spreadsheetId}:`, error);
        console.error('Certifique-se que a planilha está configurada como pública para leitura.');
        return throwError(() => error);
      })
    );
  }

  /**
   * Parser CSV completo: respeita aspas, vírgulas e quebras de linha dentro de
   * campos (os formulários do Google geram os três casos).
   */
  private parseCsv(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (inQuotes) {
        if (char === '"') {
          if (text[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cur += char;
        }
      } else if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(cur);
        cur = '';
      } else if (char === '\n') {
        row.push(cur);
        rows.push(row);
        row = [];
        cur = '';
      } else if (char !== '\r') {
        cur += char;
      }
    }
    if (cur !== '' || row.length > 0) {
      row.push(cur);
      rows.push(row);
    }

    return rows.filter(r => r.some(cell => cell.trim() !== ''));
  }

  private normalizeHeader(header: string): string {
    return header
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Índice da primeira coluna cujo cabeçalho contém todas as palavras-chave. */
  private findCol(headers: string[], keywords: string[]): number {
    const normalized = headers.map(h => this.normalizeHeader(h));
    return normalized.findIndex(h => keywords.every(k => h.includes(this.normalizeHeader(k))));
  }

  private cell(row: string[], index: number): string {
    if (index < 0 || index >= row.length) return '';
    return row[index].replace(/\s+/g, ' ').trim();
  }

  private parseNumber(value: string): number | null {
    const n = parseFloat(value.replace(',', '.'));
    return isNaN(n) ? null : n;
  }

  /**
   * Datas dos formulários: inscritos/feedback usam DD/MM/YYYY, a planilha de
   * mentores usa M/D/YYYY (formato americano) — por isso o hint de formato.
   */
  private parseDate(value: string, format: 'dmy' | 'mdy'): Date | null {
    const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
    if (!match) {
      const direct = new Date(value);
      return isNaN(direct.getTime()) ? null : direct;
    }
    const [, a, b, year, hour, minute, second] = match;
    const day = format === 'dmy' ? +a : +b;
    const month = format === 'dmy' ? +b : +a;
    const date = new Date(+year, month - 1, day, +(hour || 0), +(minute || 0), +(second || 0));
    return isNaN(date.getTime()) ? null : date;
  }

  private extractDDD(phone: string): string {
    let digits = phone.replace(/\D/g, '');
    if (digits.length >= 12 && digits.startsWith('55')) {
      digits = digits.substring(2);
    }
    return digits.length >= 10 ? digits.substring(0, 2) : '';
  }

  private mapInscritos(rows: string[][]): InscritoRow[] {
    if (rows.length <= 1) return [];
    const headers = rows[0];
    const col = {
      timestamp: this.findCol(headers, ['carimbo']),
      phone: this.findCol(headers, ['telefone']),
      city: this.findCol(headers, ['cidade']),
      education: this.findCol(headers, ['escolaridade']),
      birthDate: this.findCol(headers, ['nascimento']),
      mode: this.findCol(headers, ['presencialmente ou remotamente']),
      interests: this.findCol(headers, ['areas de interesse']),
      howHeard: this.findCol(headers, ['ficou sabendo']),
      gender: this.findCol(headers, ['genero']),
    };

    return rows.slice(1).map(row => ({
      timestamp: this.parseDate(this.cell(row, col.timestamp), 'dmy'),
      city: this.cell(row, col.city),
      education: this.cell(row, col.education),
      birthDate: this.cell(row, col.birthDate),
      participationMode: this.cell(row, col.mode),
      interestAreas: this.cell(row, col.interests),
      howHeard: this.cell(row, col.howHeard),
      gender: this.cell(row, col.gender),
      ddd: this.extractDDD(this.cell(row, col.phone)),
    }));
  }

  private mapMentores(rows: string[][]): MentorRow[] {
    if (rows.length <= 1) return [];
    const headers = rows[0];
    const col = {
      timestamp: this.findCol(headers, ['timestamp']),
      organization: this.findCol(headers, ['organizacao']),
      availability: this.findCol(headers, ['disponibilidade']),
      timeSlot: this.findCol(headers, ['horario']),
      areas: this.findCol(headers, ['interesse de atuar']),
      education: this.findCol(headers, ['escolaridade']),
      skills: this.findCol(headers, ['competencias']),
      referredBy: this.findCol(headers, ['indicado']),
    };

    return rows.slice(1).map(row => ({
      timestamp: this.parseDate(this.cell(row, col.timestamp), 'mdy'),
      organization: this.cell(row, col.organization),
      availability: this.cell(row, col.availability),
      timeSlot: this.cell(row, col.timeSlot),
      areas: this.cell(row, col.areas),
      education: this.cell(row, col.education),
      skills: this.cell(row, col.skills),
      referredBy: this.cell(row, col.referredBy),
    }));
  }

  private mapFeedback(rows: string[][]): FeedbackRow[] {
    if (rows.length <= 1) return [];
    const headers = rows[0];

    // Locais e palestras são colunas repetidas do tipo "Pergunta [Item]" —
    // o nome do item vem do sufixo entre colchetes.
    const venueCols: { name: string; index: number }[] = [];
    const talkCols: { name: string; index: number }[] = [];
    headers.forEach((header, index) => {
      const bracket = header.match(/\[(.+?)\]\s*$/);
      if (!bracket) return;
      const normalized = this.normalizeHeader(header);
      if (normalized.includes('adequacao dos locais')) {
        venueCols.push({ name: bracket[1].trim(), index });
      } else if (normalized.includes('palestras')) {
        talkCols.push({ name: bracket[1].trim(), index });
      }
    });

    const col = {
      timestamp: this.findCol(headers, ['carimbo']),
      education: this.findCol(headers, ['escolaridade']),
      role: this.findCol(headers, ['funcao']),
      mode: this.findCol(headers, ['presencialmente ou remotamente']),
      previous: this.findCol(headers, ['participado', 'antes']),
      expertise: this.findCol(headers, ['area de formacao']),
      communication: this.findCol(headers, ['comunicacao', 'pre-evento']),
      schedule: this.findCol(headers, ['clareza do cronograma']),
      mentors: this.findCol(headers, ['mentores']),
      volunteers: this.findCol(headers, ['voluntarios']),
      discord: this.findCol(headers, ['discord']),
      diversity: this.findCol(headers, ['diversidade de desafios']),
      teamFormation: this.findCol(headers, ['formar', 'equipe']),
      difficulty: this.findCol(headers, ['dificuldade do desafio']),
      projectSatisfaction: this.findCol(headers, ['satisfacao geral com o projeto']),
      recommendation: this.findCol(headers, ['probabilidade', 'recomendar']),
      overall: this.findCol(headers, ['satisfacao geral com a experiencia']),
      liked: this.findCol(headers, ['mais gostou']),
      toImprove: this.findCol(headers, ['menos gostou']),
      mustHave: this.findCol(headers, ['nao pode faltar']),
      finalComments: this.findCol(headers, ['comentario', 'final']),
    };

    return rows.slice(1).map(row => {
      const venues: Record<string, string> = {};
      venueCols.forEach(v => {
        const value = this.cell(row, v.index);
        venues[v.name] = /nao participei/i.test(this.normalizeHeader(value)) ? '' : value;
      });
      const talks: Record<string, string> = {};
      talkCols.forEach(t => {
        talks[t.name] = this.cell(row, t.index);
      });

      return {
        timestamp: this.parseDate(this.cell(row, col.timestamp), 'dmy'),
        education: this.cell(row, col.education),
        role: this.cell(row, col.role),
        participationMode: this.cell(row, col.mode),
        previousParticipation: this.cell(row, col.previous),
        areaOfExpertise: this.cell(row, col.expertise),
        communicationRating: this.parseNumber(this.cell(row, col.communication)),
        scheduleClarity: this.parseNumber(this.cell(row, col.schedule)),
        mentorsSupport: this.parseNumber(this.cell(row, col.mentors)),
        volunteersQuality: this.parseNumber(this.cell(row, col.volunteers)),
        discordStructure: this.parseNumber(this.cell(row, col.discord)),
        challengesDiversity: this.parseNumber(this.cell(row, col.diversity)),
        challengeDifficulty: this.parseNumber(this.cell(row, col.difficulty)),
        projectSatisfaction: this.parseNumber(this.cell(row, col.projectSatisfaction)),
        overallSatisfaction: this.parseNumber(this.cell(row, col.overall)),
        recommendationScore: this.parseNumber(this.cell(row, col.recommendation)),
        venues,
        talks,
        teamFormationEasy: this.cell(row, col.teamFormation),
        liked: this.cell(row, col.liked),
        toImprove: this.cell(row, col.toImprove),
        mustHave: this.cell(row, col.mustHave),
        finalComments: this.cell(row, col.finalComments),
      };
    });
  }
}
