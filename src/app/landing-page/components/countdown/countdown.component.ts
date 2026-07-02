import { Component, computed, signal, inject, DestroyRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown',
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss'
})
export class CountdownComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly eventDate = new Date('2026-11-14T09:00:00-03:00');
  private readonly now = signal(new Date());
  readonly starsArray = Array.from({ length: 60 }, (_, i) => i);

  readonly diff = computed(() => Math.max(0, this.eventDate.getTime() - this.now().getTime()));
  readonly isLive = computed(() => this.diff() <= 0);
  readonly days    = computed(() => Math.floor(this.diff() / 86_400_000));
  readonly hours   = computed(() => Math.floor((this.diff() % 86_400_000) / 3_600_000));
  readonly minutes = computed(() => Math.floor((this.diff() % 3_600_000) / 60_000));
  readonly seconds = computed(() => Math.floor((this.diff() % 60_000) / 1_000));

  readonly totalDays = computed(() =>
    Math.ceil((this.eventDate.getTime() - new Date('2026-06-24').getTime()) / 86_400_000)
  );
  readonly elapsed = computed(() =>
    Math.ceil((this.now().getTime() - new Date('2026-06-24').getTime()) / 86_400_000)
  );
  readonly progress = computed(() =>
    Math.min(100, Math.max(0, (this.elapsed() / this.totalDays()) * 100))
  );

  constructor() {
    afterNextRender(() => {
      const id = setInterval(() => this.now.set(new Date()), 1000);
      this.destroyRef.onDestroy(() => clearInterval(id));
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
