import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { TeamsInsights } from '../../services/war-room-insights.service';
import { WinnerTeam } from '../../../shared/data/winner-teams.data';
import { InsightChartComponent, CHART_SERIES, CHART_MUTED, CHART_SURFACE } from '../insight-chart/insight-chart.component';
import { StatTileComponent } from '../stat-tile/stat-tile.component';

@Component({
  selector: 'app-teams-section',
  standalone: true,
  imports: [CommonModule, RouterLink, InsightChartComponent, StatTileComponent],
  templateUrl: './teams-section.component.html',
  styleUrl: './teams-section.component.scss',
})
export class TeamsSectionComponent implements OnChanges {
  @Input({ required: true }) insights!: TeamsInsights;
  @Input() winners: WinnerTeam[] = [];

  challengesConfig: ChartConfiguration | null = null;

  ngOnChanges(): void {
    if (!this.insights) return;
    this.buildChallenges();
  }

  fmt(n: number): string {
    return n.toLocaleString('pt-BR');
  }

  private buildChallenges(): void {
    const top = this.insights.challengeStats.slice(0, 12);
    const rest = this.insights.challengeStats.slice(12);
    const labels = top.map(c => this.shorten(c.label));
    const submitted = top.map(c => c.submitted);
    const notSubmitted = top.map(c => c.total - c.submitted);

    if (rest.length > 0) {
      labels.push(`Outros (${rest.length} desafios)`);
      submitted.push(rest.reduce((sum, c) => sum + c.submitted, 0));
      notSubmitted.push(rest.reduce((sum, c) => sum + (c.total - c.submitted), 0));
    }

    this.challengesConfig = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Projeto enviado',
            data: submitted,
            backgroundColor: CHART_SERIES[0],
            borderColor: CHART_SURFACE,
            borderWidth: 1,
            maxBarThickness: 18,
          },
          {
            label: 'Sem envio',
            data: notSubmitted,
            backgroundColor: CHART_MUTED,
            borderColor: CHART_SURFACE,
            borderWidth: 1,
            maxBarThickness: 18,
          },
        ],
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

  private shorten(label: string): string {
    return label.length > 42 ? label.slice(0, 40).trimEnd() + '…' : label;
  }
}
