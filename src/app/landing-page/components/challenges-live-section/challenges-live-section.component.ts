import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Challenge, CHALLENGES_DATA } from '../../../shared/data/challenges.data';
import { REGISTRATION_URL } from '../../../shared/data/registration.data';
import { ChallengeDetailModalComponent } from '../../../shared/challenge-detail-modal/challenge-detail-modal.component';
import { ChallengeShareModalComponent } from '../../../shared/challenge-share/challenge-share-modal.component';

/**
 * "Os desafios saíram" — bloco logo abaixo do hero.
 *
 * Os resumos da edição 2026 foram publicados em 17/09, junto com a liberação da
 * formação de equipes; os enunciados completos (com os conjuntos de dados) só
 * saem em 28/10. A seção anuncia isso e leva para `/desafios`, mostrando uma
 * prévia de três desafios — um de cada nível — em vez de repetir a lista inteira.
 */
@Component({
  selector: 'app-challenges-live-section',
  imports: [RouterLink, ChallengeDetailModalComponent, ChallengeShareModalComponent],
  templateUrl: './challenges-live-section.component.html',
  styleUrl: './challenges-live-section.component.scss'
})
export class ChallengesLiveSectionComponent {
  readonly registrationUrl = REGISTRATION_URL;
  readonly challengeCount = CHALLENGES_DATA.length;

  /** Áreas distintas cobertas pela edição — os "Temas" que a NASA marca em cada desafio. */
  readonly areaCount = new Set(CHALLENGES_DATA.flatMap(challenge => challenge.tags)).size;

  /** Prévia com desafios de áreas diferentes, para mostrar a variedade da edição. */
  readonly preview: Challenge[] = this.pickByDistinctArea(3);

  /** Desafio aberto no modal de detalhes; `null` com o modal fechado. */
  readonly selectedChallenge = signal<Challenge | null>(null);

  /** Desafio aberto na exportação para o Instagram; `null` com o modal fechado. */
  readonly sharedChallenge = signal<Challenge | null>(null);

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

  /** Desafios com áreas principais distintas, na ordem da lista oficial. */
  private pickByDistinctArea(limit: number): Challenge[] {
    const picked: Challenge[] = [];
    const seenAreas = new Set<string>();

    for (const challenge of CHALLENGES_DATA) {
      const area = challenge.tags[0];
      if (!area || seenAreas.has(area)) continue;

      seenAreas.add(area);
      picked.push(challenge);
      if (picked.length === limit) break;
    }

    return picked;
  }
}
