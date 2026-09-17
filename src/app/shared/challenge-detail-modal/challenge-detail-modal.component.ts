import { Component, HostListener, computed, input, output } from '@angular/core';
import { Challenge, CURRENT_CHALLENGE_YEAR, challengeDetailUrl } from '../data/challenges.data';

/**
 * Modal com o detalhamento de um desafio.
 *
 * Enquanto o site da NASA não publica as páginas de 2026, o "Ver Detalhes" abre
 * este modal em vez de mandar o participante para um link que ainda dá 404.
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

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
