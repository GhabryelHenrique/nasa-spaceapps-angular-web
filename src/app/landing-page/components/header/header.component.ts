import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MENTOR_FORM_URL, REGISTRATION_URL } from '../../../shared/data/registration.data';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  scrolled = false;
  mobileMenuOpen = false;

  readonly registrationUrl = REGISTRATION_URL;
  readonly mentorFormUrl = MENTOR_FORM_URL;

  readonly userMenuOpen = signal(false);

  private readonly platformId = inject(PLATFORM_ID);

  @HostListener('window:scroll')
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled = window.scrollY > 40;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.userMenuOpen() && !(event.target as HTMLElement).closest('.user-menu')) {
      this.userMenuOpen.set(false);
    }
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

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen.update(open => !open);
  }
}
