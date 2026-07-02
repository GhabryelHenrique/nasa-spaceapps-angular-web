import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { RegistrationStats } from '../../../services/registration-data.service';
import { InscritosExtras } from '../../services/war-room-insights.service';
import { InsightChartComponent, CHART_SERIES, CHART_ORDINAL_BLUES, CHART_MUTED, CHART_SURFACE } from '../insight-chart/insight-chart.component';
import { StatTileComponent } from '../stat-tile/stat-tile.component';

const AGE_ORDER = ['< 18 anos', '18-24 anos', '25-29 anos', '30-34 anos', '35+ anos'];

@Component({
  selector: 'app-inscritos-section',
  standalone: true,
  imports: [CommonModule, InsightChartComponent, StatTileComponent],
  templateUrl: './inscritos-section.component.html',
  styleUrl: './inscritos-section.component.scss',
})
export class InscritosSectionComponent implements OnChanges {
  @Input({ required: true }) stats!: RegistrationStats;
  @Input({ required: true }) extras!: InscritosExtras;

  dailyConfig: ChartConfiguration | null = null;
  cumulativeConfig: ChartConfiguration | null = null;
  educationConfig: ChartConfiguration | null = null;
  ageConfig: ChartConfiguration | null = null;
  genderConfig: ChartConfiguration | null = null;
  modeConfig: ChartConfiguration | null = null;
  citiesConfig: ChartConfiguration | null = null;
  dddConfig: ChartConfiguration | null = null;
  interestConfig: ChartConfiguration | null = null;
  howHeardConfig: ChartConfiguration | null = null;

  uberlandiaPct = 0;

  ngOnChanges(): void {
    if (!this.stats || !this.extras) return;
    this.uberlandiaPct = this.stats.totalRegistrations
      ? Math.round((this.stats.uberlandiaRegistrations / this.stats.totalRegistrations) * 100)
      : 0;
    this.buildTimeline();
    this.buildCumulative();
    this.buildEducation();
    this.buildAge();
    this.buildGender();
    this.buildMode();
    this.buildCities();
    this.buildDDD();
    this.buildInterests();
    this.buildHowHeard();
  }

  fmt(n: number): string {
    return n.toLocaleString('pt-BR');
  }

  fmtDate(iso: string | Date | null): string {
    if (!iso) return '—';
    const date = typeof iso === 'string' ? new Date(`${iso}T12:00:00`) : iso;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  private buildTimeline(): void {
    const daily = this.stats.dailyRegistrations;
    const labels = daily.map(d => this.fmtDate(d.date));
    const counts = daily.map(d => d.count);
    const movingAvg = counts.map((_, i) => {
      const window = counts.slice(Math.max(0, i - 6), i + 1);
      return Math.round((window.reduce((a, b) => a + b, 0) / window.length) * 10) / 10;
    });

    this.dailyConfig = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Inscrições no dia',
            data: counts,
            borderColor: CHART_SERIES[0],
            backgroundColor: 'rgba(46, 150, 245, 0.1)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: CHART_SERIES[0],
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Média móvel (7 dias)',
            data: movingAvg,
            borderColor: CHART_SERIES[2],
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.4,
          },
        ],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: { ticks: { maxTicksLimit: 10, maxRotation: 0 } },
          y: { beginAtZero: true },
        },
      },
    };
  }

  private buildCumulative(): void {
    this.cumulativeConfig = {
      type: 'line',
      data: {
        labels: this.extras.cumulative.map(c => this.fmtDate(c.date)),
        datasets: [{
          label: 'Total acumulado',
          data: this.extras.cumulative.map(c => c.total),
          borderColor: CHART_SERIES[0],
          backgroundColor: 'rgba(46, 150, 245, 0.12)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          fill: true,
          tension: 0.25,
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: { ticks: { maxTicksLimit: 10, maxRotation: 0 } },
          y: { beginAtZero: true },
        },
      },
    };
  }

  private horizontalBar(labels: string[], data: number[], seriesLabel: string): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: seriesLabel,
          data,
          backgroundColor: CHART_SERIES[0],
          maxBarThickness: 18,
          borderRadius: 4,
          borderSkipped: 'start',
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true },
          y: { grid: { display: false } },
        },
      },
    };
  }

  private buildEducation(): void {
    const top = this.stats.experienceStats.slice(0, 8);
    this.educationConfig = this.horizontalBar(top.map(e => e.level), top.map(e => e.count), 'Inscritos');
  }

  private buildAge(): void {
    const ordered = AGE_ORDER
      .map(label => this.stats.ageStats.find(a => a.ageGroup === label))
      .filter((a): a is { ageGroup: string; count: number } => !!a);
    this.ageConfig = {
      type: 'bar',
      data: {
        labels: ordered.map(a => a.ageGroup),
        datasets: [{
          label: 'Inscritos',
          data: ordered.map(a => a.count),
          backgroundColor: ordered.map((_, i) => CHART_ORDINAL_BLUES[Math.min(i + 1, CHART_ORDINAL_BLUES.length - 1)]),
          maxBarThickness: 24,
          borderRadius: 4,
          borderSkipped: 'start',
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true },
        },
      },
    };
  }

  private buildGender(): void {
    const sorted = [...this.stats.genderStats].sort((a, b) => b.count - a.count);
    const top = sorted.slice(0, 2);
    const otherCount = sorted.slice(2).reduce((sum, g) => sum + g.count, 0);
    const labels = top.map(g => g.gender.replace(/^\S+\s/, ''));
    const data = top.map(g => g.count);
    if (otherCount > 0) {
      labels.push('Outros');
      data.push(otherCount);
    }
    this.genderConfig = this.doughnut(labels, data, [CHART_SERIES[0], CHART_SERIES[1], CHART_MUTED]);
  }

  private buildMode(): void {
    const labels = this.stats.participationModeStats.map(m => m.mode.replace(/^\S+\s/, ''));
    const data = this.stats.participationModeStats.map(m => m.count);
    this.modeConfig = this.doughnut(labels, data, [CHART_SERIES[0], CHART_SERIES[4], CHART_MUTED]);
  }

  private doughnut(labels: string[], data: number[], colors: string[]): ChartConfiguration {
    return {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: CHART_SURFACE,
          borderWidth: 2,
        }],
      },
      options: <any>{
        cutout: '62%',
        plugins: { legend: { position: 'bottom' } },
      },
    };
  }

  private buildCities(): void {
    const top = this.stats.cityStats.slice(0, 10);
    this.citiesConfig = this.horizontalBar(top.map(c => c.city), top.map(c => c.count), 'Inscritos');
  }

  private buildDDD(): void {
    const top = this.stats.phoneAreaStats.slice(0, 8);
    this.dddConfig = this.horizontalBar(top.map(a => a.area), top.map(a => a.count), 'Inscritos');
  }

  private buildInterests(): void {
    const top = this.extras.interestAreaStats;
    this.interestConfig = this.horizontalBar(top.map(a => a.label), top.map(a => a.count), 'Menções');
  }

  private buildHowHeard(): void {
    const top = this.stats.motivationStats.slice(0, 10);
    const labels = top.map(m => m.motivation.charAt(0).toUpperCase() + m.motivation.slice(1));
    this.howHeardConfig = this.horizontalBar(labels, top.map(m => m.count), 'Menções');
  }
}
