import { GLOBAL_NOMINEES_2026 } from './global-nominees-2026.data';

/**
 * Números da edição 2026 do NASA Space Apps Uberlândia, depois do hackathon
 * (14 e 15/11). A home (hero e contagem regressiva) usa estes valores — altere
 * aqui, não nos templates.
 *
 * Fontes (dados da plataforma da NASA, puxados em 21/11/2026):
 * - inscritos: `cachedRegistrations` da sede em `assets/data/2026/localEvents.json`
 *   (bate com as 456 linhas do export de inscrições);
 * - times e projetos entregues: `assets/data/2026/latamTeams.json`
 *   (`totalTeams` e `submittedProjects`) — iguais ao `teams.json` da sede;
 * - ranking: Uberlândia é a 1ª das 45 sedes brasileiras nos três números.
 */
export const EDITION_2026_RESULTS = {
  year: 2026,
  registrations: 456,
  teams: 84,
  submittedProjects: 67,
  brazilianSites: 45,
  /** Posição entre as sedes brasileiras (inscritos, times e projetos). */
  brazilRank: 1,
  globalNominees: GLOBAL_NOMINEES_2026.length
} as const;

export interface ResultStat {
  icon: string;
  value: string;
  label: string;
}

/** Os números em destaque, na ordem em que aparecem na home. */
export const EDITION_2026_STATS: ResultStat[] = [
  { icon: 'ph ph-users-three', value: String(EDITION_2026_RESULTS.registrations), label: 'Inscritos em 2026' },
  { icon: 'ph ph-shooting-star', value: String(EDITION_2026_RESULTS.teams), label: 'Times formados' },
  { icon: 'ph ph-code', value: String(EDITION_2026_RESULTS.submittedProjects), label: 'Projetos entregues' },
  { icon: 'ph ph-medal', value: `#${EDITION_2026_RESULTS.brazilRank}`, label: 'Sede do Brasil' },
  { icon: 'ph ph-trophy', value: String(EDITION_2026_RESULTS.globalNominees), label: 'Global Nominees' }
];
