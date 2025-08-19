import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  scrollToInfo(): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById('info');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
