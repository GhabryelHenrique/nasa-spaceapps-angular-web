/**
 * Global Nominees de Uberlândia no NASA Space Apps Challenge 2026: os projetos
 * que os juízes locais indicaram para a avaliação global da NASA.
 *
 * Aqui fica só o nome de divulgação e o link oficial de cada time, na ordem em
 * que a organização anunciou. Projeto, desafio e imagem vêm do
 * `assets/data/2026/teams.json` (atualizado automaticamente), cruzados pelo
 * `slug` no `GlobalNomineesService` — a home e o post do Instagram se montam a
 * partir dessa lista.
 */

export const GLOBAL_NOMINEES_YEAR = 2026;

export interface GlobalNominee {
  /** Nome como a organização divulga (pode diferir da grafia da página oficial). */
  name: string;
  /** Slug da página do time em spaceappschallenge.org — a chave do cruzamento com o teams.json. */
  slug: string;
  url: string;
}

const teamUrl = (slug: string) => `https://www.spaceappschallenge.org/${GLOBAL_NOMINEES_YEAR}/find-a-team/${slug}/`;

export const GLOBAL_NOMINEES_2026: GlobalNominee[] = [
  { name: 'MINEIRØ', slug: 'mineiro', url: teamUrl('mineiro') },
  { name: 'cavalodetroia.exe', slug: 'cavalodetroiaexe', url: teamUrl('cavalodetroiaexe') },
  { name: 'xBigDevs', slug: 'xbigdevs1', url: teamUrl('xbigdevs1') },
  { name: 'Lovelace', slug: 'lovelace5', url: teamUrl('lovelace5') },
  { name: 'Blue Marble Records', slug: 'blue-marble-records', url: teamUrl('blue-marble-records') },
  { name: 'Lumia', slug: 'lumia', url: teamUrl('lumia') },
  { name: 'Code and Cheese', slug: 'code-and-cheese', url: teamUrl('code-and-cheese') }
];
