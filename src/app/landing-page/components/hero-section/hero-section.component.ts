import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

const HERO_PHOTOS = [
  'assets/photos/IMG_0828.png',
  'assets/photos/IMG_0819.png',
  'assets/photos/IMG_0691.JPG',
  'assets/photos/IMG_0551.png',
  'assets/photos/Titan - Global Finalist Nasa Space Apps 2025.mp4',
];

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  private readonly platformId = inject(PLATFORM_ID);
  readonly heroBg = HERO_PHOTOS[Math.floor(Math.random() * HERO_PHOTOS.length)];
  readonly particles = Array.from({ length: 20 }, (_, i) => i);

  scrollToInfo(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToCountdown(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.querySelector('app-countdown')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
