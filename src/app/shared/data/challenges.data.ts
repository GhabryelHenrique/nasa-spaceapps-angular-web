/**
 * Registro das edições de desafios.
 *
 * `/desafios` redireciona para a edição corrente; `/desafios/2025` e
 * `/desafios/2026` renderizam o mesmo componente, trocando só a edição.
 *
 * Calendário de 2026: os resumos saem em 17/09 e o enunciado completo (com os
 * conjuntos de dados da NASA) só em 28/10. Nenhuma equipe pode começar a
 * trabalhar antes do hackathon (14 e 15/11) — começar antes desclassifica.
 */

import { ChallengeEdition } from './challenge.model';
import { CHALLENGES_2025 } from './challenges-2025.data';
import { CHALLENGES_2026 } from './challenges-2026.data';

export * from './challenge.model';

/** Edição corrente — é para onde `/desafios` aponta. */
export const CURRENT_CHALLENGE_YEAR = 2026;

export const CHALLENGE_EDITIONS: ChallengeEdition[] = [
  { year: 2026, tagsLabel: 'Temas', challenges: CHALLENGES_2026 },
  { year: 2025, tagsLabel: 'Habilidades Sugeridas', challenges: CHALLENGES_2025 }
];

/** Anos disponíveis, do mais recente para o mais antigo — usado no seletor de edição. */
export const CHALLENGE_YEARS = CHALLENGE_EDITIONS.map(e => e.year);

export function getChallengeEdition(year: number): ChallengeEdition {
  return CHALLENGE_EDITIONS.find(e => e.year === year) ?? CHALLENGE_EDITIONS[0];
}

/** Página oficial do desafio no site do Space Apps. */
export function challengeDetailUrl(year: number, slug: string): string {
  return `https://www.spaceappschallenge.org/${year}/challenges/${slug}/`;
}

/**
 * Desafios da edição corrente. A seção da home mostra só a edição atual, então
 * importa isto em vez de resolver a edição por rota.
 */
export const CHALLENGES_DATA = getChallengeEdition(CURRENT_CHALLENGE_YEAR).challenges;
