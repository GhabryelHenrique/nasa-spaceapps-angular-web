import { NomineeTeam } from '../../services/global-nominees.service';

/**
 * Legenda sugerida para o carrossel dos Global Nominees. Como as dos desafios e
 * das palestras, é um ponto de partida editável no modal.
 */

const HASHTAGS = [
  '#NASASpaceApps',
  '#SpaceApps2026',
  '#NASASpaceAppsUberlandia',
  '#GlobalNominees',
  '#Uberlandia',
  '#Udi',
  '#Hackathon',
  '#Tecnologia'
];

export function buildNomineesCaption(nominees: NomineeTeam[], year: number): string {
  const teams = nominees.map(nominee => {
    const project = nominee.project && nominee.project !== nominee.name ? ` — ${nominee.project}` : '';
    const challenge = nominee.challenge ? `\n   🎯 ${nominee.challenge}` : '';
    return `🚀 ${nominee.name}${project}${challenge}`;
  });

  return [
    `🏆 UBERLÂNDIA TEM ${nominees.length} GLOBAL NOMINEES NO NASA SPACE APPS ${year}!`,
    'Os juízes locais escolheram os projetos que vão representar a nossa sede na avaliação ' +
      'global da NASA. Conheça os indicados:',
    teams.join('\n\n'),
    'Agora os projetos seguem para a avaliação de especialistas da NASA e das agências parceiras, ' +
      'que escolhem os Global Finalists. Parabéns a todos os times — e obrigado a cada participante, ' +
      'mentor, juiz e voluntário que fez o hackathon de 14 e 15 de novembro acontecer! 💙',
    '👉 Arraste para o lado para ver cada projeto e marque quem você conhece!',
    HASHTAGS.join(' ')
  ].join('\n\n');
}
