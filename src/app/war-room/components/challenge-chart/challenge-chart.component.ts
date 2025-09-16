import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Team } from '../../../shared/data/teams.data';

interface ChallengeCount {
  challengeId: string;
  challengeTitle: string;
  count: number;
  color: string;
}

@Component({
  selector: 'app-challenge-chart',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './challenge-chart.component.html',
  styleUrls: ['./challenge-chart.component.scss']
})
export class ChallengeChartComponent implements OnInit, OnChanges {
  @Input() teams: Team[] = [];

  public challengeData: ChallengeCount[] = [];
  public isLoading = false;

  // Chart.js configuration
  public chartType: ChartType = 'doughnut' as const;

  public chartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#4ecdc4',
        '#45b7d1',
        '#5865F2',
        '#ff6b6b',
        '#4ecdc4',
        '#feca57',
        '#ff9ff3',
        '#54a0ff',
        '#ff7675',
        '#74b9ff',
        '#00b894',
        '#fdcb6e'
      ] as string[],
      borderWidth: 2,
      borderColor: '#1a1a2e',
      hoverBorderWidth: 3,
      hoverBorderColor: '#ffffff'
    }]
  };

  public chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 46, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#4ecdc4',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} times (${percentage}%)`;
          }
        }
      }
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        hoverBorderWidth: 4
      }
    }
  };

  ngOnInit(): void {
    this.processTeamData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.teams)
    if (changes['teams']) {
      this.processTeamData();
    }
  }

  private processTeamData(): void {
    if (!this.teams || this.teams.length === 0) {
      this.challengeData = [];
      this.updateChart();
      return;
    }

    this.isLoading = true;

    // Count challenges
    const challengeMap = new Map<string, ChallengeCount>();

    this.teams.forEach(team => {
        const challengeId = team.challengeDetails.id || team.challenge;
        const challengeTitle = team.challengeDetails.title;

        if (challengeMap.has(challengeId)) {
          challengeMap.get(challengeId)!.count++;
        } else {
          challengeMap.set(challengeId, {
            challengeId,
            challengeTitle,
            count: 1,
            color: this.getColorForChallenge(challengeMap.size)
          });
      }
    });

    // Convert to array and sort by count (descending)
    this.challengeData = Array.from(challengeMap.values())
      .sort((a, b) => b.count - a.count);

    // Show only top 12 challenges to avoid clutter
    this.challengeData = this.challengeData.slice(0, 12);

    this.updateChart();
    this.isLoading = false;
  }

  private updateChart(): void {
    this.chartData = {
      labels: this.challengeData.map(c => c.challengeTitle),
      datasets: [{
        data: this.challengeData.map(c => c.count),
        backgroundColor: this.challengeData.map(c => c.color) as string[],
        borderWidth: 2,
        borderColor: '#1a1a2e',
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff'
      }]
    };
  }

  private getColorForChallenge(index: number): string {
    const colors = [
      '#4ecdc4',
      '#45b7d1',
      '#5865F2',
      '#ff6b6b',
      '#4ecdc4',
      '#feca57',
      '#ff9ff3',
      '#54a0ff',
      '#ff7675',
      '#74b9ff',
      '#00b894',
      '#fdcb6e'
    ];
    return colors[index % colors.length];
  }

  public getMostPopularChallenge(): ChallengeCount | null {
    return this.challengeData.length > 0 ? this.challengeData[0] : null;
  }

  public getTotalChallenges(): number {
    return this.challengeData.length;
  }

  public getTotalTeamsWithChallenges(): number {
    return this.challengeData.reduce((sum, challenge) => sum + challenge.count, 0);
  }
}
