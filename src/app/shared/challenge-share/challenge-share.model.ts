/**
 * Formatos de exportação do card de desafio para redes sociais.
 *
 * Os dois tamanhos que o Instagram aceita sem recortar: 4:5 no feed (o maior
 * espaço vertical do feed) e 9:16 nos stories.
 */

export type ShareFormatId = 'feed' | 'story';

export interface ShareFormat {
  id: ShareFormatId;
  label: string;
  hint: string;
  width: number;
  height: number;
  /** Altura da faixa da foto no topo do card. */
  photoHeight: number;
  /**
   * Margem inferior intocada. No story o Instagram cobre a base com a barra de
   * "enviar mensagem" — sem isso o rodapé do card fica escondido.
   */
  bottomSafe: number;
}

export const SHARE_FORMATS: ShareFormat[] = [
  {
    id: 'feed',
    label: 'Feed 4:5',
    hint: '1080 × 1350',
    width: 1080,
    height: 1350,
    photoHeight: 600,
    bottomSafe: 0
  },
  {
    id: 'story',
    label: 'Story 9:16',
    hint: '1080 × 1920',
    width: 1080,
    height: 1920,
    photoHeight: 940,
    bottomSafe: 230
  }
];
