import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { UberlandiaHighlightsComponent } from './components/uberlandia-highlights/uberlandia-highlights.component';
import { EventInfoTabsComponent } from './components/event-info-tabs/event-info-tabs.component';
import { EventsMapComponent } from './components/events-map/events-map.component';
import { SponsorsSectionComponent } from './components/sponsors-section/sponsors-section.component';
import { TeamsService } from '../services/teams.service';

@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    RouterModule,
    HeroSectionComponent,
    UberlandiaHighlightsComponent,
    EventInfoTabsComponent,
    EventsMapComponent,
    SponsorsSectionComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, OnDestroy {
  totalTeams = 0;
  totalMembers = 0;

  // Countdown properties
  eventDate = new Date('2025-10-21T18:59:59-03:00'); // Global Nominees announcement: October 16th, 2025 23:59:59 in Brazil timezone
  countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  countdownInterval: any;

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void {
    this.loadTeamsStats();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private loadTeamsStats(): void {
    this.teamsService.getTeams(100).subscribe({
      next: (response) => {
        if (response.data && response.data[0] && response.data[0].teams) {
          const teamsData = response.data[0].teams;
          this.totalTeams = teamsData.totalCount;

          let memberCount = 0;
          teamsData.edges.forEach(edge => {
            if (edge.node.memberships) {
              memberCount += edge.node.memberships.length;
            }
          });
          this.totalMembers = memberCount;
        }
      },
      error: (error) => {
        console.error('Error loading teams stats:', error);
        this.totalTeams = 0;
        this.totalMembers = 0;
      }
    });
  }

  organizers = [
    {
      name: 'Gabriel Chayb',
      role: 'Líder Local do Evento',
      description: 'Responsável pela liderança local e parcerias internacionais do evento.',
      photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa7icwJZ8DbVnWhDizOLtf2HWhMdR1V0LI5g&s',
      url: 'https://www.instagram.com/gabrielchayb'
    },
    {
      name: 'Mariana Milena',
      role: 'Divulgação Científica',
      description: 'Divulgadora aeroespacial, palestrantes, mentores e principal rosto do evento.',
      photo: 'assets/organizers/mari.jpeg',
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
      name: 'Giulia Maronezzi',
      role: 'Marketing & Divulgação',
      description: 'Marketing, divulgação, parcerias e mídia digital e tradicional.',
      photo: 'assets/organizers/giulia.jpg',
      url: 'https://www.instagram.com/giuliamaronezzi'
    },
    {
      name: 'Ghabryel',
      role: 'Tecnologia & Infraestrutura Digital',
      description: 'Discord, plataforma de matchmaking, landing page e streaming.',
      photo: 'assets/organizers/ghabryel.jpg',
      url: 'https://www.instagram.com/ghabryel.dev'
    },
    {
      name: 'Antônio Augusto Norato',
      role: 'Juridico',
      description: 'Responsável pela advocacia e jurisprudência do evento.',
      photo: 'assets/organizers/antonio.jpg',
      url: 'https://www.instagram.com/ghabryel.dev'
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
      photo: 'assets/organizers/cris.png',
      url: 'https://www.instagram.com/mti.oficial'
    },
    {
      name: 'Melissa Nobre',
      role: 'Comunicação & Redes Sociais',
      description: 'Comunicação, posicionamento, redes sociais e mídia digital e tradicional.',
      photo: 'assets/organizers/melissa.jpg',
      url: 'https://www.instagram.com/melissa.nobre'
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
    }
  ];

  trackByName(index: number, organizer: any): string {
    return organizer.name;
  }

  registerNow(): void {
    window.open('https://discord.gg/FT4Jsvj5vy', '_blank');
  }

  private startCountdown(): void {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const eventTime = this.eventDate.getTime();
    const difference = eventTime - now;

    if (difference > 0) {
      this.countdown.days = Math.floor(difference / (1000 * 60 * 60 * 24));
      this.countdown.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.countdown.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      this.countdown.seconds = Math.floor((difference % (1000 * 60)) / 1000);
    } else {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }
}
