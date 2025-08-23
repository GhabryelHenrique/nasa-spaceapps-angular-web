import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { TeamsResponse, realApiResponse } from '../shared/data/teams.data';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {

  constructor() {}

  getTeams(
    first: number = 20,
    after: string = '',
    q: string = ''
  ): Observable<TeamsResponse> {
    // Usa dados reais da API com fallback para mock
    return this.getRealTeamsData(first, after, q);
  }

  getRealTeamsData(
    first: number = 100,
    after: string = '',
    q: string = ''
  ): Observable<TeamsResponse> {
    // Filtra teams baseado na query de busca se fornecida
    let filteredEdges = realApiResponse.data[0].teams.edges;
    if (q.trim()) {
      filteredEdges = realApiResponse.data[0].teams.edges.filter(
        (edge) =>
          edge.node.title.toLowerCase().includes(q.toLowerCase()) ||
          edge.node.excerpt?.toLowerCase().includes(q.toLowerCase()) ||
          (edge.node.challengeDetails?.title &&
            edge.node.challengeDetails.title
              .toLowerCase()
              .includes(q.toLowerCase()))
      );
    }

    const response: TeamsResponse = {
      data: [
        {
          teams: {
            pageInfo: realApiResponse.data[0].teams.pageInfo,
            totalCount: filteredEdges.length,
            edges: filteredEdges.slice(0, first) as any,
          },
        },
      ],
    };

    // Simula delay da API
    return of(response).pipe(delay(500));
  }
}
