import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../../../environments/environment';

interface EventLocation {
  position: { lat: number; lng: number };
  title: string;
  info: string;
}

@Component({
  selector: 'app-events-map',
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './events-map.component.html',
  styleUrl: './events-map.component.scss'
})
export class EventsMapComponent implements OnInit {
  @ViewChild(GoogleMap) map!: GoogleMap;

  center = { lat: -18.9113, lng: -48.2622 }; // Uberlândia center
  zoom = 12;
  isGoogleMapsLoaded = false;

eventLocations: EventLocation[] = [
  {
    position: { lat: -18.917750, lng: -48.257514 },
    title: 'Universidade Federal de Uberlândia - UFU (Santa Mônica)',
    info: 'Polo principal do NASA Space Apps Challenge Uberlândia. Estrutura dedicada para trilhas, hackathon e apresentações finais.'
  },
  {
    position: { lat: -18.912912, lng: -48.273870 },
    title: 'Uniube - Centro',
    info: 'Espaço de apoio com espaço presenciais. Destinado a equipes de desenvolvimento e networking.'
  },
  {
    position: { lat: -18.922471, lng: -48.293954 },
    title: 'Sankhya',
    info: 'Local preparado para receber pessoas.'
  },
  // {
  //   position: { lat: -18.922250, lng: -48.294392 },
  //   title: 'Sankhya Prédio 2',
  //   info: 'Local preparado para receber pessoas.'
  // },
  // {
  //   position: { lat: -18.929200, lng: -48.268100 },
  //   title: 'CREA / Secretaria da Juventude',
  //   info: 'Apoio a workshops e mentorias técnicas.'
  // },
  {
    position: { lat: -18.924301, lng: -48.232747 },
    title: 'Asa Coworking',
    info: 'Espaço colaborativo voltado para imersão em projetos e networking entre equipes.'
  },
  // {
  //   position: { lat: -18.879712, lng: -48.246336 },
  //   title: 'Brain',
  //   info: 'Espaço de apoio foco em criatividade, design e inovação aplicada aos desafios do hackathon.'
  // },
  // {
  //   position: { lat: -18.909529, lng: -48.248573 },
  //   title: 'MTI',
  //   info: 'Polo de capacitação de mentores do NASA Space Apps Challenge Uberlândia. Atividades de preparação e apoio.'
  // },
  // {
  //   position: { lat: -18.931272, lng: -48.290163 },
  //   title: 'Colégio Nacional',
  //   info: 'Espaço voltado para os alunos do Colégio Nacional. Atividades internas relacionadas ao hackathon e desafios.'
  // },
  // {
  //   position: { lat: -18.904775, lng: -48.277169 },
  //   title: 'Colégio Batista Mineiro',
  //   info: 'Espaço de apoio voltado para alunos do Batista. Atividades complementares ao evento principal.'
  // },
  {
    position: { lat: -18.880390063328278, lng: -48.24725858916541 },
    title: 'Colégio Ann Mackenzie',
    info: 'Espaço de apoio voltado para alunos do Mackenzie. Atividades internas relacionadas ao hackathon.'
  },
  // {
  //   position: { lat: -18.940000, lng: -48.260000 },
  //   title: 'Colégio Gabarito',
  //   info: 'Espaço reservado para alunos do Gabarito. Atividades de aprendizado e oficinas conectadas ao Space Apps.'
  // },
  // {
  //   position: { lat: -18.932000, lng: -48.278500 },
  //   title: 'Olimpo',
  //   info: 'Espaço reservado para alunos do Olimpo. Atividades de aprendizado e oficinas conectadas ao Space Apps'
  // },
  {
    position: { lat: -18.932000, lng: -48.278500 },
    title: 'UNA - Uberlândia',
    info: 'Atividades de apoio e expansão da participação no hackathon.'
  },
];

  mapOptions: any = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 18,
    minZoom: 0
  };

  ngOnInit(): void {
    this.loadGoogleMapsAPI();
  }

  loadGoogleMapsAPI(): void {
    // Verifica se já existe
    if (typeof google !== 'undefined' && google.maps) {
      this.isGoogleMapsLoaded = true;
      this.configureMapOptions();
      return;
    }

    // Carrega a API do Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      this.isGoogleMapsLoaded = true;
      this.configureMapOptions();
    };

    script.onerror = () => {
      console.warn('Falha ao carregar Google Maps API. Verifique se a API key está configurada corretamente.');
    };

    document.head.appendChild(script);
  }

  configureMapOptions(): void {
    if (typeof google !== 'undefined' && google.maps) {
      this.mapOptions = {
        ...this.mapOptions,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'all',
            stylers: [
              { saturation: -20 },
              { lightness: 10 }
            ]
          }
        ]
      };
    }
  }

  openInfoWindow(marker: any, location: EventLocation): void {
    if (marker && marker.infoWindow) {
      marker.infoWindow.open();
    }
  }

  zoomToLocation(location: EventLocation): void {
    if (this.map && this.map.googleMap) {
      // Centraliza o mapa na localização
      this.center = location.position;

      // Faz zoom para o local (zoom maior para focar no local)
      this.zoom = 16;

      // Aplica as mudanças ao mapa do Google
      this.map.googleMap.setCenter(location.position);
      this.map.googleMap.setZoom(16);

      // Adiciona uma animação suave
      this.map.googleMap.panTo(location.position);
    }
  }

  resetMapView(): void {
    if (this.map && this.map.googleMap) {
      // Volta para a visão geral de Uberlândia
      const uberlandiaCenter = { lat: -18.9113, lng: -48.2622 };
      this.center = uberlandiaCenter;
      this.zoom = 12;

      this.map.googleMap.setCenter(uberlandiaCenter);
      this.map.googleMap.setZoom(12);
      this.map.googleMap.panTo(uberlandiaCenter);
    }
  }
}
