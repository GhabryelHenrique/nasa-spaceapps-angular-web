import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CodeVerificationModalComponent } from '../../../shared/components/code-verification-modal/code-verification-modal.component';
import { EmailVerificationModalComponent } from '../../../shared/components/email-verification-modal/email-verification-modal.component';
import { CHALLENGES_DATA } from '../../../shared/data/challenges.data';
import { LanguageSwitcherComponent } from '../../../shared/language-switcher/language-switcher.component';
import { MatchmakingService } from '../../../shared/services/matchmaking.service';

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
  imports: [RouterLink, CommonModule, EmailVerificationModalComponent, CodeVerificationModalComponent, LanguageSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  scrolled = false;
  mobileMenuOpen = false;
  showEmailModal = false;
  showCodeModal = false;
  userEmail = '';
  isLoggedIn = false;

  challengeCategories: ChallengeCategory[] = [
    { id: 1, name: 'Iniciante/Jovem', slug: 'beginneryouth', color: '#07173F', icon: 'fa-solid fa-seedling', count: this.getCategoryCount('beginneryouth') },
    { id: 2, name: 'Intermediário', slug: 'intermediate', color: '#FF580A', icon: 'fa-solid fa-rocket', count: this.getCategoryCount('intermediate') },
    { id: 3, name: 'Avançado', slug: 'advanced', color: '#8B0A03', icon: 'fa-solid fa-trophy', count: this.getCategoryCount('advanced') }
  ];

  constructor(
    private matchmakingService: MatchmakingService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.matchmakingService.isAuthenticated$.subscribe(isAuth => { this.isLoggedIn = isAuth; });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled = window.scrollY > 40;
    }
  }

  private getCategoryCount(slug: string): number {
    return CHALLENGES_DATA.filter(c => c.categories.some(cat => cat.slug === slug)).length;
  }

  joinDiscordServer(): void { window.open('https://discord.gg/FT4Jsvj5vy', '_blank'); }
  openWhatsApp(): void { window.open('https://chat.whatsapp.com/LLsTZ9soMR2GflnGSrft0j', '_blank'); }
  openInstagram(): void { window.open('https://www.instagram.com/nasaspaceappsuberlandia', '_blank'); }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  onEmailVerified(data: { email: string; isRegistered: boolean }): void {
    this.userEmail = data.email;
    this.showEmailModal = false;
    if (data.isRegistered) this.showCodeModal = true;
  }

  onCodeVerified(): void {
    this.showCodeModal = false;
    this.isLoggedIn = true;
    this.router.navigate(['/dashboard']);
  }
}
