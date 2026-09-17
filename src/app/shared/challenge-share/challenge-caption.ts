import { Challenge, CHALLENGES_DATA, CURRENT_CHALLENGE_YEAR } from '../data/challenges.data';

/**
 * Legenda sugerida para o post do desafio no Instagram.
 *
 * É um ponto de partida editável, não um texto fechado: a ideia é o pessoal de
 * comunicação ajustar o tom e manter o bloco final (datas, regra do enunciado e
 * hashtags), que é o que se repete em todos os posts da série.
 */

const HASHTAGS = [
  '#NASASpaceApps',
  '#SpaceApps2026',
  '#TheNextFrontier',
  '#NASASpaceAppsUberlandia',
  '#Uberlandia',
  '#Udi',
  '#Hackathon',
  '#Inovacao',
  '#Tecnologia',
  '#Espaco',
  '#DadosAbertos',
  '#Programacao',
  '#Ciencia'
];

export function buildInstagramCaption(
  challenge: Challenge,
  year: number = CURRENT_CHALLENGE_YEAR
): string {
  const areas = challenge.tags.join(' · ');
  const levels = challenge.categories.map(category => category.name).join(' · ');

  const blocks = [
    `🚀 DESAFIO ${year} — ${challenge.title.toUpperCase()}`,
    challenge.excerpt
  ];

  if (areas) blocks.push(`🧭 Áreas: ${areas}`);
  if (levels) blocks.push(`🎯 Nível sugerido: ${levels} (é só um guia — qualquer pessoa pode encarar)`);

  blocks.push(
    `Os ${CHALLENGES_DATA.length} desafios do NASA Space Apps Challenge ${year} já estão no ar! ` +
      'Escolha o seu, monte uma equipe de até 6 pessoas e prepare-se para 48 horas de maratona ' +
      'nos dias 14 e 15 de novembro, aqui em Uberlândia.',
    '📄 Enunciado completo, com os conjuntos de dados da NASA: 28 de outubro\n' +
      '✍️ Inscrição gratuita no site da NASA — link na bio\n' +
      '⚠️ Vale escolher o desafio e formar a equipe agora; desenvolver o projeto, só no hackathon',
    HASHTAGS.join(' ')
  );

  return blocks.join('\n\n');
}

/**
 * Legenda única para o kit inteiro — um post em carrossel com todos os desafios,
 * em vez de uma legenda por card.
 */
export function buildCollectionCaption(year: number = CURRENT_CHALLENGE_YEAR): string {
  const areas = [...new Set(CHALLENGES_DATA.flatMap(challenge => challenge.tags))].join(' · ');

  return [
    `🚀 OS ${CHALLENGES_DATA.length} DESAFIOS DO NASA SPACE APPS CHALLENGE ${year} JÁ ESTÃO NO AR!`,
    'A NASA divulgou os resumos dos desafios da edição The Next Frontier — e tem missão ' +
      `para todo tipo de gente: ${areas}.`,
    'Arrasta pro lado e escolhe o teu 👉',
    'Como entrar nessa:\n' +
      `1️⃣ Escolha um dos ${CHALLENGES_DATA.length} desafios\n` +
      '2️⃣ Monte uma equipe de até 6 pessoas\n' +
      '3️⃣ Faça a inscrição gratuita no site da NASA — link na bio',
    '📅 14 e 15 de novembro · Uberlândia (MG)\n' +
      '📄 Enunciados completos, com os conjuntos de dados da NASA: 28 de outubro\n' +
      '⚠️ Escolher desafio e formar equipe pode ser agora; desenvolver o projeto, só no hackathon',
    'Em 2025 Uberlândia foi a maior sede do Hemisfério Ocidental, com 1400+ participantes ' +
      'e 10 Global Nominees. Em 2026 a missão recomeça — e pode ter você nela.',
    HASHTAGS.join(' ')
  ].join('\n\n');
}
