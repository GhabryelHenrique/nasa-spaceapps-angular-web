import { Injectable } from '@angular/core';
import { ShareFormat } from '../challenge-share/challenge-share.model';
import {
  Focus,
  canvasToPng,
  clampLines,
  drawImageCover,
  loadFonts,
  loadImage,
  parseFocus,
  prepareCanvas,
  roundRect,
  setLetterSpacing,
  wrapText
} from '../challenge-share/canvas-kit';
import { Speaker, TALKS_PARTNER, Talk, talkDateLabel } from '../data/talks.data';
import { TalkPostKind, confirmedSpeakerLabel } from './talk-share.model';

/**
 * Desenha os posts de divulgação das palestras no canvas, no mesmo esquema dos
 * cards de desafio (PNG em 1080px reais, sem dependência nova).
 *
 * O post da pessoa segue a arte de referência da Camilla Martins: logos no
 * topo, nome gigante à esquerda, foto no círculo com órbitas à direita, tema da
 * palestra, credenciais e o bloco de data e local. O post da palestra troca a
 * foto por um selo com a data e põe o tema em destaque.
 */

const DEEP_BLUE = '#07173F';
const BLUE_YONDER = '#2E96F5';
const NEON_YELLOW = '#EAFE07';
const WHITE = '#FFFFFF';
const TEXT_SECONDARY = '#C3D3EA';

const LOGO_SRC = 'assets/nasa-spaceapps-logo-removebg-preview.png';
/** Largura do logo do GDG no card — o SVG é desenhado direto nesse tamanho. */
const PARTNER_LOGO_WIDTH = 430;
const PHOTO_FALLBACK = 'assets/organizers/placeholder.svg';
/** Mesmo enquadramento padrão das fotos em `/palestras`. */
const DEFAULT_PHOTO_FOCUS: Focus = { x: 0.5, y: 0.18 };

/**
 * "·" entre itens nos textos em Overpass: espaços inseparáveis dos dois lados,
 * senão o ponto cola na palavra seguinte e a quebra de linha separa o ponto.
 */
const NBSP = String.fromCharCode(0xa0);
const SEPARATOR = `${NBSP}·${NBSP}${NBSP}`;

/** Pontos de cor espalhados pelo fundo, em frações da largura e da altura. */
const ACCENT_DOTS = [
  { x: 0.877, y: 0.088, r: 9, color: NEON_YELLOW },
  { x: 0.937, y: 0.625, r: 9, color: BLUE_YONDER },
  { x: 0.98, y: 0.618, r: 4, color: BLUE_YONDER },
  { x: 0.133, y: 0.895, r: 9, color: NEON_YELLOW },
  { x: 0.802, y: 0.89, r: 9, color: NEON_YELLOW }
];

/** Fontes da marca que precisam estar carregadas antes do primeiro `fillText`. */
const REQUIRED_FONTS = [
  '900 64px "Fira Sans"',
  '700 40px "Fira Sans"',
  '700 28px "Overpass"',
  '400 24px "Overpass"',
  '300 28px "Overpass"'
];

interface Layout {
  width: number;
  height: number;
  pad: number;
  /** Onde o conteúdo começa — no story, abaixo da barra de progresso do Instagram. */
  top: number;
  /** Limite inferior visível (no story, acima da barra de "enviar mensagem"). */
  safeBottom: number;
  story: boolean;
}

interface Assets {
  logo: HTMLImageElement;
  partner: HTMLCanvasElement | null;
  photo: HTMLImageElement;
}

