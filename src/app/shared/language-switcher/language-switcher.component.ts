import { Component, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-language-switcher',
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {
  isOpen = false;
  currentLang: string;

  constructor(@Inject(LOCALE_ID) public localeId: string) {
    this.currentLang = localeId;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  switchLanguage(locale: string): void {
    this.isOpen = false;
    
    // For development, we'll reload the page with the appropriate path
    if (locale === 'pt-BR') {
      window.location.href = '/';
    } else {
      // In a production environment, you would handle routing for different locales
      // For now, we'll just indicate the language change
      Swal.fire({
        icon: 'info',
        title: 'Idioma Inglês',
        text: 'Versão em inglês será carregada em /en/',
        confirmButtonColor: '#45b7d1',
        confirmButtonText: 'Entendi'
      });
    }
  }
}
