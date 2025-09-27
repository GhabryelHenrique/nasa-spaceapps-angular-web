import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CityParticipation } from '../../../shared/interfaces/local-event.interface';

export interface CountryStats {
  country: string;
  count: number;
  flag: string;
}

@Component({
  selector: 'app-participants-by-country-chart',
  imports: [CommonModule],
  templateUrl: './participants-by-country-chart.component.html',
  styleUrl: './participants-by-country-chart.component.scss'
})
export class ParticipantsByCountryChartComponent implements OnInit, OnChanges {
  @Input() cities: CityParticipation[] = [];
  public countryStats: CountryStats[] = [];

  ngOnInit() {
    this.groupCitiesByCountry();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cities'] && !changes['cities'].firstChange) {
      this.groupCitiesByCountry();
    }
  }

  private groupCitiesByCountry() {
    if (!this.cities || this.cities.length === 0) {
      this.countryStats = [];
      return;
    }

    const countryMap = new Map<string, number>();

    this.cities.forEach(city => {
      const currentCount = countryMap.get(city.country) || 0;
      countryMap.set(city.country, currentCount + city.registrations);
    });

    this.countryStats = Array.from(countryMap.entries())
      .map(([country, count]) => ({
        country,
        count,
        flag: this.getCountryFlag(country)
      }))
      .sort((a, b) => b.count - a.count);
  }

  private getCountryFlag(country: string): string {
    const flagMap: { [key: string]: string } = {
      'Brazil': '🇧🇷',
      'Brasil': '🇧🇷',
      'United States': '🇺🇸',
      'USA': '🇺🇸',
      'Canada': '🇨🇦',
      'Mexico': '🇲🇽',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Colombia': '🇨🇴',
      'Peru': '🇵🇪',
      'Venezuela': '🇻🇪',
      'Ecuador': '🇪🇨',
      'Bolivia': '🇧🇴',
      'Paraguay': '🇵🇾',
      'Uruguay': '🇺🇾',
      'Portugal': '🇵🇹',
      'Spain': '🇪🇸',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Italy': '🇮🇹',
      'United Kingdom': '🇬🇧',
      'India': '🇮🇳',
      'China': '🇨🇳',
      'Japan': '🇯🇵',
      'Australia': '🇦🇺',
      'South Africa': '🇿🇦'
    };

    return flagMap[country] || '🌍';
  }

  public getTopCountries(): CountryStats[] {
    return this.countryStats.slice(0, 5);
  }

  public getTotalParticipants(): number {
    return this.countryStats.reduce((sum, country) => sum + country.count, 0);
  }

  public trackByCountry(index: number, country: CountryStats): string {
    return country.country;
  }
}