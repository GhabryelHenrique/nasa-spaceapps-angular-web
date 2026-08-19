import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ThemePillar {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-theme-section',
  imports: [CommonModule, RouterModule],
  templateUrl: './theme-section.component.html',
  styleUrl: './theme-section.component.scss'
})
export class ThemeSectionComponent {
  readonly themeImage = 'assets/theme/next-frontier.png';

  readonly pillars: ThemePillar[] = [
    {
      icon: 'ph ph-planet',
      title: 'Explorar',
      description:
        'Novos mundos, novas órbitas, novos dados. A fronteira começa onde o mapa acaba.'
    },
    {
      icon: 'ph ph-database',
      title: 'Traduzir',
      description:
        'Dados abertos da NASA e das agências parceiras viram respostas para problemas reais.'
    },
    {
      icon: 'ph ph-users-three',
      title: 'Construir',
      description:
        'Em 48 horas, times de até 6 pessoas transformam uma ideia em protótipo.'
    }
  ];
}
