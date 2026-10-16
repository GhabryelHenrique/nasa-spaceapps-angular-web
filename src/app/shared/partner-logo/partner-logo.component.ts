import { Component, input } from '@angular/core';
import { TALKS_PARTNER } from '../data/talks.data';

/**
 * Logo do parceiro da semana de palestras (GDG) com o rótulo "Em parceria com".
 *
 * O logo oficial tem texto escuro: no fundo Deep Blue ele some, então vai
 * sempre sobre uma placa branca (White é fundo aprovado pelo Brand Guide).
 */
@Component({
  selector: 'app-partner-logo',
  template: `
    <a class="lockup" [class.lockup--lg]="size() === 'lg'" [href]="partner.url"
       target="_blank" rel="noopener noreferrer">
      @if (label()) {
        <span class="lockup-label">{{ label() }}</span>
      }
      <span class="lockup-plate">
        <img [src]="partner.logo" [alt]="partner.name" width="300" height="30">
      </span>
    </a>
  `,
  styleUrl: './partner-logo.component.scss',
})
export class PartnerLogoComponent {
  readonly partner = TALKS_PARTNER;
  readonly label = input<string>('Em parceria com');
  readonly size = input<'md' | 'lg'>('md');
}
