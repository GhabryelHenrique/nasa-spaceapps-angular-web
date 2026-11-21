import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WHATSAPP_URL } from '../../../shared/data/registration.data';
import { EDITION_2026_RESULTS, EDITION_2026_STATS } from '../../../shared/data/edition-2026-results.data';

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  /**
   * Arte do tema 2026. Fica dentro de uma "holding shape" circular, sem texto
   * por cima — Brand Guide 2026, pág. 10.
   */
  readonly themeImage = 'assets/nasa-spaceapps-logo-removebg-preview.png';
  readonly themeImageAlt = 'NASA Space Apps Challenge';
  readonly particles = Array.from({ length: 20 }, (_, i) => i);

  readonly whatsappUrl = WHATSAPP_URL;

  /** Resultado da edição 2026 (inscritos, times, projetos, ranking, indicados). */
  readonly results = EDITION_2026_RESULTS;
  readonly stats = EDITION_2026_STATS;
}
