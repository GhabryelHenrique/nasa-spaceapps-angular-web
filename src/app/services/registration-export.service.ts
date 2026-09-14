import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Inscrições exportadas da plataforma da NASA (`registrations.csv`).
 *
 * A partir de 2026 a inscrição do participante acontece no site da NASA, não em
 * um formulário nosso — então não há mais planilha com cidade, idade, gênero ou
 * escolaridade. O export traz só quatro colunas úteis:
 *
 *     Attended Event, Status, Type, Location, Created At
 *
 * Ou seja: dá para medir volume, presencial vs. virtual e a curva de inscrições
 * no tempo. O resto dos recortes de 2025 simplesmente não existe nesta fonte.
 */

export interface RegistrationExportRow {
  attended: boolean;
  status: string;
  /** "In-Person" ou "Virtual". */
  type: string;
  country: string;
  createdAt: Date | null;
}

export interface DailyRegistrations {
  /** ISO curto (yyyy-MM-dd), usado para ordenar. */
  date: string;
  /** dd/MM, para exibição. */
  label: string;
  count: number;
  cumulative: number;
}

export interface RegistrationExportStats {
  total: number;
  inPerson: number;
  virtual: number;
  attended: number;
  daily: DailyRegistrations[];
  firstRegistration: Date | null;
  lastRegistration: Date | null;
  averagePerDay: number;
  busiestDay: DailyRegistrations | null;
  byStatus: Array<{ status: string; count: number }>;
  byCountry: Array<{ country: string; count: number }>;
}

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
};

@Injectable({ providedIn: 'root' })
export class RegistrationExportService {
  private readonly http = inject(HttpClient);

  getStats(year: number): Observable<RegistrationExportStats> {
    return this.http
      .get(`/assets/data/${year}/registrations.csv`, { responseType: 'text' })
      .pipe(map(csv => this.buildStats(this.parseRows(csv))));
  }

  /**
   * Parser de CSV com aspas. Não dá para quebrar por `\n`: o campo "Created At"
   * vem como um bloco entre aspas com dia, mês, ano e hora em linhas separadas.
   */
  private parseCsv(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = '';
    let inQuotes = false;

    // Remove BOM — o export vem em UTF-8 com BOM e ele gruda no primeiro cabeçalho.
    const input = text.replace(/^﻿/, '');

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (inQuotes) {
        if (char === '"') {
          if (input[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += char;
        }
        continue;
      }

      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(field);
        field = '';
      } else if (char === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else if (char !== '\r') {
        field += char;
      }
    }

    if (field !== '' || row.length > 0) {
      row.push(field);
      rows.push(row);
    }

    return rows.filter(r => r.some(cell => cell.trim() !== ''));
  }

  private parseRows(csv: string): RegistrationExportRow[] {
    const rows = this.parseCsv(csv);
    if (rows.length < 2) return [];

    const header = rows[0].map(h => h.trim().toLowerCase());
    const col = (name: string) => header.indexOf(name);

    const iAttended = col('attended event');
    const iStatus = col('status');
    const iType = col('type');
    const iLocation = col('location');
    const iCreated = col('created at');

    return rows.slice(1).map(cells => ({
      attended: (cells[iAttended] ?? '').trim().toLowerCase() === 'yes',
      status: (cells[iStatus] ?? '').trim(),
      type: (cells[iType] ?? '').trim(),
      country: (cells[iLocation] ?? '').trim(),
      createdAt: this.parseDate(cells[iCreated] ?? '')
    }));
  }

  /** "\n\t\t14\n\t\tSeptember\n\t\t2026\n\t\t19:47\n" → Date. */
  private parseDate(raw: string): Date | null {
    const tokens = raw.trim().split(/\s+/);
    if (tokens.length < 3) return null;

    const [dayToken, monthToken, yearToken, timeToken] = tokens;
    const day = Number(dayToken);
    const month = MONTHS[monthToken?.toLowerCase()];
    const year = Number(yearToken);
    if (!Number.isFinite(day) || month === undefined || !Number.isFinite(year)) return null;

    const [hours = '0', minutes = '0'] = (timeToken ?? '').split(':');
    return new Date(year, month, day, Number(hours) || 0, Number(minutes) || 0);
  }

  private buildStats(rows: RegistrationExportRow[]): RegistrationExportStats {
    const dated = rows.filter(r => r.createdAt).sort(
      (a, b) => a.createdAt!.getTime() - b.createdAt!.getTime()
    );

    const perDay = new Map<string, number>();
    for (const row of dated) {
      const key = this.isoDate(row.createdAt!);
      perDay.set(key, (perDay.get(key) ?? 0) + 1);
    }

    let cumulative = 0;
    const daily: DailyRegistrations[] = [...perDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => {
        cumulative += count;
        const [, month, day] = date.split('-');
        return { date, label: `${day}/${month}`, count, cumulative };
      });

    const busiestDay = daily.length
      ? daily.reduce((max, d) => (d.count > max.count ? d : max))
      : null;

    return {
      total: rows.length,
      inPerson: rows.filter(r => r.type.toLowerCase() === 'in-person').length,
      virtual: rows.filter(r => r.type.toLowerCase() === 'virtual').length,
      attended: rows.filter(r => r.attended).length,
      daily,
      firstRegistration: dated[0]?.createdAt ?? null,
      lastRegistration: dated[dated.length - 1]?.createdAt ?? null,
      averagePerDay: daily.length ? Math.round((rows.length / daily.length) * 10) / 10 : 0,
      busiestDay,
      byStatus: this.countBy(rows, r => r.status).map(([status, count]) => ({ status, count })),
      byCountry: this.countBy(rows, r => r.country).map(([country, count]) => ({ country, count }))
    };
  }

  private isoDate(date: Date): string {
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  private countBy<T>(items: T[], key: (item: T) => string): Array<[string, number]> {
    const counts = new Map<string, number>();
    for (const item of items) {
      const value = key(item) || '—';
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }
}
