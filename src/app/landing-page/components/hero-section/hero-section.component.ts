import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const HERO_PHOTOS = [
  'assets/photos/IMG_0828.png',
  'assets/photos/IMG_0819.png',
  'assets/photos/IMG_0691.JPG',
  'assets/photos/IMG_0551.png',
  'assets/photos/IMG_0551.png',
  'assets/photos/Titan - Global Finalist Nasa Space Apps 2025.mp4',
];

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  readonly heroBg = HERO_PHOTOS[Math.floor(Math.random() * HERO_PHOTOS.length)];

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
