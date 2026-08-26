import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Challenge, CHALLENGES_DATA } from '../../../shared/data/challenges.data';

@Component({
  selector: 'app-challenges-section',
  imports: [CommonModule],
  templateUrl: './challenges-section.component.html',
  styleUrl: './challenges-section.component.scss'
})
export class ChallengesSectionComponent implements OnInit {
  challenges: Challenge[] = CHALLENGES_DATA;
  filteredChallenges: Challenge[] = CHALLENGES_DATA;
  selectedCategory: string = 'all';
  
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

  getSkillsToShow(skills: string[]): string[] {
    return skills.slice(0, 5);
  }

  getSkillsCount(skills: string[]): number {
    return skills.length;
  }

  getRemainingSkillsCount(skills: string[]): number {
    return skills.length - 5;
  }

  trackBySlug(index: number, challenge: Challenge): string {
    return challenge.slug;
  }

  trackByCategoryId(index: number, category: any): string {
    return category.id;
  }
}
