import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CityRanking {
  position: number;
  city: string;
  country: string;
  nominations: number;
  isUberlandia: boolean;
}

interface CountryRanking {
  position: number;
  country: string;
  flag: string;
  nominations: number;
  isBrazil: boolean;
}

@Component({
  selector: 'app-global-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-stats.component.html',
  styleUrl: './global-stats.component.scss'
})
export class GlobalStatsComponent {
  // Estatísticas Globais
  globalStats = {
    totalTeams: 1294,
    totalCities: 460,
    totalCountries: 96
  };

  // Estatísticas do Brasil
  brazilStats = {
    totalNominations: 95,
    totalCities: 44,
    worldPosition: 3,
    percentage: 7.3
  };

  // Estatísticas de Uberlândia
  uberlandiaStats = {
    nominations: 10,
    worldPosition: 6,
    brazilPosition: 1,
    percentageOfLeader: 6.9,
    percentageOfBrazil: 10.5
  };

  // Top 10 Cidades do Mundo
  topWorldCities: CityRanking[] = [
    { position: 1, city: 'Universal Event', country: 'Anywhere in the World', nominations: 145, isUberlandia: false },
    { position: 2, city: 'Coimbatore', country: 'India', nominations: 10, isUberlandia: false },
    { position: 3, city: 'Abu Dhabi', country: 'United Arab Emirates', nominations: 10, isUberlandia: false },
    { position: 4, city: 'Çorum', country: 'Turkey', nominations: 10, isUberlandia: false },
    { position: 5, city: 'Kochi', country: 'India', nominations: 10, isUberlandia: false },
    { position: 6, city: 'Uberlândia', country: 'Brazil', nominations: 10, isUberlandia: true },
    { position: 7, city: 'Miri', country: 'Malaysia', nominations: 10, isUberlandia: false },
    { position: 8, city: 'Lahore', country: 'Pakistan', nominations: 10, isUberlandia: false },
    { position: 9, city: 'Cairo', country: 'Egypt', nominations: 10, isUberlandia: false },
    { position: 10, city: 'Kanjirappally', country: 'India', nominations: 10, isUberlandia: false }
  ];

  // Top 5 Países
  topCountries: CountryRanking[] = [
    { position: 1, country: 'India', flag: '🇮🇳', nominations: 242, isBrazil: false },
    { position: 2, country: 'Anywhere in the World', flag: '🌍', nominations: 145, isBrazil: false },
    { position: 3, country: 'Brazil', flag: '🇧🇷', nominations: 95, isBrazil: true },
    { position: 4, country: 'Turkey', flag: '🇹🇷', nominations: 80, isBrazil: false },
    { position: 5, country: 'United States', flag: '🇺🇸', nominations: 62, isBrazil: false }
  ];

  // Top 10 Cidades do Brasil
  topBrazilCities: CityRanking[] = [
    { position: 1, city: 'Uberlândia', country: 'Brazil', nominations: 10, isUberlandia: true },
    { position: 2, city: 'Campinas', country: 'Brazil', nominations: 7, isUberlandia: false },
    { position: 3, city: 'Boa Vista', country: 'Brazil', nominations: 6, isUberlandia: false },
    { position: 4, city: 'São Gonçalo', country: 'Brazil', nominations: 4, isUberlandia: false },
    { position: 5, city: 'São José do Rio Preto', country: 'Brazil', nominations: 4, isUberlandia: false },
    { position: 6, city: 'Jaguariúna', country: 'Brazil', nominations: 4, isUberlandia: false },
    { position: 7, city: 'Sorocaba', country: 'Brazil', nominations: 3, isUberlandia: false },
    { position: 8, city: 'Ribeirão Preto', country: 'Brazil', nominations: 3, isUberlandia: false },
    { position: 9, city: 'Guarulhos', country: 'Brazil', nominations: 3, isUberlandia: false },
    { position: 10, city: 'São Luis', country: 'Brazil', nominations: 2, isUberlandia: false }
  ];

  getMedalEmoji(position: number): string {
    switch(position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  }
}
