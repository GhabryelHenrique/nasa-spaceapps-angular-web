/**
 * Modelo compartilhado pelas edições de desafios (2025, 2026, ...).
 *
 * As duas edições usam a mesma estrutura de card, mas `tags` significa coisas
 * diferentes em cada uma: em 2025 a NASA listava habilidades sugeridas, em 2026
 * passou a listar temas (Subjects). Por isso o rótulo mostrado no card vem da
 * edição (`ChallengeEdition.tagsLabel`), não do desafio.
 */

export interface ChallengeDifficulty {
  id: number;
  name: string;
  slug: 'beginneryouth' | 'intermediate' | 'advanced';
  color: string;
}

export interface Challenge {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: {
    url: string;
    alt: string;
  };
  /** Tags de dificuldade da NASA — são apenas um guia, não uma restrição. */
  categories: ChallengeDifficulty[];
  /** Habilidades (2025) ou temas (2026), conforme o `tagsLabel` da edição. */
  tags: string[];
  slug: string;
}

export interface ChallengeEdition {
  year: number;
  /** Rótulo das tags no card: "Habilidades Sugeridas" ou "Temas". */
  tagsLabel: string;
  challenges: Challenge[];
}

export const BEGINNER: ChallengeDifficulty = {
  id: 1, name: 'Iniciante/Jovem', slug: 'beginneryouth', color: '#2E96F5'
};
export const INTERMEDIATE: ChallengeDifficulty = {
  id: 2, name: 'Intermediário', slug: 'intermediate', color: '#E43700'
};
export const ADVANCED: ChallengeDifficulty = {
  id: 3, name: 'Avançado', slug: 'advanced', color: '#8E1100'
};
