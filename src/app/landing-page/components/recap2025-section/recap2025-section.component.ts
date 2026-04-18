import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface StatCard {
  value: number;
  displayValue: string;
  prefix: string;
  suffix: string;
  label: string;
  icon: string;
  color: string;
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
  color: string;
}

const   HERO_PHOTOS = [
      'assets/photos/IMG_0684.png',
      'assets/photos/IMG_0619.png',
      'assets/photos/IMG_0685.png',
      'assets/photos/IMG_0686.png',
      'assets/photos/IMG_0626.png',
  ]

@Component({
  selector: 'app-recap2025-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recap2025-section.component.html',
  styleUrl: './recap2025-section.component.scss',
})
export class Recap2025SectionComponent implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private animationTimers: ReturnType<typeof setInterval>[] = [];
  animationStarted = false;

  readonly imgTimeline = HERO_PHOTOS[Math.floor(Math.random() * HERO_PHOTOS.length)];


  stats: StatCard[] = [
    { value: 1400, displayValue: '1400', prefix: '', suffix: '+', label: 'Participantes em Uberlândia', icon: '👥', color: '#EAFE07', animatedValue: 0 },
    { value: 160, displayValue: '160', prefix: '', suffix: '+', label: 'Equipes inscritas', icon: '🧑‍🚀', color: '#0960E1', animatedValue: 0 },
    { value: 100, displayValue: '100', prefix: '', suffix: '+', label: 'Projetos submetidos', icon: '📡', color: '#2E96F5', animatedValue: 0 },
    { value: 1, displayValue: '1', prefix: '#', suffix: '', label: 'Maior sede do Hemisfério Ocidental', icon: '🌎', color: '#FFD700', animatedValue: 0 },
    { value: 10, displayValue: '10', prefix: '', suffix: '', label: 'Global Nominees de Uberlândia', icon: '🌍', color: '#FFD700', animatedValue: 0 },
    // { value: 1, displayValue: '1', prefix: '', suffix: '', label: 'Global Finalist — Time Titan', icon: '🏆', color: '#FFD700', animatedValue: 0 },
    // { value: 1, displayValue: '1', prefix: '', suffix: '', label: 'Honorable Mention — Finstream', icon: '🌟', color: '#4ECDC4', animatedValue: 0 },
    { value: 48, displayValue: '48', prefix: '', suffix: 'h', label: 'De hackathon intenso e criativo', icon: '⏱️', color: '#0960E1', animatedValue: 0 },
    // { value: 4, displayValue: '4', prefix: '', suffix: '', label: 'Prêmios Especiais entregues', icon: '🎖️', color: '#E43700', animatedValue: 0 },
    // { value: 20, displayValue: '20', prefix: '+', suffix: '', label: 'Desafios da NASA disponíveis', icon: '🚀', color: '#E43700', animatedValue: 0 },
    { value: 200, displayValue: '200', prefix: '+', suffix: '', label: 'Latas de RedBull Distribuidas', icon: '💪', color: '#E43700', animatedValue: 0 },
    { value: 30, displayValue: '30', prefix: '+', suffix: '', label: 'Patrocinadores e apoiadores', icon: '🤝', color: '#EAFE07', animatedValue: 0 },
  ];

  timeline: TimelineItem[] = [
    {
      date: 'Out 4–5, 2025',
      title: '48 Horas de Inovação',
      description: 'Centenas de participantes reunidos em Uberlândia para o maior hackathon espacial do mundo. 160+ equipes, 48h não-stop de criatividade e tecnologia.',
      icon: '🚀',
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
      icon: '🌍',
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
      icon: '🏆',
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
      icon: '🎉',
      highlight: false,
      photos: [
        'assets/photos/FCBDAA57-7068-4DD8-802B-94799056AF42.jpg',
        'assets/photos/223BDAFA-6947-49DE-970A-9CACE868B6FB.jpg',
        'assets/photos/DFD4D581-DF1D-4D1C-9E28-0A89C30AC8EA.jpg',
      ],
    },
  ];

  achievements: Achievement[] = [
    { icon: '🌎', title: 'Maior Cidade do Ocidente', subtitle: 'Maior sede do hemisfério ocidental no NASA Space Apps 2025', color: '#FFD700' },
    { icon: '🤖', title: 'Capital da IA no Brasil', subtitle: 'Polo de inovação em Inteligência Artificial No Brasil', color: '#2E96F5' },
    { icon: '🥇', title: 'Titan — Global Finalist', subtitle: 'Top 45 do mundo no NASA Space Apps Challenge 2025', color: '#FFD700' },
    { icon: '🌟', title: 'Finstream — Honorable Mention', subtitle: 'Reconhecimento global entre milhares de projetos', color: '#4ECDC4' },
    { icon: '🚂', title: 'Trem de IA', subtitle: 'Melhor Nome do Ano — o mais criativo do evento', color: '#E43700' },
    { icon: '🌍', title: '10 Global Nominees', subtitle: 'Uberlândia com 10 times entre os melhores do planeta', color: '#0960E1' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.animationTimers.forEach(clearInterval);
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animationStarted) {
            this.animationStarted = true;
            this.startCounterAnimations();
          }
        });
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector('.recap2025-section');
    if (section) {
      this.observer.observe(section);
    }
  }

  private startCounterAnimations(): void {
    this.stats.forEach((stat, index) => {
      const duration = 1800;
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;
      let step = 0;

      const delay = index * 100;

      setTimeout(() => {
        const timer = setInterval(() => {
          step++;
          current = Math.min(Math.round(increment * step), stat.value);
          stat.animatedValue = current;

          if (current >= stat.value) {
            clearInterval(timer);
          }
        }, duration / steps);

        this.animationTimers.push(timer);
      }, delay);
    });
  }

  openDiscord(): void {
    window.open('https://discord.gg/FT4Jsvj5vy', '_blank');
  }
}
