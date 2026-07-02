import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { MentoresInsights } from '../../services/war-room-insights.service';
import { InsightChartComponent, CHART_SERIES, CHART_MUTED, CHART_SURFACE } from '../insight-chart/insight-chart.component';
import { StatTileComponent } from '../stat-tile/stat-tile.component';

@Component({
  selector: 'app-mentores-section',
  standalone: true,
  imports: [CommonModule, InsightChartComponent, StatTileComponent],
  templateUrl: './mentores-section.component.html',
  styleUrl: './mentores-section.component.scss',
})
export class MentoresSectionComponent implements OnChanges {
  @Input({ required: true }) insights!: MentoresInsights;
  @Input() inscritosTotal = 0;

  availabilityConfig: ChartConfiguration | null = null;
  slotsConfig: ChartConfiguration | null = null;
  areasConfig: ChartConfiguration | null = null;
  educationConfig: ChartConfiguration | null = null;
  orgsConfig: ChartConfiguration | null = null;

  presencialPct = 0;
  participantsPerMentor = 0;

  ngOnChanges(): void {
    if (!this.insights) return;

    const presencial = this.insights.availabilityStats.find(a => a.label.startsWith('Presencial'))?.count || 0;
    this.presencialPct = this.insights.total ? Math.round((presencial / this.insights.total) * 100) : 0;
    this.participantsPerMentor = this.insights.total
      ? Math.round((this.inscritosTotal / this.insights.total) * 10) / 10
      : 0;

    this.buildAvailability();
    this.buildSlots();
    this.buildAreas();
    this.buildEducation();
    this.buildOrgs();
  }

  fmt(n: number): string {
    return n.toLocaleString('pt-BR');
  }

  private buildAvailability(): void {
    this.availabilityConfig = {
      type: 'doughnut',
      data: {
        labels: this.insights.availabilityStats.map(a => a.label),
        datasets: [{
          data: this.insights.availabilityStats.map(a => a.count),
          backgroundColor: [CHART_SERIES[0], CHART_SERIES[4], CHART_MUTED],
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

  private buildSlots(): void {
    this.slotsConfig = {
      type: 'bar',
      data: {
        labels: this.insights.slotStats.map(s => s.label),
        datasets: [{
          label: 'Mentores',
          data: this.insights.slotStats.map(s => s.count),
          backgroundColor: CHART_SERIES[0],
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

  private horizontalBar(labels: string[], data: number[]): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Mentores',
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

  private buildAreas(): void {
    const top = this.insights.areaStats.slice(0, 10);
    this.areasConfig = this.horizontalBar(top.map(a => a.label), top.map(a => a.count));
  }

  private buildEducation(): void {
    const top = this.insights.educationStats.slice(0, 8);
    this.educationConfig = this.horizontalBar(top.map(e => e.label), top.map(e => e.count));
  }

  private buildOrgs(): void {
    this.orgsConfig = this.horizontalBar(
      this.insights.orgStats.map(o => o.label),
      this.insights.orgStats.map(o => o.count)
    );
  }
}
