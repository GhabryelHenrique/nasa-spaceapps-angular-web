import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarController,
  DoughnutController,
  PieController,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  Filler
} from 'chart.js';
import { RegistrationStats } from '../../../services/registration-data.service';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarController,
  DoughnutController,
  PieController,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

@Component({
  selector: 'app-registration-charts',
  imports: [CommonModule],
  templateUrl: './registration-charts.component.html',
  styleUrl: './registration-charts.component.scss'
})
export class RegistrationChartsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() registrationStats: RegistrationStats | null = null;
  @Input() uberlandia: any | null = null;
  @ViewChild('dailyChart', { static: false }) dailyChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cityChart', { static: false }) cityChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('experienceChart', { static: false }) experienceChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ageChart', { static: false }) ageChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('participationChart', { static: false }) participationChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('phoneAreaChart', { static: false }) phoneAreaChart!: ElementRef<HTMLCanvasElement>;

  motivationStats: { motivation: string; count: number }[] | any = [];
  private charts: Chart[] = [];

  ngOnInit() {
    if (this.registrationStats) {
      setTimeout(() => this.initializeCharts(), 100);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['registrationStats'] && !changes['registrationStats'].firstChange) {
      this.destroyCharts();
      setTimeout(() => this.initializeCharts(), 100);
    }
  }

  private destroyCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  private initializeCharts() {
    if (!this.registrationStats) return;

    this.createDailyRegistrationsChart();
    this.getMotivationStats();
    this.createCityChart();
    this.createExperienceChart();
    this.createAgeChart();
    this.createParticipationChart();
    this.createPhoneAreaChart();
  }

  private createDailyRegistrationsChart() {
    if (!this.dailyChart || !this.registrationStats) return;

    const ctx = this.dailyChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: this.registrationStats.dailyRegistrations.map(d =>
          new Date(d.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
        ),
        datasets: [{
          label: 'Inscrições por Dia',
          data: this.registrationStats.dailyRegistrations.map(d => d.count),
          borderColor: '#4ecdc4',
          backgroundColor: 'rgba(78, 205, 196, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#ffffff' }
          },
          x: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#ffffff' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#ffffff' }
          },
          title: {
            display: true,
            text: 'Inscrições por Dia',
            color: '#ffffff'
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

getMotivationStats() {
  if (!this.registrationStats?.motivationStats) {
    this.motivationStats = [];
    return;
  }

  // Já vem ordenado e agrupado do service, só pega os 5 primeiros
  this.motivationStats = this.registrationStats.motivationStats
    .slice(0, 5);

  console.log('Top 5 motivações:', this.motivationStats);
}


  private createCityChart() {
    if (!this.cityChart || !this.registrationStats) return;

    const ctx = this.cityChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const topCities = this.registrationStats.cityStats.slice(0, 8);

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: topCities.map(c => c.city),
        datasets: [{
          label: 'Inscrições',
          data: topCities.map(c => c.count),
          backgroundColor: '#45b7d1',
          borderColor: '#4ecdc4',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#ffffff' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#ffffff' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#ffffff' }
          },
          title: {
            display: true,
            text: 'Inscrições por Cidade',
            color: '#ffffff'
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private createExperienceChart() {
    if (!this.experienceChart || !this.registrationStats) return;

    const ctx = this.experienceChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'pie' as ChartType,
      data: {
        labels: this.registrationStats.experienceStats.map(e => e.level),
        datasets: [{
          data: this.registrationStats.experienceStats.map(e => e.count),
          backgroundColor: [
            '#4ecdc4',
            '#45b7d1',
            '#5865F2',
            '#7289da',
            '#99aab5',
            '#f1c40f'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#ffffff', padding: 20 }
          },
          title: {
            display: true,
            text: 'Escolaridade',
            color: '#ffffff'
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private createAgeChart() {
    if (!this.ageChart || !this.registrationStats) return;

    const ctx = this.ageChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: this.registrationStats.ageStats.map(a => a.ageGroup),
        datasets: [{
          label: 'Participantes',
          data: this.registrationStats.ageStats.map(a => a.count),
          backgroundColor: '#4ecdc4',
          borderColor: '#45b7d1',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#ffffff' }
          },
          x: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#ffffff' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#ffffff' }
          },
          title: {
            display: true,
            text: 'Distribuição por Idade',
            color: '#ffffff'
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private createParticipationChart() {
    if (!this.participationChart || !this.registrationStats) return;

    const ctx = this.participationChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: {
        labels: this.registrationStats.participationModeStats.map(p => p.mode),
        datasets: [{
          data: this.registrationStats.participationModeStats.map(p => p.count),
          backgroundColor: ['#4ecdc4', '#45b7d1', '#5865F2']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#ffffff', padding: 20 }
          },
          title: {
            display: true,
            text: 'Modo de Participação',
            color: '#ffffff'
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private createPhoneAreaChart() {
    if (!this.phoneAreaChart || !this.registrationStats) return;

    const ctx = this.phoneAreaChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: this.registrationStats.phoneAreaStats.map(p => p.area),
        datasets: [{
          label: 'Participantes',
          data: this.registrationStats.phoneAreaStats.map(p => p.count),
          backgroundColor: '#5865F2',
          borderColor: '#4ecdc4',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#ffffff' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#ffffff' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#ffffff' }
          },
          title: {
            display: true,
            text: 'Participantes por Região (DDD)',
            color: '#ffffff'
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  ngOnDestroy() {
    this.destroyCharts();
  }
}
