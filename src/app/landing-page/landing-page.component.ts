import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  registerNow(): void {
    window.open('https://discord.gg/FT4Jsvj5vy', '_blank');
  }
}
