import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DiscordAuthService } from '../../../services/discord-auth.service';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private discordAuth: DiscordAuthService
  ) {}

  loginWithDiscord(): void {
    this.discordAuth.loginWithDiscord();
  }

  scrollToInfo(): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById('info');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