interface WrapOptions {
  font: (size: number) => string;
  maxSize: number;
  minSize: number;
  /** Entrelinha em proporção do corpo. */
  lineHeight: number;
  maxHeight: number;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class TalkCardImageService {
  private whitePartnerLogo?: Promise<HTMLCanvasElement>;

  /** Redesenha o post inteiro no canvas informado, no tamanho real do formato. */
  async render(
    canvas: HTMLCanvasElement,
    talk: Talk,
    kind: TalkPostKind,
    format: ShareFormat,
    year: number
  ): Promise<void> {
    const ctx = prepareCanvas(canvas, format.width, format.height);

    const [logo, partner, photo] = await Promise.all([
      loadImage(LOGO_SRC),
      talk.withPartner ? this.partnerLogo() : Promise.resolve(null),
      loadImage(talk.speaker.photo).catch(() => loadImage(PHOTO_FALLBACK)),
      loadFonts(REQUIRED_FONTS)
    ]);

    const story = format.id === 'story';
    const layout: Layout = {
      width: format.width,
      height: format.height,
      pad: 66,
      top: story ? 210 : 44,
      safeBottom: format.height - format.bottomSafe,
      story
    };

    this.drawBackground(ctx, layout);

    if (kind === 'speaker') {
      const assets = { logo, partner, photo };
      // No story o post da pessoa terminaria no meio da tela: mede numa
      // passada de rascunho e distribui a sobra entre os blocos.
      const spare = story ? this.speakerSpare(layout, talk, year, assets) : 0;
      this.drawSpeakerPost(ctx, layout, talk, year, assets, spare);
    } else {
      this.drawTalkPost(ctx, layout, talk, year, { logo, partner, photo });
    }
  }

  /** PNG do post, pronto para download. */
  toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return canvasToPng(canvas);
  }

  /** Ex.: `spaceapps-palestra-agentes-adk-kubernetes-gemini-palestrante-feed.png`. */
  fileName(talk: Talk, kind: TalkPostKind, format: ShareFormat): string {
    const suffix = kind === 'speaker' ? 'palestrante' : 'palestra';
    return `spaceapps-palestra-${talk.slug}-${suffix}-${format.id}.png`;
  }

  // ─── Posts ──────────────────────────────────────────────────

  /** Quanto sobra entre o fim do post da pessoa e a base visível do formato. */
  private speakerSpare(l: Layout, talk: Talk, year: number, assets: Assets): number {
    const draft = prepareCanvas(document.createElement('canvas'), l.width, l.height);
    const end = this.drawSpeakerPost(draft, l, talk, year, assets);
    return Math.max(0, l.safeBottom - 110 - end);
  }

  /**
   * `spare` é o espaço extra a distribuir: um pouco no topo, a maior parte
   * entre a foto e o tema, o resto antes do bloco de data. Devolve o `y` final.
   */
  private drawSpeakerPost(
    ctx: CanvasRenderingContext2D,
    layout: Layout,
    talk: Talk,
    year: number,
    assets: Assets,
    spare = 0
  ): number {
    const l = { ...layout, top: layout.top + spare * 0.25 };
    const { speaker } = talk;
    const radius = l.story ? 280 : 250;
    const photoX = l.width - radius - 40;
    // A coluna do nome termina antes do círculo da foto.
    const columnWidth = photoX - radius - l.pad - 28;

    let y = this.drawHeader(ctx, l, assets);

    y = this.drawFittedLine(ctx, confirmedSpeakerLabel(speaker), l.pad, y, columnWidth,
      size => `700 ${size}px "Fira Sans", sans-serif`, 38, 26, NEON_YELLOW) + 18;

    const name = this.drawWrapped(ctx, speaker.name.toUpperCase(), l.pad, y, columnWidth, {
      font: size => `900 ${size}px "Fira Sans", sans-serif`,
      maxSize: l.story ? 116 : 106,
      minSize: 60,
      lineHeight: 1.02,
      maxHeight: (l.story ? 116 : 106) * 3,
      color: WHITE
    });

    y = name.bottom + 14;
    ctx.fillStyle = NEON_YELLOW;
    ctx.fillRect(l.pad, y, Math.min(columnWidth, name.width * 0.86), 4);
    y += 4 + 24;

    // Quem não tem apelido de divulgação ganha a origem (ou a cidade) no lugar.
    const subtitle = speaker.alias ?? speaker.origin?.label ?? speaker.city;
    if (subtitle) {
      y = this.drawFittedLine(ctx, subtitle.toUpperCase(), l.pad, y, columnWidth,
        size => `700 ${size}px "Fira Sans", sans-serif`, 46, 26, BLUE_YONDER);
    }

    const photoY = Math.max(l.top + radius + 110, y - radius + 24);
    this.drawOrbitRings(ctx, photoX, photoY, radius);
    this.drawCirclePhoto(ctx, assets.photo, photoX, photoY, radius, this.photoFocus(speaker));

    y = Math.max(y, photoY + radius + 10) + (l.story ? 70 : 44) + spare * 0.45;

    y = this.drawWrapped(ctx, talk.title, l.pad, y, l.width - l.pad * 2 - 40, {
      font: size => `700 ${size}px "Fira Sans", sans-serif`,
      maxSize: l.story ? 60 : 54,
      minSize: 40,
      lineHeight: 1.16,
      maxHeight: (l.story ? 60 : 54) * 1.16 * 3,
      color: WHITE
    }).bottom + 24;

    const details = separated([speaker.role, speaker.organization, ...speaker.credentials.slice(0, 2)]);
    y = this.drawParagraph(ctx, details, l.pad + 6, y, l.width - l.pad * 2 - 60, 2, {
      font: '400 25px "Overpass", sans-serif',
      lineHeight: 34,
      color: TEXT_SECONDARY
    }) + 26 + spare * 0.3;

    y = this.drawDivider(ctx, l, y) + 44;
    y = this.drawSchedule(ctx, l, talk, y) + 40;
    y = this.drawSignature(ctx, l, year, y);

    this.drawBottomOrbits(ctx, l, y + 70);
    return y;
  }

