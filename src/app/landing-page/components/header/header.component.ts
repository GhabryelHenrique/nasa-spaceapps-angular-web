import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CHALLENGES_DATA, Challenge } from '../../../shared/data/challenges.data';
import { LanguageSwitcherComponent } from '../../../shared/language-switcher/language-switcher.component';

interface ChallengeCategory {
  id: number;
  name: string;
  slug: string;
  color: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, LanguageSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  showChallenges = false;
  showInfo = false;
  mobileMenuOpen = false;
  mobileChallengesOpen = false;

  challengeCategories: ChallengeCategory[] = [
    {
      id: 1,
      name: 'Iniciante/Jovem',
      slug: 'beginneryouth',
      color: '#07173F',
      icon: 'fa-solid fa-seedling',
      count: this.getCategoryCount('beginneryouth')
    },
    {
      id: 2,
      name: 'Intermediário',
      slug: 'intermediate',
      color: '#FF580A',
      icon: 'fa-solid fa-rocket',
      count: this.getCategoryCount('intermediate')
    },
    {
      id: 3,
      name: 'Avançado',
      slug: 'advanced',
      color: '#8B0A03',
      icon: 'fa-solid fa-trophy',
      count: this.getCategoryCount('advanced')
    }
  ];

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    // Close dropdowns when scrolling
    this.showChallenges = false;
    this.showInfo = false;
  }

  private getCategoryCount(slug: string): number {
    return CHALLENGES_DATA.filter(challenge =>
      challenge.categories.some(cat => cat.slug === slug)
    ).length;
  }

  joinDiscordServer(): void {
    window.open('https://discord.gg/FT4Jsvj5vy', '_blank');
  }

  openWhatsApp(): void {
    window.open('https://chat.whatsapp.com/LXwUUZaJPXtBOeKr7N4axg', '_blank');
  }

  openInstagram(): void {
    window.open('https://www.instagram.com/nasaspaceappsuberlandia', '_blank');
  }

  goToLandingPage(): void {
    window.location.href = '/';
  }

  scrollToChallenges(): void {
    this.scrollToSection('challenges');
    this.showChallenges = false;
  }

  scrollToChallengeCategory(categorySlug: string): void {
    this.scrollToSection('challenges');
    setTimeout(() => {
      const categoryElement = document.querySelector(`[data-category="${categorySlug}"]`);
      if (categoryElement) {
        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
    this.showChallenges = false;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.showInfo = false;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      this.mobileChallengesOpen = false;
    }
  }

  toggleMobileChallenges(): void {
    this.mobileChallengesOpen = !this.mobileChallengesOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.mobileChallengesOpen = false;
    document.body.style.overflow = 'auto';
  }
}
