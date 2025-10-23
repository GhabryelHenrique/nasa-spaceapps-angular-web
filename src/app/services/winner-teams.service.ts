import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WinnerTeam, WinnerTeamsData } from '../shared/data/winner-teams.data';
import * as winnerTeamsData from '../../assets/data/winner-teams.json';

@Injectable({
  providedIn: 'root'
})
export class WinnerTeamsService {
  private winnerTeams: WinnerTeam[] = (winnerTeamsData as any).teams || [];

  constructor() {}

  /**
   * Retorna todas as equipes vencedoras
   */
  getAllWinnerTeams(): Observable<WinnerTeam[]> {
    return of(this.winnerTeams);
  }

  /**
   * Retorna uma equipe vencedora específica pelo slug
   */
  getWinnerTeamBySlug(slug: string): Observable<WinnerTeam | undefined> {
    const team = this.winnerTeams.find(t => t.slug === slug);
    return of(team);
  }

  /**
   * Retorna uma equipe vencedora específica pelo ID
   */
  getWinnerTeamById(id: string): Observable<WinnerTeam | undefined> {
    const team = this.winnerTeams.find(t => t.id === id);
    return of(team);
  }

  /**
   * Retorna equipes vencedoras por ano
   */
  getWinnerTeamsByYear(year: number): Observable<WinnerTeam[]> {
    const teams = this.winnerTeams.filter(t => t.awardYear === year);
    return of(teams);
  }

  /**
   * Retorna equipes vencedoras por categoria de prêmio
   */
  getWinnerTeamsByCategory(category: string): Observable<WinnerTeam[]> {
    const teams = this.winnerTeams.filter(t =>
      t.awardCategory.toLowerCase().includes(category.toLowerCase())
    );
    return of(teams);
  }

  /**
   * Retorna todas as categorias de prêmio disponíveis
   */
  getAllAwardCategories(): Observable<string[]> {
    const categories = [...new Set(this.winnerTeams.map(t => t.awardCategory))];
    return of(categories);
  }

  /**
   * Retorna todos os anos com equipes vencedoras
   */
  getAllAwardYears(): Observable<number[]> {
    const years = [...new Set(this.winnerTeams.map(t => t.awardYear))].sort((a, b) => b - a);
    return of(years);
  }
}
