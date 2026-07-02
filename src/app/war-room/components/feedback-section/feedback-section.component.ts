import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { FeedbackInsights, QualitativeItem, RatingDistribution, CATEGORICAL_SCALE } from '../../services/war-room-insights.service';
import { InsightChartComponent, CHART_SERIES, CHART_ORDINAL_BLUES, CHART_DIVERGING, CHART_MUTED, CHART_SURFACE } from '../insight-chart/insight-chart.component';
import { StatTileComponent } from '../stat-tile/stat-tile.component';

type QuoteTab = 'liked' | 'toImprove' | 'mustHave' | 'final';

const SCALE_COLORS: Record<string, string> = {
  'Excelente': CHART_DIVERGING.strongPositive,
  'Boa': CHART_DIVERGING.positive,
  'OK': CHART_DIVERGING.neutral,
  'Ruim': CHART_DIVERGING.negative,
  'Muito Ruim': CHART_DIVERGING.strongNegative,
};

@Component({
  selector: 'app-feedback-section',
  standalone: true,
  imports: [CommonModule, InsightChartComponent, StatTileComponent],
  templateUrl: './feedback-section.component.html',
  styleUrl: './feedback-section.component.scss',
})
export class FeedbackSectionComponent implements OnChanges {
  @Input({ required: true }) insights!: FeedbackInsights;

  npsConfig: ChartConfiguration | null = null;
  overallConfig: ChartConfiguration | null = null;
  ratingsConfig: ChartConfiguration | null = null;
  venuesConfig: ChartConfiguration | null = null;
  talksConfig: ChartConfiguration | null = null;
  rolesConfig: ChartConfiguration | null = null;

  teamFormationPct = 0;
  firstTimersPct = 0;

  activeTab: QuoteTab = 'liked';
  readonly tabs: { key: QuoteTab; label: string }[] = [
    { key: 'liked', label: '💙 Mais gostaram' },
    { key: 'toImprove', label: '🔧 A melhorar' },
    { key: 'mustHave', label: '⭐ Não pode faltar' },
    { key: 'final', label: '💬 Comentários finais' },
  ];

  ngOnChanges(): void {
    if (!this.insights) return;

    const teamTotal = this.insights.teamFormation.yes + this.insights.teamFormation.no;
    this.teamFormationPct = teamTotal
      ? Math.round((this.insights.teamFormation.yes / teamTotal) * 100)
      : 0;
    this.firstTimersPct = this.insights.total
      ? Math.round((this.insights.firstTimers / this.insights.total) * 100)
      : 0;

    this.buildNps();
    this.buildOverall();
    this.buildRatings();
    this.venuesConfig = this.stackedRatings(this.insights.venueRatings);
    this.talksConfig = this.stackedRatings(this.insights.talkRatings);
    this.buildRoles();
  }

  fmt(n: number): string {
    return n.toLocaleString('pt-BR');
  }

  get activeQuotes(): QualitativeItem[] {
    return this.insights.quotes[this.activeTab];
  }

  private buildNps(): void {
    const nps = this.insights.nps;
    this.npsConfig = {
      type: 'doughnut',
      data: {
        labels: ['Promotores (9–10)', 'Neutros (7–8)', 'Detratores (0–6)'],
        datasets: [{
          data: [nps.promoters, nps.passives, nps.detractors],
          backgroundColor: [CHART_DIVERGING.strongPositive, CHART_DIVERGING.neutral, CHART_DIVERGING.negative],
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

  private buildOverall(): void {
    this.overallConfig = {
      type: 'bar',
      data: {
        labels: this.insights.overallDist.map(d => `Nota ${d.label}`),
        datasets: [{
          label: 'Respostas',
          data: this.insights.overallDist.map(d => d.count),
          backgroundColor: this.insights.overallDist.map(
            (_, i) => CHART_ORDINAL_BLUES[Math.min(i + 1, CHART_ORDINAL_BLUES.length - 1)]
          ),
          maxBarThickness: 24,
          borderRadius: 4,
          borderSkipped: 'start',
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, ticks: { stepSize: 5 } },
        },
      },
    };
  }

  private buildRatings(): void {
    const items = [...this.insights.ratingAverages].sort((a, b) => b.avg - a.avg);
    this.ratingsConfig = {
      type: 'bar',
      data: {
        labels: items.map(i => i.label),
        datasets: [{
          label: 'Nota média',
          data: items.map(i => i.avg),
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
          x: { beginAtZero: true, max: 5 },
          y: { grid: { display: false } },
        },
      },
    };
  }

  /** Barras empilhadas por escala (Excelente → Muito Ruim), escala divergente. */
  private stackedRatings(ratings: RatingDistribution[]): ChartConfiguration | null {
    if (!ratings.length) return null;

    const usedScales = CATEGORICAL_SCALE.filter(scale =>
      ratings.some(r => (r.counts[scale] || 0) > 0)
    );

    return {
      type: 'bar',
      data: {
        labels: ratings.map(r => r.name),
        datasets: usedScales.map(scale => ({
          label: scale === 'Boa' ? 'Boa / Bom' : scale,
          data: ratings.map(r => r.counts[scale] || 0),
          backgroundColor: SCALE_COLORS[scale] || CHART_MUTED,
          borderColor: CHART_SURFACE,
          borderWidth: 1,
          maxBarThickness: 18,
        })),
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { position: 'bottom' } },
        scales: {
          x: { stacked: true, beginAtZero: true },
          y: { stacked: true, grid: { display: false } },
        },
      },
    };
  }

  private buildRoles(): void {
    this.rolesConfig = {
      type: 'doughnut',
      data: {
        labels: this.insights.roleStats.map(r => r.label),
        datasets: [{
          data: this.insights.roleStats.map(r => r.count),
          backgroundColor: [CHART_SERIES[0], CHART_SERIES[4], CHART_SERIES[1], CHART_MUTED],
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
}