  private drawTalkPost(
    ctx: CanvasRenderingContext2D,
    l: Layout,
    talk: Talk,
    year: number,
    assets: Assets
  ): void {
    const badgeRadius = l.story ? 165 : 148;
    const badgeX = l.width - badgeRadius - 50;
    const badgeY = l.top + badgeRadius + 10;
    const width = l.width - l.pad * 2;

    this.drawOrbitRings(ctx, badgeX, badgeY, badgeRadius);
    this.drawDateBadge(ctx, talk, badgeX, badgeY, badgeRadius);

    let y = Math.max(this.drawHeader(ctx, l, assets), badgeY + badgeRadius + 40);

    const meta = [talk.format, talk.mode, talk.level && `Nível ${talk.level.toLowerCase()}`]
      .filter(Boolean)
      .join(' · ')
      .toUpperCase();
    y = this.drawFittedLine(ctx, meta, l.pad, y, width,
      size => `700 ${size}px "Fira Sans", sans-serif`, 30, 20, NEON_YELLOW) + 22;

    if (talk.tags.length > 0) y = this.drawChips(ctx, talk.tags, l.pad, y, width) + 34;

    // O bloco de baixo (pessoa, data e local, assinatura) fica ancorado no fim
    // do card; tema e resumo ocupam o que sobra no meio.
    const signatureY = l.story ? l.safeBottom - 70 : l.height - 120;
    const scheduleY = signatureY - 36 - 74;
    const dividerY = scheduleY - 40 - 2;
    const speakerY = dividerY - 34 - 124;
    const middleBottom = speakerY - 40;

    // Reserva espaço para pelo menos duas linhas de resumo abaixo do tema.
    const titleMaxHeight = Math.max(140, middleBottom - y - 34 - 42 * 2 - 24);
    y = this.drawWrapped(ctx, talk.title, l.pad, y, width, {
      font: size => `900 ${size}px "Fira Sans", sans-serif`,
      maxSize: l.story ? 80 : 70,
      minSize: 44,
      lineHeight: 1.08,
      maxHeight: titleMaxHeight,
      color: WHITE
    }).bottom + 18;

    ctx.fillStyle = NEON_YELLOW;
    ctx.fillRect(l.pad, y, 260, 4);
    y += 4 + 30;

    const summaryLines = Math.min(l.story ? 6 : 4, Math.floor((middleBottom - y) / 42));
    if (summaryLines > 0) {
      y = this.drawParagraph(ctx, talk.summary, l.pad, y, width, summaryLines, {
        font: '300 29px "Overpass", sans-serif',
        lineHeight: 42,
        color: TEXT_SECONDARY
      }) + 30;
    }

    this.drawTakeaways(ctx, talk.takeaways, l.pad, y, width, middleBottom);

    this.drawSpeakerRow(ctx, l, talk.speaker, assets.photo, speakerY);
    this.drawDivider(ctx, l, dividerY);
    this.drawSchedule(ctx, l, talk, scheduleY);
    const end = this.drawSignature(ctx, l, year, signatureY);

    this.drawBottomOrbits(ctx, l, end + 50);
  }

  // ─── Fundo e decoração ──────────────────────────────────────

  private drawBackground(ctx: CanvasRenderingContext2D, l: Layout): void {
    const gradient = ctx.createLinearGradient(0, 0, l.width * 0.4, l.height);
    gradient.addColorStop(0, '#0747B6');
    gradient.addColorStop(0.5, '#0A2C7A');
    gradient.addColorStop(1, '#081A4F');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, l.width, l.height);

