import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Challenge, CHALLENGES_DATA } from '../shared/data/challenges.data';
import { DISCORD_URL, SPEAKER_FORM_URL, WHATSAPP_URL } from '../shared/data/registration.data';
import {
  Speaker,
  TALKS,
  TALKS_PARTNER,
  Talk,
  TalkStatus,
  isInternationalTalk,
  talkCalendarUrl,
  talkStatus,
} from '../shared/data/talks.data';
import { ChallengeDetailModalComponent } from '../shared/challenge-detail-modal/challenge-detail-modal.component';
import { ChallengeShareModalComponent } from '../shared/challenge-share/challenge-share-modal.component';
import { PartnerLogoComponent } from '../shared/partner-logo/partner-logo.component';

interface ScheduleDay {
  label: string;
  talks: Talk[];
}

/**
 * Semana de palestras (`/palestras`) — programação, palestrantes e a parceria
 * com o GDG. Tudo vem de `TALKS`; esta página só agrupa por dia.
 */
@Component({
  selector: 'app-talks',
  imports: [RouterLink, ChallengeDetailModalComponent, ChallengeShareModalComponent, PartnerLogoComponent],
  templateUrl: './talks.component.html',
  styleUrl: './talks.component.scss',
})
export class TalksComponent {
  readonly partner = TALKS_PARTNER;
  readonly talks = TALKS;
  readonly whatsappUrl = WHATSAPP_URL;
  readonly discordUrl = DISCORD_URL;
  readonly speakerFormUrl = SPEAKER_FORM_URL;

  readonly schedule: ScheduleDay[] = this.groupByDay(TALKS);
  readonly dayLabels = this.schedule.map(day => day.label);

  /** Origem da primeira palestra internacional, para o selo do hero. */
  readonly internationalOrigin = TALKS.find(isInternationalTalk)?.speaker.origin;

  /**
   * Na ordem da programação. Uma pessoa pode dar mais de uma palestra — aparece
   * uma vez só na seção de palestrantes.
   */
  readonly speakers: Speaker[] = [
    ...new Map(this.schedule.flatMap(day => day.talks).map(talk => [talk.speaker.name, talk.speaker])).values(),
  ];

  /** Desafio aberto no modal de detalhes; `null` com o modal fechado. */
  readonly selectedChallenge = signal<Challenge | null>(null);

  /** Desafio aberto na exportação para o Instagram; `null` com o modal fechado. */
  readonly sharedChallenge = signal<Challenge | null>(null);

  status(talk: Talk): TalkStatus {
    return talkStatus(talk);
  }

  statusText(talk: Talk): string {
    switch (this.status(talk)) {
      case 'done': return 'Encerrada';
      case 'live': return 'Acontecendo agora';
      default: return 'Em breve';
    }
  }

  calendarUrl(talk: Talk): string {
    return talkCalendarUrl(talk);
  }

  isInternational(talk: Talk): boolean {
    return isInternationalTalk(talk);
  }

  /** "Cargo · Organização · Cidade", pulando o que não foi informado. */
  speakerLine(speaker: Speaker): string {
    return [speaker.role, speaker.organization, speaker.city].filter(Boolean).join(' · ');
  }

  relatedChallenges(talk: Talk): Challenge[] {
    return CHALLENGES_DATA.filter(challenge => talk.challengeSlugs.includes(challenge.slug));
  }

  openChallenge(challenge: Challenge): void {
    this.selectedChallenge.set(challenge);
  }

  closeChallenge(): void {
    this.selectedChallenge.set(null);
  }

  /** Abre a exportação do card, fechando o detalhe para não empilhar dois diálogos. */
  openShare(challenge: Challenge): void {
    this.selectedChallenge.set(null);
    this.sharedChallenge.set(challenge);
  }

  closeShare(): void {
    this.sharedChallenge.set(null);
  }

  private groupByDay(talks: Talk[]): ScheduleDay[] {
    const sorted = [...talks].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    const days: ScheduleDay[] = [];

    for (const talk of sorted) {
      const day = days.find(d => d.label === talk.dayLabel);
      if (day) {
        day.talks.push(talk);
      } else {
        days.push({ label: talk.dayLabel, talks: [talk] });
      }
    }

    return days;
  }
}
