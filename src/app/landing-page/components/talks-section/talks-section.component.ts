import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TALKS, TALKS_PARTNER, Talk, talkCalendarUrl, talkStatus } from '../../../shared/data/talks.data';
import { PartnerLogoComponent } from '../../../shared/partner-logo/partner-logo.component';

interface TalkCard {
  talk: Talk;
  /** "10" e "nov" para o bloco de data, sempre no fuso de Brasília. */
  day: string;
  month: string;
  calendarUrl: string;
  /**
   * Detalhe do prêmio (o título já vai no selo) e as credenciais principais,
   * até duas no total; sem nada disso, cargo e organização.
   */
  headline: string;
}

/**
 * Chamada da semana de palestras na home.
 *
 * Mostra só o que ainda vai acontecer — palestra encerrada sai da home e fica
 * registrada em `/palestras`. Sem palestras pela frente, a seção some.
 */
@Component({
  selector: 'app-talks-section',
  imports: [RouterLink, PartnerLogoComponent],
  templateUrl: './talks-section.component.html',
  styleUrl: './talks-section.component.scss',
})
export class TalksSectionComponent {
  readonly partner = TALKS_PARTNER;

  readonly cards: TalkCard[] = TALKS
    .filter(talk => talkStatus(talk) !== 'done')
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map(talk => ({
      talk,
      ...this.dateParts(talk),
      calendarUrl: talkCalendarUrl(talk),
      headline: this.headline(talk),
    }));

  private headline(talk: Talk): string {
    const { speaker } = talk;
    const highlights = [
      ...(speaker.award?.detail ? [speaker.award.detail] : []),
      ...speaker.credentials,
    ].slice(0, 2);

    return highlights.length > 0
      ? highlights.join(' · ')
      : `${speaker.role} · ${speaker.organization}`;
  }

  private dateParts(talk: Talk): { day: string; month: string } {
    const date = new Date(talk.startsAt);
    const format = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat('pt-BR', { ...options, timeZone: 'America/Sao_Paulo' }).format(date);

    return {
      day: format({ day: '2-digit' }),
      month: format({ month: 'short' }).replace('.', ''),
    };
  }
}
