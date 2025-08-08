import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sponsors-section',
  imports: [CommonModule],
  templateUrl: './sponsors-section.component.html',
  styleUrl: './sponsors-section.component.scss'
})
export class SponsorsSectionComponent {
  sponsors = {
    diamond: [
      { name: 'NASA', logo: 'assets/sponsors/nasa-logo.png', url: 'https://nasa.gov' },
    ],
    gold: [
      { name: 'Uberlândia Prefeitura', logo: 'assets/sponsors/prefeitura-logo.png', url: '#' },
      { name: 'UFU', logo: 'assets/sponsors/ufu-logo.png', url: 'https://ufu.br' },
    ],
    silver: [
      { name: 'FIEMG', logo: 'assets/sponsors/fiemg-logo.png', url: '#' },
      { name: 'SEBRAE', logo: 'assets/sponsors/sebrae-logo.png', url: '#' },
      { name: 'CDL Uberlândia', logo: 'assets/sponsors/cdl-logo.png', url: '#' },
    ],
    bronze: [
      { name: 'Empresa 1', logo: 'assets/sponsors/empresa1-logo.png', url: '#' },
      { name: 'Empresa 2', logo: 'assets/sponsors/empresa2-logo.png', url: '#' },
      { name: 'Empresa 3', logo: 'assets/sponsors/empresa3-logo.png', url: '#' },
      { name: 'Empresa 4', logo: 'assets/sponsors/empresa4-logo.png', url: '#' },
    ],
    supporters: [
      { name: 'Apoiador 1', logo: 'assets/sponsors/apoiador1-logo.png', url: '#' },
      { name: 'Apoiador 2', logo: 'assets/sponsors/apoiador2-logo.png', url: '#' },
      { name: 'Apoiador 3', logo: 'assets/sponsors/apoiador3-logo.png', url: '#' },
      { name: 'Apoiador 4', logo: 'assets/sponsors/apoiador4-logo.png', url: '#' },
      { name: 'Apoiador 5', logo: 'assets/sponsors/apoiador5-logo.png', url: '#' },
    ]
  };
}
