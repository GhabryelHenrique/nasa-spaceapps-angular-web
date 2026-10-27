import { Speaker } from '../data/talks.data';

/**
 * Os dois posts de divulgação de cada palestra: um apresenta quem fala (foto em
 * destaque, como a arte da Camilla Martins) e o outro, o tema da palestra.
 * Os tamanhos de imagem são os mesmos dos desafios (`SHARE_FORMATS`).
 */

export type TalkPostKind = 'speaker' | 'talk';

export interface TalkPostOption {
  id: TalkPostKind;
  label: string;
  hint: string;
}

export const TALK_POST_KINDS: TalkPostOption[] = [
  { id: 'speaker', label: 'Palestrante', hint: 'Foto e credenciais' },
  { id: 'talk', label: 'Palestra', hint: 'Tema e programação' }
];

/**
 * Chamada do post da pessoa, concordando com os pronomes informados no
 * formulário. Sem pronomes, fica no neutro ("palestra confirmada").
 */
export function confirmedSpeakerLabel(speaker: Speaker): string {
  const pronoun = speaker.pronouns?.split('/')[0].trim().toLowerCase();
  if (pronoun === 'ela') return 'PALESTRANTE CONFIRMADA';
  if (pronoun === 'ele') return 'PALESTRANTE CONFIRMADO';
  return 'PALESTRA CONFIRMADA';
}
