import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Challenge, CHALLENGES_DATA } from '../../../shared/data/challenges.data';
import { DISCORD_URL, REGISTRATION_URL } from '../../../shared/data/registration.data';
import { ChallengeDetailModalComponent } from '../../../shared/challenge-detail-modal/challenge-detail-modal.component';

@Component({
  selector: 'app-challenges-section',
  imports: [CommonModule, ChallengeDetailModalComponent],
  templateUrl: './challenges-section.component.html',
  styleUrl: './challenges-section.component.scss'
})
export class ChallengesSectionComponent implements OnInit {
  challenges: Challenge[] = CHALLENGES_DATA;
  filteredChallenges: Challenge[] = CHALLENGES_DATA;
  selectedCategory: string = 'all';

  readonly registrationUrl = REGISTRATION_URL;
  readonly discordUrl = DISCORD_URL;

  /** Desafio aberto no modal de detalhes; `null` com o modal fechado. */
  readonly selectedChallenge = signal<Challenge | null>(null);


  categories = [
    { id: 'all', name: 'Todos', color: '#2E96F5' },
    { id: 'beginneryouth', name: 'Iniciante/Jovem', color: '#2E96F5' },
    { id: 'intermediate', name: 'Intermediário', color: '#E43700' },
    { id: 'advanced', name: 'Avançado', color: '#8E1100' }
  ];

  ngOnInit() {
    this.filterChallenges();
  }

  filterByCategory(categorySlug: string) {
    this.selectedCategory = categorySlug;
    this.filterChallenges();
  }

  private filterChallenges() {
    if (this.selectedCategory === 'all') {
      this.filteredChallenges = this.challenges;
    } else {
      this.filteredChallenges = this.challenges.filter(challenge =>
        challenge.categories.some(cat => cat.slug === this.selectedCategory)
      );
    }
  }

  getCategoryBadges(challenge: Challenge): string[] {
    return challenge.categories.map(cat => cat.name);
  }

  getCategoryCount(categoryId: string): number {
    if (categoryId === 'all') {
      return this.challenges.length;
    }
    return this.challenges.filter(c => 
      c.categories.some(cat => cat.slug === categoryId)
    ).length;
  }

  getCategoryColor(challenge: Challenge, categoryName: string): string {
    const category = challenge.categories.find(c => c.name === categoryName);
    return category ? category.color : '#2E96F5';
  }

  openChallenge(challenge: Challenge): void {
    this.selectedChallenge.set(challenge);
  }

  closeChallenge(): void {
    this.selectedChallenge.set(null);
  }

  trackBySlug(index: number, challenge: Challenge): string {
    return challenge.slug;
  }

  trackByCategoryId(index: number, category: any): string {
    return category.id;
  }
}
