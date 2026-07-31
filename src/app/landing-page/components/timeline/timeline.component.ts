import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Milestone {
  /** ISO date used to derive the milestone status */
  date: string;
  /** Optional end date for multi-day milestones (e.g. the hackathon) */
  endDate?: string;
  /** Short human label shown in the date badge */
  label: string;
  icon: string;
  title: string;
  description: string;
  /** Destaca o marco principal (o hackathon) */
  highlight?: boolean;
}

type MilestoneStatus = 'done' | 'live' | 'upcoming';

@Component({
  selector: 'app-timeline',
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
  readonly starsArray = Array.from({ length: 40 }, (_, i) => i);
  private readonly now = signal(new Date());

  readonly mainMilestones: Milestone[] = [
    {
      date: '2026-08-26T00:00:00-03:00',
      label: '26 de Agosto',
      icon: '📝',
      title: 'Abertura das Inscrições',
      description:
        'As inscrições para o maior hackathon do planeta são liberadas. Garanta seu lugar na missão!',
    },
    {
      date: '2026-09-17T00:00:00-03:00',
      label: '17 de Setembro',
      icon: '🤝',
      title: 'Resumos dos Desafios e Formação de Equipes',
      description:
        'Resumos dos desafios disponíveis e abertura para a formação de equipes. O Guia do Participante é liberado.',
    },
    {
      date: '2026-10-28T00:00:00-03:00',
      label: '28 de Outubro',
      icon: '📋',
      title: 'Declarações dos Desafios',
      description:
        'Divulgação oficial das Declarações dos Desafios (Challenge Statements) que guiarão os projetos.',
    },
    {
      date: '2026-11-02T00:00:00-03:00',
      label: '2 de Novembro',
      icon: '🌐',
      title: 'Abertura do Space Apps Connect',
      description:
        'Abertura do Space Apps Connect e lançamento do guia da plataforma para conectar participantes do mundo todo.',
    },
    {
      date: '2026-11-13T00:00:00-03:00',
      label: '13 de Novembro',
      icon: '🎁',
      title: 'Ofertas Globais Liberadas',
      description:
        'Guias de Submissão de Projetos, Julgamento e Premiação ficam disponíveis para todas as equipes.',
    },
    {
      date: '2026-11-14T00:00:00-03:00',
      endDate: '2026-11-15T23:59:59-03:00',
      label: '14 e 15 de Novembro',
      icon: '🏆',
      title: 'NASA Space Apps Challenge',
      description:
        'O grande evento! 48 horas para reunir sua equipe, inovar e resolver desafios reais da NASA. 👩‍🚀👨‍💻',
      highlight: true,
    },
  ];

  readonly postMilestones: Milestone[] = [
    {
      date: '2026-12-01T00:00:00-03:00',
      label: 'Dezembro de 2026',
      icon: '🌟',
      title: 'Indicados e Finalistas Globais',
      description:
        'Anúncio dos Indicados Globais (Global Nominees), Finalistas Globais e Menções Honrosas, avaliados por especialistas da NASA e agências parceiras.',
    },
    {
      date: '2027-01-01T00:00:00-03:00',
      label: 'Janeiro de 2027',
      icon: '🎉',
      title: 'Vencedores Globais',
      description:
        'O grande anúncio dos Vencedores Globais (Global Winners)! O ápice da jornada iniciada no hackathon. 🏆',
    },
  ];

  status(milestone: Milestone): MilestoneStatus {
    const now = this.now().getTime();
    const start = new Date(milestone.date).getTime();
    const end = milestone.endDate ? new Date(milestone.endDate).getTime() : start + 86_400_000;
    if (now >= start && now <= end) return 'live';
    return now > end ? 'done' : 'upcoming';
  }

  statusText(milestone: Milestone): string {
    switch (this.status(milestone)) {
      case 'done': return 'Concluído';
      case 'live': return 'Acontecendo agora';
      default: return 'Em breve';
    }
  }
}
