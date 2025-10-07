import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import * as otherCitiesData from '../../assets/data/otherCitiesTeams.json';
import * as uberlandiaData from '../../assets/data/teams.json';

export interface CityTeamStats {
  locationName: string;
  locationId: string;
  totalTeams: number;
  submittedProjects: number;
  submissionRate: number;
  country?: string;
  isBrazilian?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class OtherCitiesTeamsService {
  // Lista completa de todas as cidades brasileiras participantes do NASA Space Apps Challenge 2025
  private readonly brazilianCities = [
    'Aracaju',
    'Balneário Camboriú',
    'Belém',
    'Bento Gonçalves',
    'Boa Vista',
    'Botucatu',
    'Campina Grande',
    'Campinas',
    'Campo Mourão',
    'Campos dos Goytacazes',
    'Caxias do Sul',
    'Cianorte',
    'Contagem',
    'Cuiaba',
    'Florianopolis',
    'Fortaleza',
    'Goiânia',
    'Guarulhos',
    'Itajubá',
    'Jaguariúna',
    'João Pessoa',
    'Juazeiro do Norte',
    'Juiz de Fora',
    'Lajeado',
    'Limeira',
    'Londrina',
    'Maceió',
    'Manaus',
    'Mariana',
    'Maringá',
    'Marília',
    'Niterói',
    'Petrolina',
    'Pouso Alegre',
    'Poços de Caldas',
    'Recife',
    'Ribeirao Preto',
    'Rio de Janeiro',
    'Salvador',
    'Santa Cruz das Palmeiras',
    'Santo André',
    'Sorocaba',
    'São Gonçalo',
    'São José do Rio Preto',
    'São José dos Campos',
    'São João da Boa Vista',
    'São Luis',
    'São Paulo',
    'Tefé',
    'Uberlândia',
    'Vilhena',
    'Vitória da Conquista',
  ];

  /**
   * Retorna estatísticas de times por cidade (incluindo Uberlândia e outras cidades)
   */
  getTeamStatsByCity(): Observable<CityTeamStats[]> {
    const cityStats: CityTeamStats[] = [];

    // Adiciona dados de Uberlândia
    if (
      uberlandiaData.data &&
      Array.isArray(uberlandiaData.data) &&
      uberlandiaData.data.length > 0
    ) {
      const uberlandiaCityData = uberlandiaData.data[0];
      if (uberlandiaCityData.teams && uberlandiaCityData.teams.edges) {
        const totalTeams =
          uberlandiaCityData.teams.totalCount ||
          uberlandiaCityData.teams.edges.length;
        const submittedProjects = uberlandiaCityData.teams.edges.filter(
          (edge: any) => edge.node.projectSubmitted === true
        ).length;

        cityStats.push({
          locationName: uberlandiaCityData.locationName || 'Uberlândia',
          locationId: uberlandiaCityData.locationId || '',
          totalTeams,
          submittedProjects,
          submissionRate:
            totalTeams > 0 ? (submittedProjects / totalTeams) * 100 : 0,
        });
      }
    }

    // Adiciona dados das outras cidades
    if (otherCitiesData.data && Array.isArray(otherCitiesData.data)) {
      otherCitiesData.data.forEach((cityData: any) => {
        if (cityData.teams && cityData.teams.edges) {
          const totalTeams =
            cityData.teams.totalCount || cityData.teams.edges.length;
          const submittedProjects = cityData.teams.edges.filter(
            (edge: any) => edge.node.projectSubmitted === true
          ).length;

          cityStats.push({
            locationName: cityData.locationName || 'Unknown',
            locationId: cityData.locationId || '',
            totalTeams,
            submittedProjects,
            submissionRate:
              totalTeams > 0 ? (submittedProjects / totalTeams) * 100 : 0,
          });
        }
      });
    }

    // Ordena por quantidade de times (descendente)
    cityStats.sort((a, b) => b.totalTeams - a.totalTeams);

    return of(cityStats).pipe(delay(100));
  }

  /**
   * Retorna todos os times de todas as outras cidades
   */
  getAllTeams(): Observable<any[]> {
    let allTeams: any[] = [];

    if (otherCitiesData.data && Array.isArray(otherCitiesData.data)) {
      otherCitiesData.data.forEach((cityData: any) => {
        if (cityData.teams && cityData.teams.edges) {
          allTeams = allTeams.concat(
            cityData.teams.edges.map((edge: any) => ({
              ...edge.node,
              cityName: cityData.locationName,
            }))
          );
        }
      });
    }

    return of(allTeams).pipe(delay(100));
  }

  /**
   * Retorna times de uma cidade específica
   */
  getTeamsByCity(cityName: string): Observable<any[]> {
    let cityTeams: any[] = [];

    if (otherCitiesData.data && Array.isArray(otherCitiesData.data)) {
      const cityData = otherCitiesData.data.find(
        (city: any) =>
          city.locationName?.toLowerCase() === cityName.toLowerCase()
      );

      if (cityData && cityData.teams && cityData.teams.edges) {
        cityTeams = cityData.teams.edges.map((edge: any) => edge.node);
      }
    }

    return of(cityTeams).pipe(delay(100));
  }

  /**
   * Verifica se uma cidade é brasileira
   */
  private isBrazilianCity(cityName: string): boolean {
    return this.brazilianCities.some(
      (city) => city.toLowerCase() === cityName.toLowerCase()
    );
  }

  /**
   * Retorna apenas cidades brasileiras
   */
  getBrazilianCitiesStats(): Observable<CityTeamStats[]> {
    return this.getTeamStatsByCity().pipe(
      map((cities) =>
        cities
          .filter((city) => this.isBrazilianCity(city.locationName))
          .map((city) => ({
            ...city,
            isBrazilian: true,
            country: 'Brasil',
          }))
      )
    );
  }

  /**
   * Retorna apenas cidades internacionais (não brasileiras)
   */
  getWorldCitiesStats(): Observable<CityTeamStats[]> {
    return this.getTeamStatsByCity().pipe(
      map((cities) =>
        cities
          .filter((city) => !this.isBrazilianCity(city.locationName))
          .map((city) => ({
            ...city,
            isBrazilian: false,
          }))
      )
    );
  }
}
