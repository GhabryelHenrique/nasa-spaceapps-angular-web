import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { DiscordAuthService } from '../services/discord-auth.service';
import { HeaderComponent } from './components/header/header.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { UberlandiaHighlightsComponent } from './components/uberlandia-highlights/uberlandia-highlights.component';
import { EventInfoTabsComponent } from './components/event-info-tabs/event-info-tabs.component';
import { SponsorsSectionComponent } from './components/sponsors-section/sponsors-section.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    HeaderComponent,
    HeroSectionComponent,
    UberlandiaHighlightsComponent,
    EventInfoTabsComponent,
    SponsorsSectionComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private discordAuth: DiscordAuthService
  ) {}

  loginWithDiscord(): void {
        window.open('https://discord.gg/FT4Jsvj5vy', '_blank');

  }
}
