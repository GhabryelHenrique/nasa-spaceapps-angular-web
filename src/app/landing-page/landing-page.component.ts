import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { EventInfoTabsComponent } from './components/event-info-tabs/event-info-tabs.component';
import { Recap2025SectionComponent } from './components/recap2025-section/recap2025-section.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TeamsService } from '../services/teams.service';
import { Team } from '../shared/data/teams.data';

@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    RouterModule,
    HeroSectionComponent,
    EventInfoTabsComponent,
    Recap2025SectionComponent,
    CountdownComponent,
    TimelineComponent,
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
  globalNomineesTeams = signal<Team[]>([]);

  // Times Vencedores Destacados
  highlightedWinners = [
    {
      team: 'Titan',
      achievement: 'Global Finalist',
      badge: '🏆',
      color: '#FFD700', // Gold
      description: 'Classificado entre os 45 melhores projetos do mundo no NASA Space Apps Challenge 2025',
      imagePath: 'assets/winners/titan/image.png',
      members: [
        { name: 'Alan Gabriel', photo: 'assets/winners/titan/alan.jpg', url: 'https://www.linkedin.com/in/alangalonso/' },
        { name: 'Camilo Barreto', photo: 'assets/winners/titan/camilo.png', url: 'https://pixr.studio/' },
        { name: 'João Paulo',   photo: 'assets/winners/titan/joao.png', url: 'https://www.instagram.com/titan.nasa' },
        { name: 'Luiz Fellipe', photo: 'assets/winners/titan/luiz-Fellipe.jpg', url: 'https://www.linkedin.com/in/luiz-fellipe-nun24b0752ba/' },
        { name: 'Raul Fernandes', photo: 'assets/winners/titan/Raul2.jpg', url: 'https://www.linkedin.com/in/raul-fernandes-138a631a7' },
        { name: 'Samuel Santos', photo: 'assets/winners/titan/samuel-photo.jpg', url: 'https://www.linkedin.com/in/samuel-santos' },
      ],
      challengeUrl: '#',
      isTopWinner: true
    },
    {
      team: 'Finstream',
      achievement: 'Honorable Mention',
      badge: '🌟',
      color: '#4ECDC4', // Cyan
      description: 'Reconhecido com Menção Honrosa entre milhares de projetos globais no NASA Space Apps Challenge 2025',
      imagePath: 'assets/winners/finstream/time.jpeg',
      members: [
        { name: 'Leandro Marques', photo: 'assets/winners/finstream/leandro.jpg', url: 'https://www.instagram.com/leandro_marques_g/' },
        { name: 'Lucas Panonko', photo: 'assets/winners/finstream/lucas.jpg', url: 'https://www.instagram.com/luksbell/' },
        { name: 'Lucas Lara', photo: 'assets/winners/finstream/LucasLara.jpg', url: 'https://www.instagram.com/lucas.lc_?igsh=eXE4eHA3eWY3am5y' },
        { name: 'Mauricio Cesar', photo: 'assets/winners/finstream/MauricioAndreata.jpg', url: 'https://www.instagram.com/lucas.lc_?igsh=eXE4eHA3eWY3am5y' },
        { name: 'João Vitor', photo: 'assets/winners/finstream/gabriel.jpg', url: 'https://www.instagram.com/lucas.lc_?igsh=eXE4eHA3eWY3am5y' },

      ],
      challengeUrl: '#',
      isTopWinner: false
    }
  ];

  // Prêmios Especiais
  specialAwards = [
    {
      category: 'Melhor nome do ano',
      winner: 'Trem de IA',
      icon: '🚂',
      imagePath: 'assets/images/melhor-nome-do-ano-trem-de-ia.png',
      url: 'https://www.spaceappschallenge.org/2025/find-a-team/trem-de-ia/',
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

  private readonly teamsService = inject(TeamsService);

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
          console.log('Total Teams:', allTeams);

          this.globalNomineesTeams.set(allTeams.filter(
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
              team.title.toLowerCase().includes('Extraplant'.toLowerCase()) ||
              team.title.toLowerCase().includes('Code and cheese'.toLowerCase())
          ));

          console.log(this.globalNomineesTeams);

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
