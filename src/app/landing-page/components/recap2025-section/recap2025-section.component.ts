import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  value: number;
  displayValue: string;
  prefix: string;
  suffix: string;
  label: string;
  icon: string;
  animatedValue: number;
}

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  icon: string;
  highlight: boolean;
  photos?: string[];
}

interface Achievement {
  icon: string;
  title: string;
  subtitle: string;
}

const HERO_PHOTOS = [
  'assets/photos/IMG_0684.png',
  'assets/photos/IMG_0619.png',
  'assets/photos/IMG_0685.png',
  'assets/photos/IMG_0686.png',
  'assets/photos/IMG_0626.png',
];

@Component({
  selector: 'app-recap2025-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recap2025-section.component.html',
  styleUrl: './recap2025-section.component.scss',
})
export class Recap2025SectionComponent {
  showLightbox = signal(false);

  openLightbox(): void {
    this.showLightbox.set(true);
  }

  closeLightbox(): void {
    this.showLightbox.set(false);
  }

  readonly imgTimeline = HERO_PHOTOS[Math.floor(Math.random() * HERO_PHOTOS.length)];

  stats: StatCard[] = [
    { value: 1400, displayValue: '1400', prefix: '', suffix: '+', label: 'Participantes em Uberlândia', icon: 'ph ph-users-three', animatedValue: 0 },
    { value: 160, displayValue: '160', prefix: '', suffix: '+', label: 'Equipes inscritas', icon: 'ph ph-user-focus', animatedValue: 0 },
    { value: 100, displayValue: '100', prefix: '', suffix: '+', label: 'Projetos submetidos', icon: 'ph ph-broadcast', animatedValue: 0 },
    { value: 1, displayValue: '1', prefix: '#', suffix: '', label: 'Maior sede do Hemisfério Ocidental', icon: 'ph ph-globe-hemisphere-west', animatedValue: 0 },
    { value: 10, displayValue: '10', prefix: '', suffix: '', label: 'Global Nominees de Uberlândia', icon: 'ph ph-globe', animatedValue: 0 },
    { value: 48, displayValue: '48', prefix: '', suffix: 'h', label: 'De hackathon intenso e criativo', icon: 'ph ph-timer', animatedValue: 0 },
    { value: 200, displayValue: '600', prefix: '+', suffix: '', label: 'Latas de RedBull Distribuidas', icon: 'ph ph-lightning', animatedValue: 0 },
    { value: 30, displayValue: '30', prefix: '+', suffix: '', label: 'Patrocinadores e apoiadores', icon: 'ph ph-handshake', animatedValue: 0 },
  ];

  timeline: TimelineItem[] = [
    {
      date: 'Out 4–5, 2025',
      title: '48 Horas de Inovação',
      description: 'Centenas de participantes reunidos em Uberlândia para o maior hackathon espacial do mundo. 160+ equipes, 48h não-stop de criatividade e tecnologia.',
      icon: 'ph ph-rocket-launch',
      highlight: false,
      photos: [
        'assets/photos/IMG_0383.JPG',
        'assets/photos/IMG_0488.JPG',
        'assets/photos/IMG_0498.JPG',
      ],
    },
    {
      date: 'Out 16, 2025',
      title: '10 Global Nominees!',
      description: 'Uberlândia colocou 10 times entre os melhores do planeta — um marco histórico para a cidade e para o Brasil.',
      icon: 'ph ph-globe',
      highlight: true,
      photos: [
        'assets/photos/IMG_0508.JPG',
        'assets/photos/IMG_0518.JPG',
      ],
    },
    {
      date: 'Nov 26, 2025',
      title: 'Titan & Finstream Globais',
      description: 'Titan conquistou o título de Global Finalist (Top 45 do mundo). Finstream recebeu Honorable Mention entre milhares de projetos globais.',
      icon: 'ph ph-trophy',
      highlight: true,
      photos: [
        'assets/photos/IMG_0532.JPG',
        'assets/photos/17EF31F0-571D-4070-991B-F52444EE835B.jpg',
      ],
    },
    {
      date: 'Dez 18, 2025',
      title: 'Celebração dos Campeões',
      description: 'Uberlândia encerrou 2025 como uma das cidades mais representativas do evento no mundo inteiro.',
      icon: 'ph ph-confetti',
      highlight: false,
      photos: [
        'assets/photos/FCBDAA57-7068-4DD8-802B-94799056AF42.jpg',
        'assets/photos/223BDAFA-6947-49DE-970A-9CACE868B6FB.jpg',
        'assets/photos/DFD4D581-DF1D-4D1C-9E28-0A89C30AC8EA.jpg',
      ],
    },
  ];

  achievements: Achievement[] = [
    { icon: 'ph ph-globe-hemisphere-west', title: 'Maior Cidade do Ocidente', subtitle: 'Maior sede do hemisfério ocidental no NASA Space Apps 2025' },
    { icon: 'ph ph-robot', title: 'Capital da IA no Brasil', subtitle: 'Polo de inovação em Inteligência Artificial No Brasil' },
    { icon: 'ph ph-medal', title: 'Titan — Global Finalist', subtitle: 'Top 45 do mundo no NASA Space Apps Challenge 2025' },
    { icon: 'ph ph-star', title: 'Finstream — Honorable Mention', subtitle: 'Reconhecimento global entre milhares de projetos' },
    { icon: 'ph ph-train', title: 'Trem de IA', subtitle: 'Melhor Nome do Ano — o mais criativo do evento' },
    { icon: 'ph ph-globe', title: '10 Global Nominees', subtitle: 'Uberlândia com 10 times entre os melhores do planeta' },
  ];

  openDiscord(): void {
    window.open('https://discord.gg/FT4Jsvj5vy', '_blank');
  }
}
