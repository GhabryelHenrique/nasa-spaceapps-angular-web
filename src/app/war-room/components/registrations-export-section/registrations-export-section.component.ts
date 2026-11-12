import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { RegistrationExportStats } from '../../../services/registration-export.service';
import { InsightChartComponent, CHART_SERIES } from '../insight-chart/insight-chart.component';
import { StatTileComponent } from '../stat-tile/stat-tile.component';

/**
 * Inscrições da edição 2026, lidas do export da plataforma da NASA.
 *
 * Bem mais enxuta que a seção de 2025: sem formulário próprio, o export só traz
 * volume, modalidade e data — não há cidade, idade, gênero nem escolaridade.
 */
@Component({
  selector: 'app-registrations-export-section',
  standalone: true,
  imports: [CommonModule, InsightChartComponent, StatTileComponent],
  templateUrl: './registrations-export-section.component.html',
  styleUrl: './registrations-export-section.component.scss',
})
export class RegistrationsExportSectionComponent implements OnChanges {
  @Input({ required: true }) stats!: RegistrationExportStats;
  /** Inscritos na sede segundo a API da NASA — cruzado com o export para detectar defasagem. */
  @Input() platformTotal: number | null = null;

  dailyConfig: ChartConfiguration | null = null;
  cumulativeConfig: ChartConfiguration | null = null;
  modeConfig: ChartConfiguration | null = null;

  inPersonPct = 0;
  virtualPct = 0;

  ngOnChanges(): void {
    if (!this.stats) return;

    const total = this.stats.total || 1;
    this.inPersonPct = Math.round((this.stats.inPerson / total) * 100);
    this.virtualPct = Math.round((this.stats.virtual / total) * 100);

    this.buildDaily();
    this.buildCumulative();
    this.buildMode();
  }

  fmt(n: number): string {
    return n.toLocaleString('pt-BR');
  }

  fmtDate(date: Date | null): string {
    if (!date) return '—';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  /** Quanto o export está atrás (ou à frente) do número da plataforma. */
  get platformGap(): number | null {
    if (this.platformTotal === null) return null;
    return this.platformTotal - this.stats.total;
  }

  /**
   * Barras por dia + média móvel de 7 dias. O export só lista dias com inscrição,
   * então a série é preenchida com zeros antes — senão a média pularia os dias parados.
   */
  private buildDaily(): void {
    const days = this.continuousDaily();
    const movingAverage = days.map((_, i) => {
      const window = days.slice(Math.max(0, i - 6), i + 1);
      return Math.round((window.reduce((sum, d) => sum + d.count, 0) / window.length) * 10) / 10;
    });

    this.dailyConfig = {
      type: 'bar',
      data: {
        labels: days.map(d => d.label),
        datasets: [
          {
            type: 'line',
            label: 'Média móvel (7 dias)',
            data: movingAverage,
            borderColor: CHART_SERIES[2],
            backgroundColor: CHART_SERIES[2],
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 3,
            order: 0,
          },
          {
            type: 'bar',
            label: 'Inscrições no dia',
            data: days.map(d => d.count),
            backgroundColor: CHART_SERIES[0],
            borderRadius: 3,
            order: 1,
          },
        ],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'bottom' } },
        scales: {
          x: { ticks: { maxTicksLimit: 12, autoSkip: true, maxRotation: 0 } },
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    } as ChartConfiguration;
  }

  /** Todos os dias entre a primeira e a última inscrição, com zero onde não houve nenhuma. */
  private continuousDaily(): Array<{ label: string; count: number }> {
    const daily = this.stats.daily;
    if (!daily.length) return [];

    const counts = new Map(daily.map(d => [d.date, d.count]));
    const toDate = (iso: string) => {
      const [y, m, d] = iso.split('-').map(Number);
      return new Date(y, m - 1, d);
    };
    const end = toDate(daily[daily.length - 1].date);
    const result: Array<{ label: string; count: number }> = [];

    for (let day = toDate(daily[0].date); day <= end; day.setDate(day.getDate() + 1)) {
      const mm = `${day.getMonth() + 1}`.padStart(2, '0');
      const dd = `${day.getDate()}`.padStart(2, '0');
      result.push({ label: `${dd}/${mm}`, count: counts.get(`${day.getFullYear()}-${mm}-${dd}`) ?? 0 });
    }
    return result;
  }

  private buildCumulative(): void {
    this.cumulativeConfig = {
      type: 'line',
      data: {
        labels: this.stats.daily.map(d => d.label),
        datasets: [{
          label: 'Total acumulado',
          data: this.stats.daily.map(d => d.cumulative),
          borderColor: CHART_SERIES[1],
          backgroundColor: 'rgba(25, 158, 112, 0.12)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    };
  }

  private buildMode(): void {
    this.modeConfig = {
      type: 'doughnut',
      data: {
        labels: ['Presencial', 'Virtual'],
        datasets: [{
          data: [this.stats.inPerson, this.stats.virtual],
          backgroundColor: [CHART_SERIES[0], CHART_SERIES[2]],
          borderColor: '#061027',
          borderWidth: 2,
        }],
      },
      options: {
        cutout: '62%',
        plugins: { legend: { position: 'bottom' } },
      },
    } as ChartConfiguration;
  }
}
