import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { RegistrationStats } from '../../../services/registration-data.service';

interface CityCoordinates {
  city: string;
  lat: number;
  lng: number;
  count: number;
}

@Component({
  selector: 'app-registration-map',
  imports: [CommonModule],
  templateUrl: './registration-map.component.html',
  styleUrl: './registration-map.component.scss'
})
export class RegistrationMapComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() registrationStats: RegistrationStats | null = null;
  @Input() uberlandia: any | null = null;
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map!: L.Map;
  private cityCircles: L.CircleMarker[] = [];

  // Coordenadas conhecidas de todas as cidades dos participantes
  private readonly cityCoordinates: { [key: string]: [number, number] } = {
    // Minas Gerais - Região Principal e Triângulo Mineiro
    'Uberlândia': [-18.9113, -48.2622],
    'Araguari': [-18.6467, -48.1858],
    'Ituiutaba': [-18.9681, -49.4648],
    'Uberaba': [-19.7483, -47.9386],
    'Patos de Minas': [-18.5789, -46.5186],
    'Araxá': [-19.5939, -46.9394],
    'Ibiá': [-19.4833, -46.5346],
    'Oliveira': [-20.6967, -44.8264],
    'Contagem': [-19.9317, -44.0536],
    'Belo Horizonte': [-19.9167, -43.9345],
    'Coronel Fabriciano': [-19.5217, -42.6281],
    'Ouro Preto': [-20.3856, -43.5035],
    'Mariana': [-20.3778, -43.4175],
    'Porteirinha': [-15.7356, -43.0283],
    'Indianópolis': [-18.9833, -47.9167],
    'Monte Carmelo': [-18.7167, -47.4833],
    'Nova Ponte': [-19.1333, -47.6833],
    'Campina Verde': [-19.5333, -49.4833],
    'Coromandel': [-18.1667, -47.2],
    'Perdizes': [-19.35, -47.3],
    'Tupaciguara': [-18.5833, -48.7333],
    'Santa Juliana': [-19.3167, -47.5333],
    'Patrocínio': [-18.9439, -46.9933],
    'São Sebastião': [-20.8953, -42.7081],
    'Nova Lima': [-19.9856, -43.8467],
    'Montes Claros': [-16.7289, -43.8606],
    'Unaí': [-16.3577, -46.9061],

    // Goiás
    'Catalão': [-18.1664, -47.9456],
    'Nova Aurora': [-17.6667, -51.0833],
    'Goiânia': [-16.6869, -49.2648],
    'Aparecida de Goiânia': [-16.8233, -49.2439],
    'Goiatuba': [-18.0133, -49.3567],
    'Morrinhos': [-17.7306, -49.1003],
    'Pires do Rio': [-17.3, -48.2833],
    'Rio Quente': [-17.7833, -48.75],
    'Águas Lindas de Goiás': [-15.7542, -48.2758],

    // São Paulo
    'São Paulo': [-23.5505, -46.6333],
    'Osasco': [-23.5329, -46.7918],
    'Artur Nogueira': [-22.5733, -47.1742],
    'Guaíra': [-20.3167, -48.3167],
    'Ribeirão Preto': [-21.1775, -47.8108],
    'Santo André': [-23.6814, -46.5339],
    'São Carlos': [-22.0175, -47.8919],
    'Sertãozinho': [-21.1398, -47.9819],
    'Penápolis': [-21.4206, -50.0769],
    'Bauru': [-22.3147, -49.0614],
    'Barueri': [-23.5106, -46.8761],
    'Itaquaquecetuba': [-23.4869, -46.3481],
    'Mauá': [-23.6678, -46.4614],
    'Vargem Grande Paulista': [-23.6042, -47.0336],

    // Distrito Federal
    'Brasília': [-15.7801, -47.9292],

    // Paraná
    'Icaraíma': [-23.3267, -53.6267],
    'Realeza': [-25.7717, -53.5344],
    'Foz do Iguaçu': [-25.5478, -54.5882],
    'Curitiba': [-25.4284, -49.2733],

    // Santa Catarina
    'Palhoça': [-27.6383, -48.6700],
    'Criciúma': [-28.6767, -49.3692],

    // Rio Grande do Sul
    'Três Coroas': [-29.5083, -50.7833],
    'Porto Alegre': [-30.0346, -51.2177],
    'Sapucaia do Sul': [-29.8394, -51.1428],
    'Catuípe': [-28.25, -54.0167],

    // Rio de Janeiro
    'Rio de Janeiro': [-22.9068, -43.1729],
    'Nova Iguaçu': [-22.7587, -43.4508],
    'Cabo Frio': [-22.8794, -42.0217],
    'Belford Roxo': [-22.7631, -43.3997],

    // Alagoas
    'Maceió': [-9.6498, -35.7089],

    // Maranhão
    'São Bernardo': [-4.7667, -45.2833],
    'São Luís': [-2.5387, -44.2832],

    // Mato Grosso do Sul
    'Paranaíba': [-19.6775, -51.1908],
    'Campo Grande': [-20.4697, -54.6201],

    // Ceará
    'Fortaleza': [-3.7319, -38.5267],

    // Bahia
    'Salvador': [-12.9714, -38.5014],

    // Pernambuco
    'Recife': [-8.0476, -34.8770],
    'Gravatá': [-8.2019, -35.5642],
    'Olinda': [-8.0119, -34.8553],

    // Sergipe
    'Aracaju': [-10.9472, -37.0731],

    // Amazonas
    'Manaus': [-3.1190, -60.0217],

    // Países Estrangeiros
    'Moçambique': [-18.25, 35] // Maputo, Moçambique
  };

  ngOnInit() {
    // Inicialização será feita no AfterViewInit
  }

  ngAfterViewInit() {
    // Aguardar um tick para garantir que o ViewChild esteja disponível
    setTimeout(() => {
      this.initializeMap();
      if (this.registrationStats) {
        this.updateMapMarkers();
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['registrationStats'] && !changes['registrationStats'].firstChange) {
      // Aguardar um pouco para garantir que o mapa esteja inicializado
      setTimeout(() => {
        this.updateMapMarkers();
      }, 200);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap() {
    // Verificar se o container está disponível
    if (!this.mapContainer?.nativeElement) {
      console.warn('Map container not available yet, retrying...');
      setTimeout(() => this.initializeMap(), 100);
      return;
    }

    // Configurar ícones do Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    try {
      // Inicializar mapa centrado no Brasil, com foco em Uberlândia
      this.map = L.map(this.mapContainer.nativeElement, {
        center: [-18.9113, -48.2622], // Uberlândia
        zoom: 5,
        zoomControl: true,
        attributionControl: true
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      return;
    }

    // Adicionar layer do mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Estilo personalizado para tema space
    const mapStyle = `
      .leaflet-container {
        background-color: #0f0f23 !important;
        border-radius: 12px;
      }
      .leaflet-control-container .leaflet-control {
        background: rgba(255, 255, 255, 0.1) !important;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        color: #ffffff !important;
      }
      .leaflet-popup-content-wrapper {
        background: rgba(15, 15, 35, 0.95) !important;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(78, 205, 196, 0.3);
        border-radius: 12px;
        color: #ffffff !important;
      }
      .leaflet-popup-tip {
        background: rgba(15, 15, 35, 0.95) !important;
        border: 1px solid rgba(78, 205, 196, 0.3);
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = mapStyle;
    document.head.appendChild(styleElement);
  }

  private updateMapMarkers() {
    if (!this.map || !this.registrationStats || !this.mapContainer?.nativeElement) {
      console.warn('Map or registration stats not ready for markers update');
      return;
    }

    // Limpar marcadores existentes
    this.cityCircles.forEach(circle => this.map.removeLayer(circle));
    this.cityCircles = [];

    // Obter dados das cidades
    const cityData = this.getCityCoordinatesWithCounts();

    if (cityData.length === 0) return;

    // Calcular tamanho dos círculos baseado no número de inscrições
    const maxCount = Math.max(...cityData.map(c => c.count));
    const minRadius = 8;
    const maxRadius = 50;

    cityData.forEach(cityInfo => {
      // Calcular raio proporcional
      const radius = minRadius + ((cityInfo.count / maxCount) * (maxRadius - minRadius));

      // Definir cor baseada na concentração
      const color = this.getColorByConcentration(cityInfo.count, maxCount);

      // Criar círculo
      const circle = L.circleMarker([cityInfo.lat, cityInfo.lng], {
        radius: radius,
        fillColor: color,
        color: '#4ecdc4',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.6
      });

      // Adicionar popup com informações
      const popupContent = `
        <div style="text-align: center; padding: 8px;">
          <h4 style="margin: 0 0 8px 0; color: #4ecdc4; font-size: 1.1rem;">
            📍 ${cityInfo.city}
          </h4>
          <p style="margin: 0; font-size: 1rem; font-weight: bold;">
            ${cityInfo.count} ${cityInfo.count === 1 ? 'inscrição' : 'inscrições'}
          </p>
          <p style="margin: 4px 0 0 0; font-size: 0.9rem; opacity: 0.8;">
            ${((cityInfo.count / this.registrationStats!.totalRegistrations) * 100).toFixed(1)}% do total
          </p>
        </div>
      `;

      circle.bindPopup(popupContent);
      circle.addTo(this.map);
      this.cityCircles.push(circle);

      // Adicionar efeito hover
      circle.on('mouseover', () => {
        circle.setStyle({
          weight: 4,
          opacity: 1,
          fillOpacity: 0.8
        });
      });

      circle.on('mouseout', () => {
        circle.setStyle({
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.6
        });
      });
    });

    // Ajustar visualização para mostrar todos os pontos
    if (cityData.length > 0) {
      const group = new L.FeatureGroup(this.cityCircles);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  private getCityCoordinatesWithCounts(): CityCoordinates[] {
    if (!this.registrationStats) return [];

    const result: CityCoordinates[] = [];

    this.registrationStats.cityStats.forEach(cityStat => {
      const coordinates = this.cityCoordinates[cityStat.city];
      if (coordinates) {
        result.push({
          city: cityStat.city,
          lat: coordinates[0],
          lng: coordinates[1],
          count: cityStat.count
        });
      }
    });

    return result;
  }

  private getColorByConcentration(count: number, maxCount: number): string {
    const percentage = count / maxCount;

    if (percentage >= 0.8) return '#ff4444'; // Vermelho - muito alta
    if (percentage >= 0.6) return '#ff8844'; // Laranja - alta
    if (percentage >= 0.4) return '#ffcc44'; // Amarelo - média alta
    if (percentage >= 0.2) return '#44ccff'; // Azul - média
    return '#4ecdc4'; // Verde - baixa
  }
}
