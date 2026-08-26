import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MENTOR_FORM_URL, REGISTRATION_URL } from '../../../shared/data/registration.data';

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
  /** Link externo do marco, quando já existe algo para fazer agora */
  action?: { label: string; url: string };
}

type MilestoneStatus = 'done' | 'live' | 'upcoming';

@Component({
  selector: 'app-timeline',
  imports: [CommonModule, RouterLink],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
  readonly starsArray = Array.from({ length: 40 }, (_, i) => i);
  private readonly now = signal(new Date());
  readonly registrationUrl = REGISTRATION_URL;
  readonly mentorFormUrl = MENTOR_FORM_URL;

  readonly mainMilestones: Milestone[] = [
    {
      date: '2026-08-26T00:00:00-03:00',
      label: '26 de Agosto',
      icon: 'ph ph-note-pencil',
      title: 'Abertura das Inscrições',
      description:
        'As inscrições para o maior hackathon do planeta são liberadas. Garanta seu lugar na missão!',
      action: {
        label: 'Inscrever-se no site da NASA',
        url: REGISTRATION_URL,
      },
    },
    {
      date: '2026-09-17T00:00:00-03:00',
      label: '17 de Setembro',
      icon: 'ph ph-handshake',
      title: 'Resumos dos Desafios e Formação de Equipes',
      description:
        'Resumos dos desafios disponíveis e abertura para a formação de equipes. O Guia do Participante é liberado.',
    },
    {
      date: '2026-10-28T00:00:00-03:00',
      label: '28 de Outubro',
      icon: 'ph ph-clipboard-text',
      title: 'Declarações dos Desafios',
      description:
        'Divulgação oficial das Declarações dos Desafios (Challenge Statements) que guiarão os projetos.',
    },
    {
      date: '2026-11-02T00:00:00-03:00',
      label: '2 de Novembro',
      icon: 'ph ph-globe-hemisphere-west',
      title: 'Abertura do Space Apps Connect',
      description:
        'Abertura do Space Apps Connect e lançamento do guia da plataforma para conectar participantes do mundo todo.',
    },
    {
      date: '2026-11-13T00:00:00-03:00',
      label: '13 de Novembro',
      icon: 'ph ph-gift',
      title: 'Ofertas Globais Liberadas',
      description:
        'Guias de Submissão de Projetos, Julgamento e Premiação ficam disponíveis para todas as equipes.',
    },
    {
      date: '2026-11-14T00:00:00-03:00',
      endDate: '2026-11-15T23:59:59-03:00',
      label: '14 e 15 de Novembro',
      icon: 'ph ph-trophy',
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
      icon: 'ph ph-star',
      title: 'Indicados e Finalistas Globais',
      description:
        'Anúncio dos Indicados Globais (Global Nominees), Finalistas Globais e Menções Honrosas, avaliados por especialistas da NASA e agências parceiras.',
    },
    {
      date: '2027-01-01T00:00:00-03:00',
      label: 'Janeiro de 2027',
      icon: 'ph ph-confetti',
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