    // Brilho no canto superior esquerdo, atrás dos logos.
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, l.width * 0.9);
    glow.addColorStop(0, 'rgba(32, 110, 235, 0.35)');
    glow.addColorStop(1, 'rgba(32, 110, 235, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, l.width, l.height);

    // Estrelas com semente fixa: o mesmo céu em toda prévia e download.
    let seed = 2026;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    ctx.save();
    for (let i = 0; i < 150; i++) {
      ctx.globalAlpha = 0.25 + random() * 0.6;
      ctx.fillStyle = WHITE;
      ctx.beginPath();
      ctx.arc(random() * l.width, random() * l.height, 0.8 + random() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    for (const dot of ACCENT_DOTS) {
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(dot.x * l.width, dot.y * l.height, dot.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /** Duas elipses (azul e Neon Yellow) passando por trás do círculo. */
  private drawOrbitRings(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
    ctx.save();
    ctx.translate(cx + radius * 0.9, cy - radius * 0.9);
    ctx.rotate(-0.12);

    ctx.strokeStyle = 'rgba(46, 150, 245, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.95, radius * 0.66, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(234, 254, 7, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(radius * 0.1, radius * 0.06, radius * 1.8, radius * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Arcos de planeta saindo da base do card. Desenhados depois do conteúdo,
   * sempre abaixo dele (`peakY` é o topo do arco mais alto).
   */
  private drawBottomOrbits(ctx: CanvasRenderingContext2D, l: Layout, peakY: number): void {
    const top = Math.min(peakY, l.height - 60);

    ctx.save();
    ctx.strokeStyle = 'rgba(46, 150, 245, 0.85)';

    const leftRadius = l.width * 0.44;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(l.width * 0.185, top + leftRadius, leftRadius, 0, Math.PI * 2);
    ctx.stroke();

    const rightRadius = l.width * 0.53;
    const rightY = top + 30 + rightRadius;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(l.width * 0.81, rightY, rightRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(l.width * 0.81, rightY, rightRadius - 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // ─── Blocos ─────────────────────────────────────────────────

  /** Logo da sede e, nas palestras em parceria, o do GDG logo abaixo. Devolve o novo `y`. */
  private drawHeader(ctx: CanvasRenderingContext2D, l: Layout, assets: Assets): number {
    const logoHeight = l.story ? 200 : 186;
    const logoWidth = (logoHeight * assets.logo.width) / assets.logo.height;
    ctx.drawImage(assets.logo, l.pad - 16, l.top, logoWidth, logoHeight);

    let y = l.top + logoHeight + 12;

    if (assets.partner) {
      ctx.drawImage(assets.partner, l.pad, y);
      y += assets.partner.height + 34;
    } else {
      y += 18;
    }

    return y;
  }

  /** Foto recortada no círculo, com o aro azul e o Neon Yellow levemente deslocado. */
  private drawCirclePhoto(
    ctx: CanvasRenderingContext2D,
    photo: HTMLImageElement,
    cx: number,
    cy: number,
    radius: number,
    focus: Focus
  ): void {
    const scale = radius / 250;

    ctx.save();
    ctx.strokeStyle = BLUE_YONDER;
    ctx.lineWidth = Math.max(2, 3 * scale);
    ctx.beginPath();
    ctx.arc(cx - 3 * scale, cy - 3 * scale, radius + 4 * scale, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = NEON_YELLOW;
    ctx.lineWidth = Math.max(3, 5 * scale);
    ctx.beginPath();
    ctx.arc(cx + 4 * scale, cy + 5 * scale, radius + 9 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = DEEP_BLUE;
    ctx.fill();
    drawImageCover(ctx, photo, cx - radius, cy - radius, radius * 2, radius * 2, focus);
    ctx.restore();
  }

  /** Selo circular do post da palestra: mês, dia e horário. */
  private drawDateBadge(
    ctx: CanvasRenderingContext2D,
    talk: Talk,
    cx: number,
    cy: number,
    radius: number
  ): void {
    const { day, month } = this.dateParts(talk.startsAt);

    ctx.save();
    ctx.strokeStyle = BLUE_YONDER;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 3, radius + 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = NEON_YELLOW;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx + 4, cy + 5, radius + 9, 0, Math.PI * 2);
    ctx.stroke();

    const fill = ctx.createRadialGradient(cx, cy - radius * 0.4, 0, cx, cy, radius);
    fill.addColorStop(0, '#0E4FC4');
    fill.addColorStop(1, '#0A2462');
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    setLetterSpacing(ctx, '6px');
    ctx.font = '700 30px "Overpass", sans-serif';
    ctx.fillStyle = NEON_YELLOW;
    ctx.fillText(month, cx + 3, cy - radius * 0.47);

    setLetterSpacing(ctx, '0px');
    ctx.font = `900 ${Math.round(radius * 0.92)}px "Fira Sans", sans-serif`;
    ctx.fillStyle = WHITE;
    ctx.fillText(day, cx, cy + radius * 0.02);

    setLetterSpacing(ctx, '2px');
    ctx.font = '700 34px "Fira Sans", sans-serif';
    ctx.fillStyle = BLUE_YONDER;
    ctx.fillText(talk.timeLabel.toUpperCase(), cx + 1, cy + radius * 0.52);
    ctx.restore();
  }

  /** Selos de tema contornados em azul, numa linha só. Devolve o `y` de baixo. */
  private drawChips(
    ctx: CanvasRenderingContext2D,
    tags: string[],
    x: number,
    y: number,
    maxWidth: number
  ): number {
    const height = 46;
    const padX = 22;
    const gap = 12;
    let cursor = x;

    ctx.save();
    ctx.font = '700 22px "Overpass", sans-serif';
    ctx.textBaseline = 'middle';
    setLetterSpacing(ctx, '1.5px');

    for (const tag of tags) {
      const label = tag.toUpperCase();
      const width = ctx.measureText(label).width + padX * 2;
      if (cursor + width > x + maxWidth) break;

      ctx.beginPath();
      roundRect(ctx, cursor, y, width, height, height / 2);
      ctx.fillStyle = 'rgba(7, 23, 63, 0.45)';
      ctx.fill();
      ctx.strokeStyle = BLUE_YONDER;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = WHITE;
      ctx.fillText(label, cursor + padX, y + height / 2 + 1);
      cursor += width + gap;
    }

    ctx.restore();
    return y + height;
  }

  /** "O que você leva", com marcador Neon Yellow, até onde houver espaço. */
  private drawTakeaways(
    ctx: CanvasRenderingContext2D,
    items: string[],
    x: number,
    y: number,
    maxWidth: number,
    limitY: number
  ): void {
    const lineHeight = 46;
    const textX = x + 40;

    ctx.save();
    ctx.font = '400 27px "Overpass", sans-serif';
    ctx.textBaseline = 'middle';

    for (const item of items.slice(0, 3)) {
      if (y + lineHeight > limitY) break;

      ctx.fillStyle = NEON_YELLOW;
      ctx.beginPath();
      ctx.arc(x + 11, y + lineHeight / 2, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = WHITE;
      const [line] = clampLines(ctx, wrapText(ctx, item, maxWidth - 40), 1, maxWidth - 40);
      ctx.fillText(line, textX, y + lineHeight / 2 + 1);
      y += lineHeight;
    }

    ctx.restore();
  }

  /** Foto pequena + nome, apelido e cargo — a "assinatura" de quem fala no post da palestra. */
  private drawSpeakerRow(
    ctx: CanvasRenderingContext2D,
    l: Layout,
    speaker: Speaker,
    photo: HTMLImageElement,
    y: number
  ): void {
    const radius = 58;
    const cx = l.pad + radius + 4;
    this.drawCirclePhoto(ctx, photo, cx, y + 62, radius, this.photoFocus(speaker));

    const x = cx + radius + 34;
    const maxWidth = l.width - x - l.pad;
    const accent = speaker.alias ?? speaker.origin?.label ?? speaker.city;
    const detail = separated([speaker.role, speaker.organization]);

    let lineY = this.drawFittedLine(ctx, speaker.name, x, y + 8, maxWidth,
      size => `900 ${size}px "Fira Sans", sans-serif`, 40, 28, WHITE) + 8;

    if (accent) {
      ctx.save();
      setLetterSpacing(ctx, '2px');
      lineY = this.drawFittedLine(ctx, accent.toUpperCase(), x, lineY, maxWidth,
        size => `700 ${size}px "Overpass", sans-serif`, 24, 16, BLUE_YONDER) + 8;
      ctx.restore();
    }

    this.drawFittedLine(ctx, detail, x, lineY, maxWidth,
      size => `400 ${size}px "Overpass", sans-serif`, 22, 16, TEXT_SECONDARY);
  }

  private drawDivider(ctx: CanvasRenderingContext2D, l: Layout, y: number): number {
    ctx.fillStyle = 'rgba(46, 150, 245, 0.75)';
    ctx.fillRect(l.pad + 6, y, l.width - l.pad * 2 - 12, 2);
    return y + 2;
  }

  /** Ícone de calendário + "10 de novembro · 19h - Local" + endereço. Devolve o `y` de baixo. */
  private drawSchedule(ctx: CanvasRenderingContext2D, l: Layout, talk: Talk, y: number): number {
    const iconX = l.pad + 8;
    const iconSize = 66;
    this.drawCalendarIcon(ctx, iconX, y + 2, iconSize);

    const textX = iconX + iconSize + 34;
    const maxWidth = l.width - textX - l.pad;
    const when = `${talkDateLabel(talk)} · ${talk.timeLabel}`;
    const where = talk.venue
      ? talk.venueAddress ?? 'Uberlândia (MG)'
      : separated(['Local divulgado em breve', 'Uberlândia (MG)']);

    this.drawFittedLine(ctx, talk.venue ? `${when} - ${talk.venue}` : when, textX, y, maxWidth,
      size => `700 ${size}px "Fira Sans", sans-serif`, 36, 24, WHITE);
    this.drawFittedLine(ctx, where, textX, y + 46, maxWidth,
      size => `700 ${size}px "Overpass", sans-serif`, 25, 16, BLUE_YONDER);

    return y + 74;
  }

  private drawCalendarIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    const top = y + size * 0.14;

    ctx.save();
    ctx.strokeStyle = NEON_YELLOW;
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';

    ctx.beginPath();
    roundRect(ctx, x, top, size, size * 0.9, size * 0.14);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, top + size * 0.24);
    ctx.lineTo(x + size, top + size * 0.24);
    ctx.stroke();

    for (const fraction of [0.3, 0.7]) {
      ctx.beginPath();
      ctx.moveTo(x + size * fraction, y);
      ctx.lineTo(x + size * fraction, top + size * 0.12);
      ctx.stroke();
    }

    ctx.restore();
  }

  /** "NASA SPACE APPS CHALLENGE 2026 / UBERLÂNDIA (MG)" e o @ da sede à direita. */
  private drawSignature(ctx: CanvasRenderingContext2D, l: Layout, year: number, y: number): number {
    ctx.save();
    ctx.textBaseline = 'top';
    setLetterSpacing(ctx, '1.5px');

    ctx.font = '700 17px "Overpass", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.fillText(`NASA SPACE APPS CHALLENGE ${year}  /  UBERLÂNDIA (MG)`, l.pad, y);

    setLetterSpacing(ctx, '0.5px');
    ctx.font = '400 19px "Overpass", sans-serif';
    ctx.fillStyle = TEXT_SECONDARY;
    ctx.textAlign = 'right';
    ctx.fillText('@nasaspaceappsuberlandia', l.width - l.pad, y - 1);
    ctx.restore();

    return y + 20;
  }

  // ─── Texto ──────────────────────────────────────────────────

  /** Uma linha que encolhe até caber na largura. Devolve o `y` de baixo. */
  private drawFittedLine(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    font: (size: number) => string,
    maxSize: number,
    minSize: number,
    color: string
  ): number {
    let size = maxSize;

    ctx.save();
    ctx.font = font(size);
    while (size > minSize && ctx.measureText(text).width > maxWidth) {
      size -= 2;
      ctx.font = font(size);
    }

    // Nem no menor corpo coube: corta por palavra, com reticências.
    const line = ctx.measureText(text).width > maxWidth
      ? clampLines(ctx, [text, ''], 1, maxWidth)[0]
      : text;

    ctx.fillStyle = color;
    ctx.textBaseline = 'top';
    ctx.fillText(line, x, y);
    ctx.restore();

    return y + size;
  }

  /**
   * Bloco de várias linhas que encolhe até caber em `maxHeight` — sem palavra
   * estourando a largura. No menor corpo, corta com reticências.
   */
  private drawWrapped(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    options: WrapOptions
  ): { bottom: number; width: number } {
    let size = options.maxSize;
    let lines: string[] = [];
    let lineHeight = 0;

    ctx.save();
    while (true) {
      ctx.font = options.font(size);
      lines = wrapText(ctx, text, maxWidth);
      lineHeight = Math.round(size * options.lineHeight);
      const fits =
        lines.length * lineHeight <= options.maxHeight &&
        lines.every(line => ctx.measureText(line).width <= maxWidth);
      if (fits || size <= options.minSize) break;
      size -= 2;
    }

    lines = clampLines(ctx, lines, Math.max(1, Math.floor(options.maxHeight / lineHeight)), maxWidth);
    const width = Math.max(...lines.map(line => ctx.measureText(line).width));

    ctx.fillStyle = options.color;
    ctx.textBaseline = 'top';
    lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
    ctx.restore();

    return { bottom: y + lines.length * lineHeight, width };
  }

  /** Parágrafo em corpo fixo, cortado em `maxLines`. Devolve o `y` de baixo. */
  private drawParagraph(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    maxLines: number,
    style: { font: string; lineHeight: number; color: string }
  ): number {
    ctx.save();
    ctx.font = style.font;
    ctx.fillStyle = style.color;
    ctx.textBaseline = 'top';

    const lines = clampLines(ctx, wrapText(ctx, text, maxWidth), maxLines, maxWidth);
    lines.forEach((line, i) => ctx.fillText(line, x, y + i * style.lineHeight));
    ctx.restore();

    return y + lines.length * style.lineHeight;
  }

  // ─── Utilidades ─────────────────────────────────────────────

  private photoFocus(speaker: Speaker): Focus {
    return parseFocus(speaker.photoPosition, DEFAULT_PHOTO_FOCUS);
  }

  /** Dia e mês no fuso de Brasília — o `startsAt` já vem com `-03:00`. */
  private dateParts(startsAt: string): { day: string; month: string } {
    const date = new Date(startsAt);
    const timeZone = 'America/Sao_Paulo';

    return {
      day: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', timeZone }).format(date),
      month: new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone })
        .format(date)
        .replace('.', '')
        .toUpperCase()
    };
  }

  /**
   * Logo do GDG a partir do SVG oficial (`TALKS_PARTNER.logo`), desenhado
   * path a path com `Path2D` — nítido no tamanho do card e sem imagem SVG no
   * canvas.
   *
   * O SVG é um traçado: um fundo branco, o texto quase preto (que some no azul)
   * e, por cima de tudo, o miolo das letras ("o", "e") em branco. Aqui o fundo
   * é descartado, o texto e os contornos viram brancos e o miolo é recortado.
   */
  private partnerLogo(): Promise<HTMLCanvasElement> {
    this.whitePartnerLogo ??= fetch(TALKS_PARTNER.logo)
      .then(response => {
        if (!response.ok) throw new Error('Não foi possível carregar o logo do GDG.');
        return response.text();
      })
      .then(source => {
        const svg = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
        const [, , viewWidth, viewHeight] = (svg.getAttribute('viewBox') ?? '').split(/[\s,]+/).map(Number);
        const paths = [...svg.querySelectorAll('path')].map(path => ({
          d: path.getAttribute('d') ?? '',
          fill: (path.getAttribute('fill') ?? '').toUpperCase()
        }));

        // Branco antes do último traço de tinta é fundo; depois dele, miolo de letra.
        const lastInk = paths.map(path => path.fill !== '#FFFFFF').lastIndexOf(true);
        const scale = PARTNER_LOGO_WIDTH / viewWidth;

        const canvas = document.createElement('canvas');
        canvas.width = PARTNER_LOGO_WIDTH;
        canvas.height = Math.ceil(viewHeight * scale);

        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;
        ctx.scale(scale, scale);

        paths.forEach((path, index) => {
          if (path.fill === '#FFFFFF') {
            if (index < lastInk) return;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = '#000';
          } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = isNeutral(path.fill) ? WHITE : path.fill;
          }
          ctx.fill(new Path2D(path.d));
        });

        return canvas;
      });

    return this.whitePartnerLogo;
  }
}

/** Cinza/preto (`#1E1E1E`, `#101011`…), em oposição às cores do ícone. */
function isNeutral(hex: string): boolean {
  const [r, g, b] = [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16));
  return Math.max(r, g, b) - Math.min(r, g, b) < 40;
}

/** Junta os itens com o `SEPARATOR` (inclusive os " · " que já vêm nos dados). */
function separated(parts: string[]): string {
  return parts.join(' · ').replace(/ · /g, SEPARATOR);
}
