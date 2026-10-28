import { Component, HostListener, computed, input, output } from '@angular/core';
import {
  Challenge,
  CURRENT_CHALLENGE_YEAR,
  StatementSectionId,
  challengeDetailUrl,
  statementSections
} from '../data/challenges.data';

/**
 * Modal com o detalhamento de um desafio: resumo e, quando a NASA já publicou,
 * o enunciado completo traduzido (contexto, objetivos e considerações).
 */
@Component({
  selector: 'app-challenge-detail-modal',
  imports: [],
  templateUrl: './challenge-detail-modal.component.html',
  styleUrl: './challenge-detail-modal.component.scss'
})
export class ChallengeDetailModalComponent {
  readonly challenge = input.required<Challenge>();
  readonly year = input<number>(CURRENT_CHALLENGE_YEAR);
  /** Edições passadas não mostram o aviso de prazos nem o rótulo de tema atual. */
  readonly isCurrentEdition = input<boolean>(true);
  readonly closed = output<void>();
  /** Pedido de exportação do card para o Instagram — quem abre o modal é que decide o que fazer. */
  readonly share = output<void>();

  readonly nasaUrl = computed(() => challengeDetailUrl(this.year(), this.challenge().slug));

  readonly sections = computed(() => {
    const statement = this.challenge().statement;
    return statement ? statementSections(statement) : [];
  });

  /** Atalhos do topo do enunciado: rola o modal até a seção, sem mexer na URL. */
  scrollTo(id: StatementSectionId): void {
    document.getElementById(this.sectionAnchor(id))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  sectionAnchor(id: StatementSectionId): string {
    return `challenge-${this.challenge().id}-${id}`;
  }

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
