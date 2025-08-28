import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as localEvents  from '../shared/data/localEvents.json';
import * as inscricoesData from '../shared/data/inscricoes_nasa_space_apps_2025.json';
import { CityParticipation } from '../shared/interfaces/local-event.interface';
import { RegistrationChartsComponent } from './components/registration-charts/registration-charts.component';
import { RegistrationMapComponent } from './components/registration-map/registration-map.component';
import { RegistrationDataService, RegistrationStats } from '../services/registration-data.service';

@Component({
  selector: 'app-war-room',
  imports: [CommonModule, RegistrationChartsComponent, RegistrationMapComponent],
  templateUrl: './war-room.component.html',
  styleUrl: './war-room.component.scss'
})
export class WarRoomComponent implements OnInit {
  cities: CityParticipation[] = [];
  sortOrder: 'desc' | 'asc' = 'desc';
  totalParticipants = 0;
  totalCities = 0;
  uberlandia: any
  registrationStats: RegistrationStats | null = null;
  isLoadingFile = false;

  constructor(private registrationDataService: RegistrationDataService) {}

  ngOnInit() {
    this.loadCities();
    this.loadJSONData();
  }

  private loadJSONData() {
    try {
      // Processa os dados do arquivo JSON
      const jsonRegistrations = (inscricoesData as any).default || inscricoesData;

      // Transforma os dados JSON no formato esperado pelo service
      const registrationData = jsonRegistrations.map((item: any) => ({
        timestamp: this.convertTimestampToDate(item['Carimbo de data/hora']),
        name: '', // Removido por privacidade
        email: '', // Removido por privacidade
        phone: item['DDD'] ? `${item['DDD']}000000000` : '', // Apenas DDD para análise de região
        city: item['Cidade onde reside:'] || '',
        motivations: item['Como você ficou sabendo do Hackathon?'] || '',
        experience: item['Escolaridade:'] || '',
        interests: String(item['Data de Nascimento '] || ''),
        availability: item['Gostaria de fazer o hackathon Presencialmente ou Remotamente?'] || '',
        expectations: item['Áreas de interesse'] || '',
      }));

      // Atualiza o service com os dados do JSON
      this.registrationDataService.setRegistrationData(registrationData);
      this.registrationStats = this.registrationDataService.getRegistrationStats();

      console.log(`Dados JSON carregados com sucesso: ${this.registrationStats.totalRegistrations} registros`);
    } catch (error) {
      console.error('Erro ao carregar dados do JSON:', error);
    }
  }

  private convertTimestampToDate(timestamp: any): string {
    try {
      if (typeof timestamp === 'number') {
        // Se é timestamp em milissegundos
        const date = new Date(timestamp);
        return date.toISOString();
      }
      return String(timestamp || '');
    } catch (error) {
      return '';
    }
  }

  private loadCities() {
    this.cities = localEvents.data.map((event: any) => ({
      city: event.node.properties.displayName,
      country: event.node.properties.country,
      registrations: event.node.properties.cachedRegistrations,
      eventType: event.node.properties.eventType,
      url: event.node.properties.meta.htmlUrl
    }));
    this.uberlandia = this.cities.find((city: any) => city.city.toLowerCase().includes('uberlandia') || city.city.toLowerCase().includes('uberlândia'));
    this.sortCities();
    this.calculateStats();
  }

  sortCities(order?: 'desc' | 'asc') {
    if (order) {
      this.sortOrder = order;
    }

    this.cities.sort((a, b) => {
      if (this.sortOrder === 'desc') {
        return b.registrations - a.registrations;
      } else {
        return a.registrations - b.registrations;
      }
    });
  }

  private calculateStats() {
    this.totalCities = this.cities.length;
    this.totalParticipants = this.cities.reduce((sum, city) => sum + city.registrations, 0);
  }

  getEventTypeClass(eventType: string): string {
    switch (eventType) {
      case 'In-Person':
        return 'event-type-inperson';
      case 'Virtual':
        return 'event-type-virtual';
      case 'Virtual & In-Person':
        return 'event-type-hybrid';
      default:
        return '';
    }
  }

  getEventTypeIcon(eventType: string): string {
    switch (eventType) {
      case 'In-Person':
        return '👥';
      case 'Virtual':
        return '💻';
      case 'Virtual & In-Person':
        return '🌐';
      default:
        return '📍';
    }
  }

  trackByCity(index: number, city: CityParticipation): string {
    return `${city.city}-${city.country}`;
  }

  getDayWithMostRegistrations(): number {
    if (!this.registrationStats || !this.registrationStats.dailyRegistrations.length) {
      return 0;
    }
    return Math.max(...this.registrationStats.dailyRegistrations.map(d => d.count));
  }

  getMostCommonEducation(): string {
    if (!this.registrationStats || !this.registrationStats.experienceStats.length) {
      return 'N/A';
    }
    return this.registrationStats.experienceStats[0].level;
  }

  getEducationPercentage(): number {
    if (!this.registrationStats || !this.registrationStats.experienceStats.length) {
      return 0;
    }
    const mostCommon = this.registrationStats.experienceStats[0];
    return Math.round((mostCommon.count / this.registrationStats.totalRegistrations) * 100);
  }

  getMostCommonAgeGroup(): string {
    if (!this.registrationStats || !this.registrationStats.ageStats.length) {
      return 'N/A';
    }
    return this.registrationStats.ageStats.sort((a, b) => b.count - a.count)[0].ageGroup;
  }

  getAgeGroupPercentage(): number {
    if (!this.registrationStats || !this.registrationStats.ageStats.length) {
      return 0;
    }
    const mostCommon = this.registrationStats.ageStats[0];
    return Math.round((mostCommon.count / this.registrationStats.totalRegistrations) * 100);
  }

  getParticipationMode(): string {
    if (!this.registrationStats || !this.registrationStats.participationModeStats.length) {
      return 'N/A';
    }
    return this.registrationStats.participationModeStats[0].mode;
  }

  getParticipationPercentage(): number {
    if (!this.registrationStats || !this.registrationStats.participationModeStats.length) {
      return 0;
    }
    const mostCommon = this.registrationStats.participationModeStats[0];
    return Math.round((mostCommon.count / this.registrationStats.totalRegistrations) * 100);
  }

  getMostCommonArea(): string {
    if (!this.registrationStats || !this.registrationStats.phoneAreaStats.length) {
      return 'N/A';
    }
    return this.registrationStats.phoneAreaStats[0].area;
  }

  getAreaPercentage(): number {
    if (!this.registrationStats || !this.registrationStats.phoneAreaStats.length) {
      return 0;
    }
    const mostCommon = this.registrationStats.phoneAreaStats[0];
    return Math.round((mostCommon.count / this.registrationStats.totalRegistrations) * 100);
  }
}
