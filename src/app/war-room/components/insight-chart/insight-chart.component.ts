import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

/** Paleta categórica validada (CVD + contraste) para a superfície escura. */
export const CHART_SERIES = [
  '#2E96F5', // azul NASA
  '#199e70', // verde-água
  '#c98500', // âmbar
  '#008300', // verde
  '#9085e9', // violeta
  '#e66767', // vermelho
  '#d55181', // magenta
  '#d95926', // laranja
];

/** Rampa ordinal de azuis (categorias ordenadas: faixas etárias, notas). */
export const CHART_ORDINAL_BLUES = ['#86b6ef', '#5598e7', '#3987e5', '#256abf', '#1c5cab', '#184f95'];

/** Escala divergente para Likert (positivo azul, neutro cinza, negativo vermelho). */
export const CHART_DIVERGING = {
  strongPositive: '#3987e5',
  positive: '#86b6ef',
  neutral: '#5d6577',
  negative: '#e66767',
  strongNegative: '#c94f4f',
};

export const CHART_MUTED = '#5d6577';
const SURFACE = '#061027';
const GRID = 'rgba(255, 255, 255, 0.07)';
const TICK = '#B8B8B8';
const FONT = "'Overpass', 'Segoe UI', sans-serif";

@Component({
  selector: 'app-insight-chart',
  standalone: true,
  template: `<div class="chart-holder" [style.height.px]="height"><canvas #canvas></canvas></div>`,
  styles: [`
    .chart-holder {
      position: relative;
      width: 100%;
    }
  `],
})
export class InsightChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input({ required: true }) config!: ChartConfiguration;
  @Input() height = 260;

  private chart: Chart | null = null;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.viewReady) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }

  private render(): void {
    if (!this.config) return;
    this.chart?.destroy();

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      ...this.config,
      options: this.themedOptions(this.config.options || {}),
    });
  }

  /** Mescla as opções do gráfico com o tema escuro padrão da sala de guerra. */
  private themedOptions(options: any): any {
    const base: any = {
      responsive: true,
      maintainAspectRatio: false,
      font: { family: FONT },
      plugins: {
        legend: {
          labels: {
            color: TICK,
            font: { family: FONT, size: 12 },
            usePointStyle: true,
            pointStyleWidth: 10,
            boxHeight: 7,
            padding: 14,
          },
        },
        tooltip: {
          backgroundColor: '#07173F',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          borderWidth: 1,
          titleColor: '#FFFFFF',
          bodyColor: '#B8B8B8',
          titleFont: { family: FONT, weight: 'bold' },
          bodyFont: { family: FONT },
          padding: 10,
          cornerRadius: 6,
          boxPadding: 4,
        },
      },
    };

    const merged = this.deepMerge(base, options);

    // Tema dos eixos: aplicado a cada escala declarada pelo gráfico
    if (merged.scales) {
      Object.keys(merged.scales).forEach(key => {
        const scale = merged.scales[key];
        scale.grid = { color: GRID, drawTicks: false, ...(scale.grid || {}) };
        scale.ticks = { color: TICK, font: { family: FONT, size: 11 }, ...(scale.ticks || {}) };
        scale.border = { color: 'rgba(255, 255, 255, 0.15)', ...(scale.border || {}) };
      });
    }

    return merged;
  }

  private deepMerge(base: any, override: any): any {
    const result: any = { ...base };
    Object.keys(override).forEach(key => {
      const baseValue = base[key];
      const overrideValue = override[key];
      if (
        baseValue && overrideValue &&
        typeof baseValue === 'object' && typeof overrideValue === 'object' &&
        !Array.isArray(baseValue) && !Array.isArray(overrideValue)
      ) {
        result[key] = this.deepMerge(baseValue, overrideValue);
      } else {
        result[key] = overrideValue;
      }
    });
    return result;
  }
}

/** Superfície dos cards — usada como cor de "vão" entre segmentos empilhados. */
export const CHART_SURFACE = SURFACE;
