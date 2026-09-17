import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import {
  Challenge,
  CHALLENGE_YEARS,
  CURRENT_CHALLENGE_YEAR,
  getChallengeEdition
} from '../shared/data/challenges.data';
import { DISCORD_URL, REGISTRATION_URL } from '../shared/data/registration.data';
import { ChallengeDetailModalComponent } from '../shared/challenge-detail-modal/challenge-detail-modal.component';
import { ChallengeShareModalComponent } from '../shared/challenge-share/challenge-share-modal.component';
import { ChallengeBulkExportModalComponent } from '../shared/challenge-share/challenge-bulk-export-modal.component';

@Component({
  selector: 'app-challenges',
  imports: [
    CommonModule,
    RouterModule,
    ChallengeDetailModalComponent,
    ChallengeShareModalComponent,
    ChallengeBulkExportModalComponent
  ],
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.scss'
})
export class ChallengesComponent {
  private readonly route = inject(ActivatedRoute);

  readonly registrationUrl = REGISTRATION_URL;
  readonly discordUrl = DISCORD_URL;
  readonly years = CHALLENGE_YEARS;

  /**
   * Ano vem do `data` da rota. Via observable, e não do snapshot, porque o
   * seletor de edição troca entre /desafios/2025 e /desafios/2026 reusando a
   * mesma instância do componente — com snapshot a página não atualizaria.
   */
  readonly year = toSignal(
    this.route.data.pipe(map(d => (d['year'] as number) ?? CURRENT_CHALLENGE_YEAR)),
    { initialValue: CURRENT_CHALLENGE_YEAR }
  );

  readonly edition = computed(() => getChallengeEdition(this.year()));
  readonly isCurrentEdition = computed(() => this.year() === CURRENT_CHALLENGE_YEAR);

  readonly selectedCategory = signal<string>('all');

  /** Desafio aberto no modal de detalhes; `null` com o modal fechado. */
  readonly selectedChallenge = signal<Challenge | null>(null);

  /** Desafio aberto na exportação para o Instagram; `null` com o modal fechado. */
  readonly sharedChallenge = signal<Challenge | null>(null);

  /** Kit de divulgação (todos os desafios de uma vez). */
  readonly bulkExportOpen = signal(false);

  readonly categories = [
    { id: 'all', name: 'Todos', color: '#2E96F5' },
    { id: 'beginneryouth', name: 'Iniciante/Jovem', color: '#2E96F5' },
    { id: 'intermediate', name: 'Intermediário', color: '#E43700' },
    { id: 'advanced', name: 'Avançado', color: '#8E1100' }
  ];

  readonly filteredChallenges = computed(() => {
    const challenges = this.edition().challenges;
    const category = this.selectedCategory();
    return category === 'all'
      ? challenges
      : challenges.filter(c => c.categories.some(cat => cat.slug === category));
  });

  filterByCategory(categorySlug: string): void {
    this.selectedCategory.set(categorySlug);
  }

  getCategoryCount(categoryId: string): number {
    const challenges = this.edition().challenges;
    if (categoryId === 'all') return challenges.length;
    return challenges.filter(c => c.categories.some(cat => cat.slug === categoryId)).length;
  }

  getCategoryBadges(challenge: Challenge): string[] {
    return challenge.categories.map(cat => cat.name);
  }

  getCategoryColor(challenge: Challenge, categoryName: string): string {
    return challenge.categories.find(c => c.name === categoryName)?.color ?? '#2E96F5';
  }

  /** 2025 trazia listas longas de habilidades; o resto vira um chip "+N mais". */
  getTagsToShow(tags: string[]): string[] {
    return tags.slice(0, 5);
  }

  getRemainingTagsCount(tags: string[]): number {
    return tags.length - 5;
  }

  openChallenge(challenge: Challenge): void {
    this.selectedChallenge.set(challenge);
  }

  closeChallenge(): void {
    this.selectedChallenge.set(null);
  }

  /** Abre a exportação do card. O modal de detalhes sai de cena para não empilhar dois diálogos. */
  openShare(challenge: Challenge): void {
    this.selectedChallenge.set(null);
    this.sharedChallenge.set(challenge);
  }

  closeShare(): void {
    this.sharedChallenge.set(null);
  }

  openBulkExport(): void {
    this.bulkExportOpen.set(true);
  }

  closeBulkExport(): void {
    this.bulkExportOpen.set(false);
  }
}
