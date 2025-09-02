import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, catchError, tap, switchMap, startWith } from 'rxjs/operators';

export interface TeamData {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  desiredSkills: string;
  languages: string;
  projectSubmitted: boolean;
  challengeDetails?: {
    id: string;
    title: string;
    excerpt: string;
  };
  locationDetails?: {
    id: string;
    title: string;
    displayName: string;
    country: string;
  };
  memberships: Array<{
    user: string;
    userDetails: {
      id: string;
      fullName: string;
      username: string;
      country: string;
    };
  }>;
  projectDetails?: {
    id: string;
    name: string;
    summary: string;
    demoLink?: string;
    projectLink?: string;
    isSubmitted: boolean;
  };
}

export interface LocalEventData {
  type: string;
  properties: {
    id: string;
    title: string;
    displayName: string;
    country: string;
    cachedRegistrations: number;
    eventType: string;
    registrationEnabled: boolean;
    isHostEvent: boolean;
    meta: {
      htmlUrl: string;
    };
  };
}

export interface NasaApiResponse {
  teams: {
    totalCount: number;
    edges: Array<{
      cursor: string;
      node: TeamData;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class NasaTeamsService {
  private readonly teamsJsonPath = '/assets/data/teams.json';
  private readonly localEventsJsonPath = '/assets/data/localEvents.json';

  // BehaviorSubjects para dados em tempo real
  private teamsSubject = new BehaviorSubject<TeamData[]>([]);
  private localEventsSubject = new BehaviorSubject<LocalEventData[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Observables públicos
  public teams$ = this.teamsSubject.asObservable();
  public localEvents$ = this.localEventsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {
    this.startAutoRefresh();
  }


  fetchTeams(): Observable<TeamData[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<any>(this.teamsJsonPath).pipe(
      map(response => {
        if (!response?.data?.[0]?.teams?.edges) {
          throw new Error('Dados dos times não encontrados no arquivo JSON');
        }

        return response.data[0].teams.edges.map((edge: any) => ({
          id: edge.node.id,
          title: edge.node.title,
          excerpt: edge.node.excerpt || '',
          description: edge.node.description || '',
          desiredSkills: edge.node.desiredSkills || [],
          languages: edge.node.languages || [],
          projectSubmitted: edge.node.projectSubmitted || false,
          challengeDetails: edge.node.challengeDetails,
          locationDetails: edge.node.locationDetails,
          memberships: edge.node.memberships || [],
          projectDetails: edge.node.projectDetails
        }));
      }),
      tap(teams => {
        this.teamsSubject.next(teams);
        this.loadingSubject.next(false);
        console.log(`✅ Times carregados do arquivo local: ${teams.length} teams`);
      }),
      catchError(error => {
        console.error('❌ Erro ao carregar times do arquivo local:', error);
        this.errorSubject.next(`Erro ao carregar times: ${error.message}`);
        this.loadingSubject.next(false);
        this.teamsSubject.next([]);
        return this.teamsSubject.asObservable();
      })
    );
  }

  fetchLocalEvents(): Observable<LocalEventData[]> {
    return this.http.get<any>(this.localEventsJsonPath).pipe(
      map(response => {
        if (!response?.data) {
          throw new Error('Dados dos eventos não encontrados no arquivo JSON');
        }

        return response.data.map((item: any) => ({
          type: item.node.type,
          properties: {
            id: item.node.properties.id,
            title: item.node.properties.title,
            displayName: item.node.properties.displayName,
            country: item.node.properties.country,
            cachedRegistrations: item.node.properties.cachedRegistrations,
            eventType: item.node.properties.eventType,
            registrationEnabled: item.node.properties.registrationEnabled,
            isHostEvent: item.node.properties.isHostEvent,
            meta: {
              htmlUrl: item.node.properties.meta?.htmlUrl
            }
          }
        }));
      }),
      tap(events => {
        this.localEventsSubject.next(events);
        console.log(`✅ Eventos locais carregados do arquivo local: ${events.length} eventos`);
      }),
      catchError(error => {
        console.error('❌ Erro ao carregar eventos locais do arquivo:', error);
        this.localEventsSubject.next([]);
        return this.localEventsSubject.asObservable();
      })
    );
  }


  // Carrega dados iniciais (sem auto-refresh para arquivos locais)
  private startAutoRefresh(): void {
    // Carrega dados inicialmente
    this.fetchTeams().subscribe();
    this.fetchLocalEvents().subscribe();
  }

  // Métodos públicos para refresh manual
  refreshTeams(): void {
    this.fetchTeams().subscribe();
  }

  refreshLocalEvents(): void {
    this.fetchLocalEvents().subscribe();
  }

  refreshAll(): void {
    this.refreshTeams();
    this.refreshLocalEvents();
  }

  // Getter para estatísticas
  getTeamsStats(): Observable<{total: number, withProjects: number, uberlandia: number}> {
    return this.teams$.pipe(
      map(teams => ({
        total: teams.length,
        withProjects: teams.filter(team => team.projectSubmitted).length,
        uberlandia: teams.filter(team =>
          team.locationDetails?.displayName?.toLowerCase().includes('uberlândia') ||
          team.locationDetails?.displayName?.toLowerCase().includes('uberlandia')
        ).length
      }))
    );
  }
}
