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
  @ViewChild('dailyChart', { static: false }) dailyChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('motivationChart', { static: false }) motivationChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cityChart', { static: false }) cityChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('experienceChart', { static: false }) experienceChart!: ElementRef<HTMLCanvasElement>;

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
    this.createMotivationChart();
    this.createCityChart();
    this.createExperienceChart();
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

  private createMotivationChart() {
    if (!this.motivationChart || !this.registrationStats) return;

    const ctx = this.motivationChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const topMotivations = this.registrationStats.motivationStats.slice(0, 5);

    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: {
        labels: topMotivations.map(m => m.motivation),
        datasets: [{
          data: topMotivations.map(m => m.count),
          backgroundColor: [
            '#4ecdc4',
            '#45b7d1',
            '#5865F2',
            '#7289da',
            '#99aab5'
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
            text: 'Principais Motivações',
            color: '#ffffff'
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
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
            text: 'Nível de Experiência',
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
