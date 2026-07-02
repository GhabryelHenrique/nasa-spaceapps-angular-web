import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-tile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-tile" [class.accent]="accent">
      <span class="stat-label">{{ label }}</span>
      <span class="stat-value">{{ value }}</span>
      <span class="stat-detail" *ngIf="detail">{{ detail }}</span>
    </div>
  `,
  styles: [`
    .stat-tile {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      padding: 1.1rem 1.25rem;
      background: rgba(7, 23, 63, 0.55);
      border: 1px solid rgba(46, 150, 245, 0.2);
      border-radius: 12px;
      min-width: 0;

      &.accent {
        border-color: rgba(46, 150, 245, 0.5);
        background: linear-gradient(160deg, rgba(9, 96, 225, 0.25), rgba(7, 23, 63, 0.55));
      }
    }

    .stat-label {
      font-size: 0.78rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-muted, #888888);
    }

    .stat-value {
      font-family: 'Fira Sans', sans-serif;
      font-weight: 700;
      font-size: 1.9rem;
      line-height: 1.1;
      color: var(--text-primary, #FFFFFF);
    }

    .stat-detail {
      font-size: 0.82rem;
      color: var(--text-secondary, #B8B8B8);
    }
  `],
})
export class StatTileComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value = '';
  @Input() detail = '';
  @Input() accent = false;
}
