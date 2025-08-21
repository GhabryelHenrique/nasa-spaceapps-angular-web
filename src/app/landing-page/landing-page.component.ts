import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { UberlandiaHighlightsComponent } from './components/uberlandia-highlights/uberlandia-highlights.component';
import { EventInfoTabsComponent } from './components/event-info-tabs/event-info-tabs.component';
import { EventsMapComponent } from './components/events-map/events-map.component';
import { SponsorsSectionComponent } from './components/sponsors-section/sponsors-section.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    HeroSectionComponent,
    UberlandiaHighlightsComponent,
    EventInfoTabsComponent,
    EventsMapComponent,
    SponsorsSectionComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  organizers = [
    {
      name: 'Gabriel Chayb',
      role: 'Líder Local do Evento',
      description: 'Responsável pela liderança local e parcerias internacionais do evento.',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQEIZpOqoRO-Hg/profile-displayphoto-shrink_800_800/B4DZRtR4NXHcAc-/0/1737000191487?e=1758153600&v=beta&t=8hqwYUptzEOZ8l14cuiMZ3mjOx41C1ZiVzoxclvwNGY',
      url: 'https://www.instagram.com/gabrielchayb'
    },
    {
      name: 'Mariana Milena',
      role: 'Divulgação Científica',
      description: 'Divulgadora aeroespacial, palestrantes, mentores e principal rosto do evento.',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQFfrA4KuxAvSg/profile-displayphoto-crop_800_800/B4DZf2yGpmHkAI-/0/1752192019589?e=1758153600&v=beta&t=tTvFpM9yDl-z5gZAfFdAPWlq1D5wCDIO8-ld4LA2wRM',
      url: 'https://www.instagram.com/marimilenastudies'
    },
    {
      name: 'Ferdinando Kun',
      role: 'Uberhub & Inscrições',
      description: 'Gerencia inscrições, parceiros, comunidades e cronograma do evento.',
      photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhOwhaucwZtT5SK_XCPUWpESeD4gDH_yOw0g&s',
      url: 'https://www.instagram.com/ferdinandokun'

    },
    {
      name: 'Melissa Nobre',
      role: 'Comunicação & Redes Sociais',
      description: 'Comunicação, posicionamento, redes sociais e mídia digital e tradicional.',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQHSnq26V6HB5A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1711410916045?e=1758153600&v=beta&t=5k--Nr5ttnI1c0zxNtNEhDSztV6ydOez2DiTK5_vz_Y',
      url: 'https://www.instagram.com/melissa.nobre'
    },
    {
      name: 'Ghabryel',
      role: 'Tecnologia & Infraestrutura Digital',
      description: 'Discord, plataforma de matchmaking, landing page e streaming.',
      photo: 'assets/organizers/ghabryel.jpg',
      url: 'https://www.instagram.com/ghabryel.dev'
    },
    {
      name: 'Giulia Maronezzi',
      role: 'Marketing & Divulgação',
      description: 'Marketing, divulgação, parcerias e mídia digital e tradicional.',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQHM0b1GWL7w9g/profile-displayphoto-shrink_800_800/B4DZd7tT3XGUAc-/0/1750127166671?e=1758153600&v=beta&t=WRHFHWxVzjAttnHSEZYAGATOdfE3PjIczdzCsGZp6jI',
      url: 'https://www.instagram.com/giuliamaronezzi'
    },
    {
      name: 'Wellington Alexandre',
      role: 'Operacional & Segurança',
      description: 'Operacional do evento, facilitador, plantonista e relacionamento com inscritos.',
      photo: 'assets/organizers/image1.png',
      url: 'https://www.instagram.com/welington.alexandre02'
    },
    {
      name: 'Cris Izawa',
      role: 'Parceria MTI & Organização',
      description: 'Responsável pela parceria com o MTI e organização macro do evento.',
      photo: 'cris-izawa.jpg',
      url: 'https://www.instagram.com/mti.oficial'
    },
    {
      name: 'Thaynan Salviano',
      role: 'Secretaria da Juventude',
      description: 'Voluntários locais, infraestrutura, moderadores e inscritos.',
      photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLZbOP3cxgaqWnSg5C5iFOH_AHqmTlKTz3xw&s',
      url: 'https://www.instagram.com/thaynansalviano'
    },
    {
      name: 'Bia Neves',
      role: 'Secretaria de Inovação',
      description: 'Infraestrutura, parcerias, geração de oportunidades e apoiadores.',
      photo: 'assets/organizers/image.png',
      url: 'https://www.instagram.com/bia.neves'
    },
    {
      name: 'Eduarda',
      role: 'Iniciativa Meninas Tech',
      description: 'Promove a presença feminina no Space Apps em todos os aspectos.',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQE29YklVx-1UQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724866739948?e=1758153600&v=beta&t=CnHmdtE39j6yUGxpVPmABZM_1Raajceo7PjLHcBn1NQ',
      url: 'https://www.instagram.com/maismeninastech'
    },
  ];

  trackByName(index: number, organizer: any): string {
    return organizer.name;
  }

  registerNow(): void {
    window.open('https://discord.gg/FT4Jsvj5vy', '_blank');
  }
}
