import { CURRENT_CHALLENGE_YEAR } from '../data/challenges.data';
import { Speaker, TALKS_PARTNER, Talk } from '../data/talks.data';
import { TalkPostKind, confirmedSpeakerLabel } from './talk-share.model';

/**
 * Legendas sugeridas para os posts das palestras. Como nas dos desafios, são um
 * ponto de partida editável: o bloco final (data, local, ingresso e hashtags)
 * é o que se repete em todos os posts da série.
 */

const HASHTAGS = [
  '#NASASpaceApps',
  '#SpaceApps2026',
  '#NASASpaceAppsUberlandia',
  '#SemanaDePalestras',
  '#Uberlandia',
  '#Udi',
  '#Hackathon',
  '#Tecnologia'
];

const PARTNER_HASHTAGS = ['#GDG', '#GDGUberlandia', '#GoogleDevelopers'];

export function buildTalkPostCaption(
  talk: Talk,
  kind: TalkPostKind,
  year: number = CURRENT_CHALLENGE_YEAR
): string {
  return kind === 'speaker' ? buildSpeakerCaption(talk, year) : buildTalkCaption(talk, year);
}

/** Post da pessoa: quem é, o que já fez e a palestra que traz. */
function buildSpeakerCaption(talk: Talk, year: number): string {
  const { speaker } = talk;
  const alias = speaker.alias ? ` — ${speaker.alias.toUpperCase()}` : '';

  const blocks = [`🎤 ${confirmedSpeakerLabel(speaker)}: ${speaker.name.toUpperCase()}${alias}`];

  const profile = [speakerLine(speaker), ...speaker.credentials.map(credential => `⭐ ${credential}`)];
  blocks.push(profile.join('\n'));

  // Sem credenciais curtas, a mini-bio enviada no formulário apresenta a pessoa.
  if (speaker.credentials.length === 0) blocks.push(speaker.bio);

  blocks.push(
    `Na semana de palestras do NASA Space Apps Uberlândia ${year}${partnerSuffix(talk)}, ` +
      `o esquenta para o hackathon de 14 e 15 de novembro, o tema é:\n🎙️ "${talk.title}"`,
    scheduleBlock(talk)
  );

  const handle = instagramHandle(speaker);
  if (handle) blocks.push(`📲 Segue lá: ${handle}`);

  blocks.push(hashtags(talk));
  return blocks.join('\n\n');
}

/** Post da palestra: o tema, o que se aprende e quem apresenta. */
function buildTalkCaption(talk: Talk, year: number): string {
  const { speaker } = talk;

  const blocks = [
    `🎙️ NA PROGRAMAÇÃO DA SEMANA DE PALESTRAS: "${talk.title.toUpperCase()}"`,
    talk.summary
  ];

  if (talk.takeaways.length > 0) {
    blocks.push(['O que você leva:', ...talk.takeaways.map(item => `✅ ${item}`)].join('\n'));
  }
  if (talk.stack.length > 0) blocks.push(`🧰 Ferramentas: ${talk.stack.join(' · ')}`);
  if (talk.topics.length > 0) {
    blocks.push(['Útil para o hackathon:', ...talk.topics.map(topic => `💡 ${topic}`)].join('\n'));
  }

  const alias = speaker.alias ? ` (${speaker.alias})` : '';
  blocks.push(
    `👤 Com ${speaker.name}${alias} — ${speakerLine(speaker)}`,
    `Uma realização do NASA Space Apps Uberlândia ${year}${partnerSuffix(talk)}: ` +
      'o esquenta para o hackathon de 14 e 15 de novembro.',
    scheduleBlock(talk),
    hashtags(talk)
  );

  return blocks.join('\n\n');
}

function speakerLine(speaker: Speaker): string {
  return [speaker.role, speaker.organization, speaker.origin?.label ?? speaker.city]
    .filter(Boolean)
    .join(' · ');
}

function partnerSuffix(talk: Talk): string {
  return talk.withPartner ? `, em parceria com o ${TALKS_PARTNER.shortName}` : '';
}

function scheduleBlock(talk: Talk): string {
  const details = [talk.format, talk.mode, talk.level && `nível ${talk.level.toLowerCase()}`]
    .filter(Boolean)
    .join(' · ');
  const venue = talk.venue
    ? [talk.venue, talk.venueAddress, 'Uberlândia (MG)'].filter(Boolean).join(' - ')
    : 'Local divulgado em breve no WhatsApp e no Discord da sede';

  const lines = [`📅 ${talk.dayLabel} · ${talk.timeLabel}`, `📍 ${venue}`, `🗣️ ${details}`];
  lines.push(
    talk.ticketUrl
      ? '🎟️ Entrada gratuita — garanta seu ingresso no Sympla (link na bio)'
      : '🎟️ Entrada gratuita — inscrições em breve (link na bio)'
  );

  return lines.join('\n');
}

/** "@punkdodevops", a partir do link do Instagram informado pela pessoa. */
function instagramHandle(speaker: Speaker): string | null {
  const link = speaker.links.find(item => item.label.toLowerCase() === 'instagram');
  const user = link?.url.replace(/\/+$/, '').split('/').pop();
  return user ? `@${user}` : null;
}

/** Hashtags fixas + as áreas da palestra (#IA, #DevOps…). */
function hashtags(talk: Talk): string {
  const fromTags = talk.tags.map(
    tag => `#${tag.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]/g, '')}`
  );
  const all = [...HASHTAGS, ...(talk.withPartner ? PARTNER_HASHTAGS : []), ...fromTags];
  return [...new Set(all)].join(' ');
}
