import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as localEvents  from '../shared/data/localEvents.json';
import { CityParticipation } from '../shared/interfaces/local-event.interface';
import { RegistrationChartsComponent } from './components/registration-charts/registration-charts.component';
import { RegistrationDataService, RegistrationStats } from '../services/registration-data.service';

@Component({
  selector: 'app-war-room',
  imports: [CommonModule, RegistrationChartsComponent],
  templateUrl: './war-room.component.html',
  styleUrl: './war-room.component.scss'
})
export class WarRoomComponent implements OnInit {
  cities: CityParticipation[] = [];
  sortOrder: 'desc' | 'asc' = 'desc';
  totalParticipants = 0;
  totalCities = 0;

  registrationStats: RegistrationStats | null = null;
  isLoadingFile = false;

  constructor(private registrationDataService: RegistrationDataService) {}

  ngOnInit() {
    this.loadCities();
    this.tryLoadExistingFile();
  }

  private async tryLoadExistingFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx,.xls';
    fileInput.style.display = 'none';

    try {
      const response = await fetch('INSCRICAO DO NASA SPACE APPS 2025 (respostas).xlsx');
      if (response.ok) {
        const blob = await response.blob();
        const file = new File([blob], 'inscricoes.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        await this.processExcelFile(file);
      }
    } catch (error) {
      console.log('Arquivo Excel não encontrado no diretório do projeto');
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.processExcelFile(file);
    }
  }

  private async processExcelFile(file: File) {
    this.isLoadingFile = true;
    try {
      // Validar tipo de arquivo
      if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
        throw new Error('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
      }

      // Validar tamanho do arquivo (máximo 10MB)
      // if (file.size > 10 * 1024 * 1024) {
      //   throw new Error('O arquivo é muito grande. Por favor, selecione um arquivo menor que 10MB.');
      // }

      console.log(`Processando arquivo: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

      await this.registrationDataService.loadExcelData(file);
      this.registrationStats = this.registrationDataService.getRegistrationStats();
      console.log(this.registrationStats);

      if (this.registrationStats.totalRegistrations === 0) {
        alert('O arquivo foi processado mas não contém dados válidos. Verifique se o arquivo tem dados nas colunas corretas.');
      } else {
        console.log(`Dados carregados com sucesso: ${this.registrationStats.totalRegistrations} registros`);
      }
    } catch (error: any) {
      console.error('Erro ao processar arquivo Excel:', error);
      const errorMessage = error.message || 'Erro desconhecido ao processar arquivo';
      alert(`Erro: ${errorMessage}\n\nDicas:\n- Verifique se o arquivo é um Excel válido (.xlsx ou .xls)\n- Certifique-se que a primeira linha contém os cabeçalhos\n- Verifique se há dados nas colunas`);
    } finally {
      this.isLoadingFile = false;
    }
  }

  triggerFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx,.xls';
    fileInput.onchange = (e) => this.onFileSelected(e);
    fileInput.click();
  }

  loadDemoData() {
    this.registrationDataService.loadDemoData();
    this.registrationStats = this.registrationDataService.getRegistrationStats();
    console.log('Dados de demonstração carregados com sucesso');
  }
}
