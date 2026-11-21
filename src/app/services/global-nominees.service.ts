import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { getChallengeEdition } from '../shared/data/challenges.data';
import {
  GLOBAL_NOMINEES_2026,
  GLOBAL_NOMINEES_YEAR,
  GlobalNominee
} from '../shared/data/global-nominees-2026.data';
import { Team } from '../shared/data/teams.data';
import { TeamsService } from './teams.service';

/** Um indicado já cruzado com a página oficial do time. */
export interface NomineeTeam extends GlobalNominee {
  /** Nome do projeto entregue no hackathon. */
  project?: string;
  /** Resumo do projeto, como o time escreveu (em geral em inglês). */
  summary?: string;
  /** Título do desafio, já traduzido quando ele está em `challenges-2026.data.ts`. */
  challenge?: string;
  /** Recorte 300×250 — leve, para a home. */
  thumbnail?: string;
  /** Imagem original enviada pelo time — nítida no post de 1080px. */
  image?: string;
}

/**
 * Junta a lista de indicados (`GLOBAL_NOMINEES_2026`) com os dados do
 * teams.json da edição. Se o arquivo falhar ou um time sumir dele, o indicado
 * continua aparecendo — só sem projeto, desafio e imagem.
 */
@Injectable({ providedIn: 'root' })
export class GlobalNomineesService {
  private readonly teams = inject(TeamsService);

  private readonly nominees$: Observable<NomineeTeam[]> = this.teams.getTeams(GLOBAL_NOMINEES_YEAR).pipe(
    map(response => response.data?.[0]?.teams.edges.map(edge => edge.node) ?? []),
    catchError(() => of<Team[]>([])),
    map(teams => GLOBAL_NOMINEES_2026.map(nominee => this.resolve(nominee, teams))),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  /** Indicados na ordem do anúncio, já com os dados da página oficial. */
  nominees(): Observable<NomineeTeam[]> {
    return this.nominees$;
  }

  private resolve(nominee: GlobalNominee, teams: Team[]): NomineeTeam {
    const path = `/find-a-team/${nominee.slug}/`;
    const team = teams.find(item => item.meta?.relativeUrl?.endsWith(path));
    if (!team) return { ...nominee };

    const challengeSlug = team.challengeDetails?.meta?.slug;
    const translated = getChallengeEdition(GLOBAL_NOMINEES_YEAR).challenges
      .find(challenge => challenge.slug === challengeSlug)?.title;

    return {
      ...nominee,
      project: team.projectDetails?.name?.trim() || undefined,
      summary: team.projectDetails?.summary?.trim() || undefined,
      challenge: translated ?? team.challengeDetails?.title,
      thumbnail: team.featuredImage?.rendition?.fullUrl,
      image: team.featuredImage?.meta?.downloadUrl ?? team.featuredImage?.rendition?.fullUrl
    };
  }
}
