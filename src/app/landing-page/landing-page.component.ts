import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { UberlandiaHighlightsComponent } from './components/uberlandia-highlights/uberlandia-highlights.component';
import { EventInfoTabsComponent } from './components/event-info-tabs/event-info-tabs.component';
import { EventsMapComponent } from './components/events-map/events-map.component';
import { SponsorsSectionComponent } from './components/sponsors-section/sponsors-section.component';
import { TeamsService } from '../services/teams.service';
import { Team } from '../shared/data/teams.data';

@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    RouterModule,
    HeroSectionComponent,
    UberlandiaHighlightsComponent,
    EventInfoTabsComponent,
    EventsMapComponent,
    SponsorsSectionComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  totalTeams = 0;
  totalMembers = 0;

  // Global Nominees 2025 - Nomes dos times vencedores
  globalNomineesNames = [
    'Titan',
    'Finstream',
    'Gauss n roses',
    'Orbital token market',
    'Asteroid watchers',
    'Cosmos explorers',
    'Diário de ideia espacial',
    'Guardians of the city',
    'Extraplant',
  ];

  // Times vencedores com dados completos da API
  globalNomineesTeams: Team[] = [];

  // Prêmios Especiais
  specialAwards = [
    {
      category: 'Melhor nome do ano',
      winner: 'Trem de IA',
      icon: '🚂',
      imagePath: 'assets/awards/melhor-nome-do-ano-trem-de-ia.jpg',
      url: '#',
      description: 'Pelo nome mais criativo e divertido do evento'
    },
    {
      category: 'Melhor mentora do ano',
      winner: 'Pamela Mendes',
      icon: '👩‍🏫',
      imagePath: 'assets/images/melhor-mentora-do-ano-pamela-dev.jpg',
      url: 'https://www.instagram.com/pam.dev/',
      description: 'Pela dedicação excepcional em orientar os participantes'
    },
    {
      category: 'Melhor voluntário do ano',
      winner: 'Júlia Pettersen',
      icon: '🌟',
      imagePath: 'assets/images/melhor-voluntario-do-ano-julia-pettersen.png',
      url: 'https://www.instagram.com/julia.pettersen',
      description: 'Pelo comprometimento e apoio durante todo o evento'
    },
    {
      category: 'Melhor juíza do ano',
      winner: 'Júlia Guidolim',
      icon: '⚖️',
      imagePath: 'assets/images/melhor-juiza-do-ano-julia-guidolim.jpeg',
      url: 'https://www.linkedin.com/in/julia-guidolim',
      description: 'Pela avaliação criteriosa e imparcial dos projetos'
    },
  ];

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void {
    this.loadTeamsStats();
  }

  private loadTeamsStats(): void {
    this.teamsService.getTeams(100).subscribe({
      next: (response) => {
        if (response.data && response.data[0] && response.data[0].teams) {
          const teamsData = response.data[0].teams;
          this.totalTeams = teamsData.totalCount;

          let memberCount = 0;
          const allTeams: Team[] = [];

          teamsData.edges.forEach((edge) => {
            allTeams.push(edge.node);
            if (edge.node.memberships) {
              memberCount += edge.node.memberships.length;
            }
          });

          this.totalMembers = memberCount;

          console.log(allTeams);
          // Filtrar os times vencedores (Global Nominees)
          this.globalNomineesTeams = allTeams.filter(
            (team) =>
              team.title.toLowerCase().includes('Titan'.toLowerCase()) ||
              team.title.toLowerCase().includes('Finstream'.toLowerCase()) ||
              team.title
                .toLowerCase()
                .includes('Gauss'.toLowerCase()) ||
              team.title
                .toLowerCase()
                .includes('Orbital token market'.toLowerCase()) ||
              team.title
                .toLowerCase()
                .includes('Asteroid watchers'.toLowerCase()) ||
              team.title
                .toLowerCase()
                .includes('Cosmos explorers'.toLowerCase()) ||
              team.title
                .toLowerCase()
                .includes('Diário de ideias espacial'.toLowerCase()) ||
              team.title
                .toLowerCase()
                .includes('Guardians of the city'.toLowerCase()) ||
              team.title.toLowerCase().includes('Extraplant'.toLowerCase())
          );

          console.log('Global Nominees encontrados:', this.globalNomineesTeams);
        }
      },
      error: (error) => {
        console.error('Error loading teams stats:', error);
        this.totalTeams = 0;
        this.totalMembers = 0;
      },
    });
  }

  organizers = [
    {
      name: 'Gabriel Chayb',
      role: 'Líder Local do Evento',
      description:
        'Responsável pela liderança local e parcerias internacionais do evento.',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa7icwJZ8DbVnWhDizOLtf2HWhMdR1V0LI5g&s',
      url: 'https://www.instagram.com/gabrielchayb',
    },
    {
      name: 'Mariana Milena',
      role: 'Divulgação Científica',
      description:
        'Divulgadora aeroespacial, palestrantes, mentores e principal rosto do evento.',
      photo: 'assets/organizers/mari.jpeg',
      url: 'https://www.instagram.com/marimilenastudies',
    },
    {
      name: 'Ferdinando Kun',
      role: 'Uberhub & Inscrições',
      description:
        'Gerencia inscrições, parceiros, comunidades e cronograma do evento.',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhOwhaucwZtT5SK_XCPUWpESeD4gDH_yOw0g&s',
      url: 'https://www.instagram.com/ferdinandokun',
    },
    {
      name: 'Giulia Maronezzi',
      role: 'Marketing & Divulgação',
      description:
        'Marketing, divulgação, parcerias e mídia digital e tradicional.',
      photo: 'assets/organizers/giulia.jpg',
      url: 'https://www.instagram.com/giuliamaronezzi',
    },
    {
      name: 'Ghabryel',
      role: 'Tecnologia & Infraestrutura Digital',
      description:
        'Discord, plataforma de matchmaking, landing page e streaming.',
      photo: 'assets/organizers/ghabryel.jpg',
      url: 'https://www.instagram.com/ghabryel.dev',
    },
    {
      name: 'Antônio Augusto Norato',
      role: 'Juridico',
      description: 'Responsável pela advocacia e jurisprudência do evento.',
      photo: 'assets/organizers/antonio.jpg',
      url: 'https://www.instagram.com/ghabryel.dev',
    },
    {
      name: 'Wellington Alexandre',
      role: 'Operacional & Segurança',
      description:
        'Operacional do evento, facilitador, plantonista e relacionamento com inscritos.',
      photo: 'assets/organizers/image1.png',
      url: 'https://www.instagram.com/welington.alexandre02',
    },
    {
      name: 'Cris Izawa',
      role: 'Parceria MTI & Organização',
      description:
        'Responsável pela parceria com o MTI e organização macro do evento.',
      photo: 'assets/organizers/cris.png',
      url: 'https://www.instagram.com/mti.oficial',
    },
    {
      name: 'Melissa Nobre',
      role: 'Comunicação & Redes Sociais',
      description:
        'Comunicação, posicionamento, redes sociais e mídia digital e tradicional.',
      photo: 'assets/organizers/melissa.jpg',
      url: 'https://www.instagram.com/melissa.nobre',
    },
    {
      name: 'Thaynan Salviano',
      role: 'Secretaria da Juventude',
      description:
        'Voluntários locais, infraestrutura, moderadores e inscritos.',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLZbOP3cxgaqWnSg5C5iFOH_AHqmTlKTz3xw&s',
      url: 'https://www.instagram.com/thaynansalviano',
    },
    {
      name: 'Bia Neves',
      role: 'Secretaria de Inovação',
      description:
        'Infraestrutura, parcerias, geração de oportunidades e apoiadores.',
      photo: 'assets/organizers/image.png',
      url: 'https://www.instagram.com/bia.neves',
    },
  ];

  trackByName(index: number, organizer: any): string {
    return organizer.name;
  }

  registerNow(): void {
    window.open('https://discord.gg/FT4Jsvj5vy', '_blank');
  }
}
