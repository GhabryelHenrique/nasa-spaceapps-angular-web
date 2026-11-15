import {
  Component, computed, signal, inject, DestroyRef, afterNextRender, effect, untracked,
  ElementRef, viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { REGISTRATION_URL } from '../../../shared/data/registration.data';

type Phase = 'before' | 'live' | 'ended';

/** Partícula do canvas de comemoração (confete retangular ou faísca de fogos). */
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  color: string;
  rot: number; vr: number;
  life: number; decay: number;
  gravity: number; drag: number;
  kind: 'confetti' | 'spark';
}

/** Paleta oficial Space Apps (ver `_variables.scss`). */
const WHITE = [255, 255, 255];
const YELLOW = [234, 254, 7];   // $sa-neon-yellow
const RED = [255, 59, 31];      // vermelho do último trecho / pisca-pisca

const PARTY_COLORS =['#2E96F5', '#0960E1', '#E43700', '#EAFE07', '#FFFFFF', '#FF8A3D'];

@Component({
  selector: 'app-countdown',
  imports: [CommonModule, RouterLink],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss'
})
export class CountdownComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly campaignStart = new Date('2026-06-24T00:00:00-03:00');
  private readonly eventStart = new Date('2026-11-14T00:00:00-03:00');
  private readonly eventEnd = new Date('2026-11-15T23:59:59-03:00');
  private readonly now = signal(new Date());
  readonly starsArray = Array.from({ length: 60 }, (_, i) => i);
  readonly registrationUrl = REGISTRATION_URL;

  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');

  /** before = contando até o início; live = contando até o fim; ended = encerrado. */
  readonly phase = computed<Phase>(() => {
    const t = this.now().getTime();
    if (t < this.eventStart.getTime()) return 'before';
    if (t < this.eventEnd.getTime()) return 'live';
    return 'ended';
  });
  readonly isLive = computed(() => this.phase() === 'live');
  readonly isEnded = computed(() => this.phase() === 'ended');

  private readonly target = computed(() =>
    this.phase() === 'before' ? this.eventStart : this.eventEnd
  );
  readonly diff = computed(() => Math.max(0, this.target().getTime() - this.now().getTime()));
  /** Total de horas (sem separar dias) — pode passar de 24. */
  readonly hours   = computed(() => Math.floor(this.diff() / 3_600_000));
  readonly minutes = computed(() => Math.floor((this.diff() % 3_600_000) / 60_000));
  readonly seconds = computed(() => Math.floor((this.diff() % 60_000) / 1_000));

  /**
   * Urgência visual dos números:
   * - `warming`: de 1h a 30min, os números vão do branco ao amarelo aos poucos;
   * - `red`: 30min ou menos;
   * - `final`: último minuto, piscando rápido entre vermelho e amarelo.
   * Desligada durante a comemoração (a festa tem as próprias cores).
   */
  readonly urgency = computed<'none' | 'warming' | 'red' | 'final'>(() => {
    const d = this.diff();
    if (this.celebration() !== null || this.isEnded() || d <= 0) return 'none';
    if (d <= 60_000) return 'final';
    if (d <= 1_800_000) return 'red';
    if (d <= 3_600_000) return 'warming';
    return 'none';
  });

  /**
   * Cor dos números, interpolada aos poucos:
   * - `warming` (60 → 30 min): branco → amarelo Space Apps;
   * - `red` (30 → 1 min): amarelo → vermelho.
   */
  readonly digitColor = computed<string | null>(() => {
    const u = this.urgency();
    const d = this.diff();
    const lerp = (from: number[], to: number[], t: number) => {
      const k = Math.min(1, Math.max(0, t));
      const [r, g, b] = from.map((f, i) => Math.round(f + (to[i] - f) * k));
      return `rgb(${r}, ${g}, ${b})`;
    };
    if (u === 'warming') return lerp(WHITE, YELLOW, (3_600_000 - d) / 1_800_000);
    if (u === 'red') return lerp(YELLOW, RED, (1_800_000 - d) / (1_800_000 - 60_000));
    return null;
  });

  /** Antes do evento: progresso da campanha (jun → início). Durante: progresso do hackathon. */
  readonly progress = computed(() => {
    const from = this.phase() === 'before' ? this.campaignStart : this.eventStart;
    const to = this.target();
    const pct = ((this.now().getTime() - from.getTime()) / (to.getTime() - from.getTime())) * 100;
    return Math.min(100, Math.max(0, pct));
  });

  // ─── Tela cheia ─────────────────────────────────────────
  readonly isFullscreen = signal(false);
  readonly fullscreenSupported = signal(false);

  // ─── Comemoração ────────────────────────────────────────
  /** Qual contagem acabou de zerar: início do hackathon ou fim. `null` = sem festa. */
  readonly celebration = signal<'started' | 'ended' | null>(null);
  /** O relógio fica visível enquanto houver contagem ou enquanto a festa do fim estiver na tela. */
  readonly showTimer = computed(() => !this.isEnded() || this.celebration() !== null);

  private confettiCanvas: HTMLCanvasElement | null = null;
  private stopConfetti: (() => void) | null = null;

  constructor() {
    // Dispara a festa quando a contagem zera com a página aberta (troca de fase observada).
    let previous: Phase | undefined;
    effect(() => {
      const current = this.phase();
      if (previous !== undefined && previous !== current) {
        untracked(() => this.celebrate(current === 'ended' ? 'ended' : 'started'));
      }
      previous = current;
    });

    afterNextRender(() => {
      // Pré-visualização: ?faltam=45 adianta o relógio para faltarem 45 min na contagem atual.
      const params = new URLSearchParams(location.search);
      const previewMinutes = Number(params.get('faltam'));
      const offset = params.has('faltam') && Number.isFinite(previewMinutes)
        ? this.target().getTime() - previewMinutes * 60_000 - Date.now()
        : 0;
      const tick = () => this.now.set(new Date(Date.now() + offset));
      tick();
      const id = setInterval(tick, 1000);

      const doc = document as Document & { webkitFullscreenEnabled?: boolean };
      this.fullscreenSupported.set(!!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled));
      const onFsChange = () => this.onFullscreenChange();
      document.addEventListener('fullscreenchange', onFsChange);
      document.addEventListener('webkitfullscreenchange', onFsChange);

      // Pré-visualização: abra a página com ?comemorar para ver a festa.
      if (params.has('comemorar')) {
        setTimeout(() => this.celebrate('ended'), 600);
      }

      this.destroyRef.onDestroy(() => {
        clearInterval(id);
        document.removeEventListener('fullscreenchange', onFsChange);
        document.removeEventListener('webkitfullscreenchange', onFsChange);
        this.stopConfetti?.();
      });
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  // ─── Tela cheia ─────────────────────────────────────────
  async toggleFullscreen(): Promise<void> {
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      webkitExitFullscreen?: () => Promise<void>;
    };
    try {
      if (document.fullscreenElement || doc.webkitFullscreenElement) {
        await (document.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
        return;
      }
      const el = this.stage()?.nativeElement as
        (HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }) | undefined;
      if (!el) return;
      await (el.requestFullscreen?.({ navigationUI: 'hide' }) ?? el.webkitRequestFullscreen?.());
    } catch {
      /* navegador recusou (ex.: iframe sem permissão) — ignora */
    }
  }

  private fullscreenElement(): Element | null {
    const doc = document as Document & { webkitFullscreenElement?: Element };
    return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
  }

  private onFullscreenChange(): void {
    const fsEl = this.fullscreenElement();
    this.isFullscreen.set(!!fsEl && fsEl === this.stage()?.nativeElement);
    // Só a árvore do elemento em tela cheia é exibida: leva o canvas junto.
    if (this.confettiCanvas) (fsEl ?? document.body).appendChild(this.confettiCanvas);
  }

  // ─── Comemoração ────────────────────────────────────────
  celebrate(kind: 'started' | 'ended'): void {
    this.celebration.set(kind);
    this.launchConfetti(14_000);
  }

  closeCelebration(): void {
    this.celebration.set(null);
    this.stopConfetti?.();
  }

  /** Confete + fogos num canvas fixo sobre a tela (ou sobre o elemento em tela cheia). */
  private launchConfetti(durationMs: number): void {
    this.stopConfetti?.();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'fixed', inset: '0', width: '100vw', height: '100vh',
      pointerEvents: 'none', zIndex: '10000'
    });
    (this.fullscreenElement() ?? document.body).appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) { canvas.remove(); return; }
    this.confettiCanvas = canvas;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const pick = () => PARTY_COLORS[Math.floor(Math.random() * PARTY_COLORS.length)];
    const parts: Particle[] = [];

    /** Canhão de confete saindo de (x, y) na direção `angle` (radianos). */
    const cannon = (x: number, y: number, angle: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const a = angle + rand(-0.45, 0.45);
        const speed = rand(9, 19);
        parts.push({
          x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
          size: rand(6, 12), color: pick(),
          rot: rand(0, Math.PI * 2), vr: rand(-0.3, 0.3),
          life: 1, decay: rand(0.0025, 0.005), gravity: 0.32, drag: 0.985,
          kind: 'confetti'
        });
      }
    };

    /** Explosão de fogos de artifício em (x, y). */
    const firework = (x: number, y: number) => {
      const color = pick();
      const count = 70;
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + rand(-0.05, 0.05);
        const speed = rand(2.5, 7);
        parts.push({
          x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
          size: rand(1.6, 3), color: Math.random() < 0.2 ? '#FFFFFF' : color,
          rot: 0, vr: 0,
          life: 1, decay: rand(0.012, 0.02), gravity: 0.06, drag: 0.97,
          kind: 'spark'
        });
      }
    };

    /** Chuva de confete caindo do topo. */
    const rain = (count: number) => {
      for (let i = 0; i < count; i++) {
        parts.push({
          x: rand(0, window.innerWidth), y: rand(-60, -10),
          vx: rand(-1.5, 1.5), vy: rand(1, 3.5),
          size: rand(6, 11), color: pick(),
          rot: rand(0, Math.PI * 2), vr: rand(-0.2, 0.2),
          life: 1, decay: 0.002, gravity: 0.05, drag: 0.995,
          kind: 'confetti'
        });
      }
    };

    const start = performance.now();
    let last = start;
    let nextCannon = start;
    let nextFirework = start + 400;
    let nextRain = start;
    let rafId = 0;

    const tick = (t: number) => {
      const dt = Math.min(40, t - last) / 16.67;
      last = t;
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (t - start < durationMs) {
        if (t >= nextCannon) {
          cannon(0, h, -Math.PI / 3, 55);
          cannon(w, h, (-2 * Math.PI) / 3, 55);
          nextCannon = t + rand(1400, 2200);
        }
        if (t >= nextFirework) {
          firework(rand(w * 0.15, w * 0.85), rand(h * 0.12, h * 0.5));
          nextFirework = t + rand(350, 800);
        }
        if (t >= nextRain) {
          rain(8);
          nextRain = t + 120;
        }
      }

      ctx.clearRect(0, 0, w, h);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vx *= Math.pow(p.drag, dt);
        p.vy = p.vy * Math.pow(p.drag, dt) + p.gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0 || p.y > h + 40) { parts.splice(i, 1); continue; }

        ctx.globalAlpha = Math.min(1, p.life * 1.5);
        ctx.fillStyle = p.color;
        if (p.kind === 'spark') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // "Papel" girando: a largura oscila com a rotação para simular o flip.
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size * Math.abs(Math.cos(p.rot * 1.7)) + 1, p.size / 2);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;

      if (t - start < durationMs || parts.length) rafId = requestAnimationFrame(tick);
      else this.stopConfetti?.();
    };
    rafId = requestAnimationFrame(tick);

    this.stopConfetti = () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.remove();
      this.confettiCanvas = null;
      this.stopConfetti = null;
    };
  }

  /** Números de 2025 usados como prova social. */
  readonly hypeStats = [
    { icon: 'ph ph-users-three', value: '1400', plus: true, label: 'Participantes em 2025' },
    { icon: 'ph ph-trophy', value: '10', plus: false, label: 'Global Nominees' },
    { icon: 'ph ph-globe-hemisphere-west', value: '#1', plus: false, label: 'Hemisfério Ocidental' },
    { icon: 'ph ph-shooting-star', value: '160', plus: true, label: 'Times formados' }
  ];
}
