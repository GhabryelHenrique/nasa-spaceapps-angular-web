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
      title: 'Universidade Federal de Uberlândia - UFU',
      info: 'Polo principal NASA Space Apps Challenge Uberlândia'
    },
    {
      position: { lat: -18.909529, lng: -48.248573 },
      title: 'MTI',
      info: 'Polo de capacitação dos mentores do NASA Space Apps Challenge'
    },
    // {
    //   position: { lat: -18.956634, lng: -48.271558 },
    //   title: 'Unitri',
    //   info: 'Local de apoio para networking e atividades complementares do NASA Space Apps Challenge'
    // },
    {
      position: { lat: -18.931272, lng: -48.290163 },
      title: 'Colegio Nacional',
      info: 'Local de apoio para networking e atividades complementares do NASA Space Apps Challenge'
    },
    {
      position: { lat: -18.924682961805495, lng: -48.271471290864355 },
      title: 'UDI Tech',
      info: 'Local de apoio para networking e atividades complementares do NASA Space Apps Challenge'
    },
    {
      position: { lat: -18.95224632870345, lng: -48.270526751599455 },
      title: 'Cyber Gênios',
      info: 'Local de apoio para networking e atividades complementares do NASA Space Apps Challenge'
    },
    {
      position: { lat: -18.951666, lng: -48.232789 },
      title: 'Portão 3',
      info: 'Local de apoio para networking e atividades complementares do NASA Space Apps Challenge'
    },
    {
      position: { lat: -18.924301, lng: -48.232747 },
      title: 'Asa Coworking',
      info: 'Local de apoio para networking e atividades complementares do NASA Space Apps Challenge'
    },
    {
      position: { lat: -18.9329, lng: -48.279937 },
      title: 'IFTM - Campus Centro',
      info: 'Local de apoio para networking e atividades complementares do NASA Space Apps Challenge'
    }
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
