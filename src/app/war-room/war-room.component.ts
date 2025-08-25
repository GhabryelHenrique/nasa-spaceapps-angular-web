import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { localEvents } from '../shared/data/localEvents.data';
import { CityParticipation, LocalEvent } from '../shared/interfaces/local-event.interface';

@Component({
  selector: 'app-war-room',
  imports: [CommonModule],
  templateUrl: './war-room.component.html',
  styleUrl: './war-room.component.scss'
})
export class WarRoomComponent implements OnInit {
  cities: CityParticipation[] = [];
  sortOrder: 'desc' | 'asc' = 'desc';
  totalParticipants = 0;
  totalCities = 0;

  ngOnInit() {
    this.loadCities();
  }

  private loadCities() {
    this.cities = localEvents.map((event: any) => ({
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
}
