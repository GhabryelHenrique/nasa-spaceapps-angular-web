import { Injectable } from '@angular/core';
import { NomineeTeam } from '../../services/global-nominees.service';
import { ShareFormat } from '../challenge-share/challenge-share.model';
import {
  canvasToPng,
  clampLines,
  drawImageCover,
  loadFonts,
  loadImage,
  prepareCanvas,
  roundRect,
  setLetterSpacing,
  wrapText
} from '../challenge-share/canvas-kit';

/**
 * Desenha o carrossel de divulgação dos Global Nominees: uma capa com todos os
 * times e um slide por time (imagem, nome, projeto e desafio).
 *
 * Mesma identidade dos posts das palestras (`TalkCardImageService`): fundo
 * azul com estrelas, logo da sede no topo, Neon Yellow como acento, arcos de
 * órbita na base e a assinatura da sede. PNG em 1080px reais, sem dependência nova.
 */

const DEEP_BLUE = '#07173F';
const BLUE_YONDER = '#2E96F5';
const NEON_YELLOW = '#EAFE07';
const WHITE = '#FFFFFF';
const TEXT_SECONDARY = '#C3D3EA';

const LOGO_SRC = 'assets/nasa-spaceapps-logo-removebg-preview.png';

/** Pontos de cor espalhados pelo fundo, em frações da largura e da altura. */
const ACCENT_DOTS = [
  { x: 0.877, y: 0.088, r: 9, color: NEON_YELLOW },
  { x: 0.937, y: 0.625, r: 9, color: BLUE_YONDER },
  { x: 0.98, y: 0.618, r: 4, color: BLUE_YONDER },
  { x: 0.133, y: 0.895, r: 9, color: NEON_YELLOW },
  { x: 0.802, y: 0.89, r: 9, color: NEON_YELLOW }
];

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
  /** Onde a assinatura da sede é desenhada, ancorada na base. */
  signatureY: number;
}

interface WrapOptions {
  font: (size: number) => string;
  maxSize: number;
  minSize: number;
  /** Entrelinha em proporção do corpo. */
  lineHeight: number;
  maxLines: number;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class NomineesCardImageService {
  /** Capa do carrossel: o número de indicados e a grade com todos os times. */
  async renderCover(
    canvas: HTMLCanvasElement,
    nominees: NomineeTeam[],
    format: ShareFormat,
    year: number
  ): Promise<void> {
    const ctx = prepareCanvas(canvas, format.width, format.height);
    const [logo, images] = await Promise.all([
      loadImage(LOGO_SRC),
      Promise.all(nominees.map(nominee => this.teamImage(nominee))),
      loadFonts(REQUIRED_FONTS)
    ]);

    const l = this.layout(format);
    this.drawBackground(ctx, l);

    const logoHeight = l.story ? 170 : 140;
    ctx.drawImage(logo, l.pad - 12, l.top, (logoHeight * logo.width) / logo.height, logoHeight);
    let y = l.top + logoHeight + (l.story ? 60 : 34);

    ctx.save();
    setLetterSpacing(ctx, '3px');
    y = this.drawFittedLine(ctx, `INDICADOS GLOBAIS · UBERLÂNDIA ${year}`, l.pad, y, l.width - l.pad * 2,
      size => `700 ${size}px "Fira Sans", sans-serif`, 32, 22, NEON_YELLOW) + (l.story ? 30 : 18);
    ctx.restore();

    // "7" gigante em Neon Yellow e, ao lado, "GLOBAL / NOMINEES" empilhado.
    const numberSize = l.story ? 300 : 260;
    const count = String(nominees.length);
    ctx.save();
    ctx.font = `900 ${numberSize}px "Fira Sans", sans-serif`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = NEON_YELLOW;
    const numberWidth = ctx.measureText(count).width;
    // O "top" da Fira inclui o espaço de acentos; sobe um pouco para alinhar ao texto.
    ctx.fillText(count, l.pad - 8, y - numberSize * 0.06);
    ctx.restore();

    const wordsX = l.pad + numberWidth + 28;
    const wordsWidth = l.width - wordsX - l.pad;
    const wordSize = l.story ? 112 : 100;
    const firstBottom = this.drawFittedLine(ctx, 'GLOBAL', wordsX, y + numberSize * 0.08, wordsWidth,
      size => `900 ${size}px "Fira Sans", sans-serif`, wordSize, 56, WHITE);
    const secondBottom = this.drawFittedLine(ctx, 'NOMINEES', wordsX, firstBottom + 6, wordsWidth,
      size => `900 ${size}px "Fira Sans", sans-serif`, wordSize, 56, WHITE);
    y = Math.max(y + numberSize * 0.78, secondBottom) + 22;

    ctx.fillStyle = NEON_YELLOW;
    ctx.fillRect(l.pad, y, 280, 5);
    y += 5 + (l.story ? 40 : 28);

    y = this.drawParagraph(ctx,
      'Projetos criados no hackathon de Uberlândia e indicados pelos juízes locais à avaliação global da NASA.',
      l.pad, y, l.width - l.pad * 2, 3, {
        font: `300 ${l.story ? 34 : 30}px "Overpass", sans-serif`,
        lineHeight: l.story ? 48 : 42,
        color: TEXT_SECONDARY
      }) + (l.story ? 70 : 44);

    this.drawCoverGrid(ctx, l, nominees, images, y, l.signatureY - (l.story ? 70 : 44));

    const end = this.drawSignature(ctx, l, year);
    this.drawBottomOrbits(ctx, l, end + 60);
  }

  /** Slide de um time: imagem em destaque, nome, projeto e desafio. */
  async renderTeam(
    canvas: HTMLCanvasElement,
    nominee: NomineeTeam,
    format: ShareFormat,
    year: number
  ): Promise<void> {
    const ctx = prepareCanvas(canvas, format.width, format.height);
    const [logo, image] = await Promise.all([
      loadImage(LOGO_SRC),
      this.teamImage(nominee),
      loadFonts(REQUIRED_FONTS)
    ]);

    const l = this.layout(format);
    this.drawBackground(ctx, l);

    // Logo à esquerda, selo "Global Nominee" à direita, na mesma linha.
    const logoHeight = l.story ? 150 : 124;
    ctx.drawImage(logo, l.pad - 12, l.top, (logoHeight * logo.width) / logo.height, logoHeight);
    this.drawBadge(ctx, `GLOBAL NOMINEE ${year}`, l.width - l.pad, l.top + logoHeight / 2);

    const textWidth = l.width - l.pad * 2;
    // O bloco de texto fica ancorado acima da assinatura; a imagem ocupa o resto.
    // Mede numa passada de rascunho para saber quanto espaço sobra.
    const draft = prepareCanvas(document.createElement('canvas'), l.width, l.height);
    const textHeight = this.drawTeamText(draft, l, nominee, 0, textWidth);

    const frameTop = l.top + logoHeight + (l.story ? 44 : 30);
    const gap = l.story ? 60 : 44;
    const available = l.signatureY - (l.story ? 64 : 44) - textHeight - gap - frameTop;
    const frameHeight = Math.max(260, Math.min(available, l.story ? 860 : 620));
    // Se a imagem bateu no limite, o que sobra vai para os respiros, não para a base.
    const spare = Math.max(0, available - frameHeight);
    const frameY = frameTop + spare * 0.3;

    this.drawFrame(ctx, image, nominee, l.pad, frameY, textWidth, frameHeight);
    this.drawTeamText(ctx, l, nominee, frameY + frameHeight + gap + spare * 0.35, textWidth);

    const end = this.drawSignature(ctx, l, year);
    this.drawBottomOrbits(ctx, l, end + 60);
  }

  toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return canvasToPng(canvas);
  }

  // ─── Blocos ─────────────────────────────────────────────────

  private layout(format: ShareFormat): Layout {
    const story = format.id === 'story';
    const safeBottom = format.height - format.bottomSafe;
    return {
      width: format.width,
      height: format.height,
      pad: 66,
      top: story ? 210 : 48,
      safeBottom,
      story,
      signatureY: story ? safeBottom - 70 : format.height - 116
    };
  }

  /**
   * Grade da capa: 4 times na primeira linha e o resto centralizado na
   * segunda (ou 3 + 3 + …, se forem muitos). O raio se ajusta ao espaço.
   */
  private drawCoverGrid(
    ctx: CanvasRenderingContext2D,
    l: Layout,
    nominees: NomineeTeam[],
    images: (HTMLImageElement | null)[],
    top: number,
    bottom: number
  ): void {
    const perRow = nominees.length <= 8 ? 4 : 5;
    const rows = Math.ceil(nominees.length / perRow);
    const width = l.width - l.pad * 2;
    const cell = width / perRow;
    const nameBlock = 74;
    const rowHeight = (bottom - top) / rows;
    const radius = Math.max(44, Math.min(cell / 2 - 24, (rowHeight - nameBlock - 28) / 2, l.story ? 104 : 92));

    nominees.forEach((nominee, index) => {
      const row = Math.floor(index / perRow);
      const inRow = Math.min(perRow, nominees.length - row * perRow);
      const col = index - row * perRow;
      const rowStart = l.pad + (width - inRow * cell) / 2;
      const cx = rowStart + cell * col + cell / 2;
      const cy = top + row * rowHeight + (rowHeight - nameBlock - radius * 2) / 2 + radius;

      this.drawCircleImage(ctx, images[index], nominee, cx, cy, radius);

      ctx.save();
      ctx.textAlign = 'center';
      const lines = this.fitLines(ctx, nominee.name, cell - 14, 2,
        size => `700 ${size}px "Fira Sans", sans-serif`, 28, 20);
      ctx.fillStyle = WHITE;
      ctx.textBaseline = 'top';
      lines.text.forEach((line, i) => ctx.fillText(line, cx, cy + radius + 20 + i * lines.lineHeight));
      ctx.restore();
    });
  }

  /** Nome, projeto e desafio. Devolve a altura ocupada (usada também na medição). */
  private drawTeamText(
    ctx: CanvasRenderingContext2D,
    l: Layout,
    nominee: NomineeTeam,
    top: number,
    width: number
  ): number {
    let y = this.drawWrapped(ctx, nominee.name, l.pad, top, width, {
      font: size => `900 ${size}px "Fira Sans", sans-serif`,
      maxSize: l.story ? 124 : 108,
      minSize: 60,
      lineHeight: 1.04,
      maxLines: 2,
      color: WHITE
    });

    y += 16;
    ctx.fillStyle = NEON_YELLOW;
    ctx.fillRect(l.pad, y, 260, 5);
    y += 5;

    if (nominee.project) {
      y += l.story ? 40 : 30;
      y = this.drawLabel(ctx, 'PROJETO', l.pad, y) + 10;
      y = this.drawWrapped(ctx, nominee.project, l.pad, y, width, {
        font: size => `700 ${size}px "Fira Sans", sans-serif`,
        maxSize: l.story ? 52 : 46,
        minSize: 30,
        lineHeight: 1.14,
        maxLines: 2,
        color: WHITE
      });
    }

    if (nominee.challenge) {
      y += l.story ? 34 : 24;
      y = this.drawLabel(ctx, 'DESAFIO', l.pad, y) + 10;
      y = this.drawParagraph(ctx, nominee.challenge, l.pad, y, width, 2, {
        font: `400 ${l.story ? 32 : 29}px "Overpass", sans-serif`,
        lineHeight: l.story ? 44 : 40,
        color: TEXT_SECONDARY
      });
    }

    return y - top;
  }

  /** Rótulo pequeno em Blue Yonder, espaçado. Devolve o `y` de baixo. */
  private drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): number {
    ctx.save();
    setLetterSpacing(ctx, '4px');
    ctx.font = '700 22px "Overpass", sans-serif';
    ctx.fillStyle = BLUE_YONDER;
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
    ctx.restore();
    return y + 22;
  }

  /** Selo contornado em Neon Yellow, alinhado à direita em `right`, centrado em `cy`. */
  private drawBadge(ctx: CanvasRenderingContext2D, text: string, right: number, cy: number): void {
    const height = 58;
    const padX = 28;

    ctx.save();
    setLetterSpacing(ctx, '2.5px');
    ctx.font = '700 24px "Overpass", sans-serif';
    const width = ctx.measureText(text).width + padX * 2;
    const x = right - width;

    ctx.beginPath();
    roundRect(ctx, x, cy - height / 2, width, height, height / 2);
    // Opaco: um dos pontos de cor do fundo cai bem atrás do selo.
    ctx.fillStyle = DEEP_BLUE;
    ctx.fill();
    ctx.strokeStyle = NEON_YELLOW;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = NEON_YELLOW;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + padX, cy + 2);
    ctx.restore();
  }

  /**
   * Imagem do time num quadro arredondado. As imagens variam muito (logo
   * quadrado, foto da equipe, arte vertical), então ela entra inteira
   * ("contain") sobre uma versão ampliada e escurecida dela mesma.
   */
  private drawFrame(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement | null,
    nominee: NomineeTeam,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const radius = 30;

    // Aros deslocados, no mesmo vocabulário das fotos circulares das palestras.
    ctx.save();
    ctx.strokeStyle = BLUE_YONDER;
    ctx.lineWidth = 3;
    ctx.beginPath();
    roundRect(ctx, x - 7, y - 7, width + 8, height + 8, radius + 6);
    ctx.stroke();
    ctx.strokeStyle = NEON_YELLOW;
    ctx.lineWidth = 4;
    ctx.beginPath();
    roundRect(ctx, x + 2, y + 4, width + 9, height + 10, radius + 8);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    roundRect(ctx, x, y, width, height, radius);
    ctx.clip();
    ctx.fillStyle = DEEP_BLUE;
    ctx.fillRect(x, y, width, height);

    if (image) {
      ctx.save();
      // `filter` no canvas não existe em todo navegador: lá fica só escurecido.
      ctx.filter = 'blur(36px)';
      ctx.globalAlpha = 0.55;
      drawImageCover(ctx, image, x - 60, y - 60, width + 120, height + 120);
      ctx.restore();
      ctx.fillStyle = 'rgba(7, 23, 63, 0.45)';
      ctx.fillRect(x, y, width, height);

      const inset = 24;
      const scale = Math.min((width - inset * 2) / image.width, (height - inset * 2) / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
    } else {
      this.drawInitials(ctx, nominee, x + width / 2, y + height / 2, Math.min(width, height) * 0.42);
    }
    ctx.restore();
  }

  /** Imagem do time recortada no círculo, com o aro duplo. */
  private drawCircleImage(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement | null,
    nominee: NomineeTeam,
    cx: number,
    cy: number,
    radius: number
  ): void {
    ctx.save();
    ctx.strokeStyle = BLUE_YONDER;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx - 2, cy - 2, radius + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = NEON_YELLOW;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx + 3, cy + 4, radius + 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = DEEP_BLUE;
    ctx.fill();
    if (image) {
      drawImageCover(ctx, image, cx - radius, cy - radius, radius * 2, radius * 2);
    } else {
      this.drawInitials(ctx, nominee, cx, cy, radius * 0.8);
    }
    ctx.restore();
  }

  /** Sem imagem (falha no CDN ou time sem foto): as iniciais em Neon Yellow. */
  private drawInitials(ctx: CanvasRenderingContext2D, nominee: NomineeTeam, cx: number, cy: number, size: number): void {
    const initials = nominee.name
      .split(/[\s.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('');

    ctx.save();
    ctx.font = `900 ${Math.round(size)}px "Fira Sans", sans-serif`;
    ctx.fillStyle = NEON_YELLOW;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, cx, cy);
    ctx.restore();
  }

  // ─── Fundo e decoração ──────────────────────────────────────

  private drawBackground(ctx: CanvasRenderingContext2D, l: Layout): void {
    const gradient = ctx.createLinearGradient(0, 0, l.width * 0.4, l.height);
    gradient.addColorStop(0, '#0747B6');
    gradient.addColorStop(0.5, '#0A2C7A');
    gradient.addColorStop(1, '#081A4F');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, l.width, l.height);

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

  /** Arcos de planeta saindo da base do card, sempre abaixo do conteúdo. */
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
    ctx.restore();
  }

  /** "NASA SPACE APPS CHALLENGE 2026 / UBERLÂNDIA (MG)" e o @ da sede à direita. */
  private drawSignature(ctx: CanvasRenderingContext2D, l: Layout, year: number): number {
    const y = l.signatureY;

    ctx.save();
    ctx.fillStyle = 'rgba(46, 150, 245, 0.75)';
    ctx.fillRect(l.pad + 6, y - 34, l.width - l.pad * 2 - 12, 2);

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
   * Quebra em até `maxLines`, encolhendo o corpo até caber (sem palavra
   * estourando a largura). Deixa a fonte aplicada no contexto.
   */
  private fitLines(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxLines: number,
    font: (size: number) => string,
    maxSize: number,
    minSize: number,
    lineHeightRatio = 1.1
  ): { text: string[]; lineHeight: number } {
    let size = maxSize;
    let lines: string[];

    while (true) {
      ctx.font = font(size);
      lines = wrapText(ctx, text, maxWidth);
      const fits = lines.length <= maxLines && lines.every(line => ctx.measureText(line).width <= maxWidth);
      if (fits || size <= minSize) break;
      size -= 2;
    }

    return {
      text: clampLines(ctx, lines, maxLines, maxWidth),
      lineHeight: Math.round(size * lineHeightRatio)
    };
  }

  /** Bloco de várias linhas que encolhe até caber. Devolve o `y` de baixo. */
  private drawWrapped(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    options: WrapOptions
  ): number {
    ctx.save();
    const lines = this.fitLines(ctx, text, maxWidth, options.maxLines, options.font,
      options.maxSize, options.minSize, options.lineHeight);
    ctx.fillStyle = options.color;
    ctx.textBaseline = 'top';
    lines.text.forEach((line, i) => ctx.fillText(line, x, y + i * lines.lineHeight));
    ctx.restore();

    return y + lines.text.length * lines.lineHeight;
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

  /** Imagem original do time; `null` se não houver ou o CDN falhar (vira as iniciais). */
  private teamImage(nominee: NomineeTeam): Promise<HTMLImageElement | null> {
    return nominee.image ? loadImage(nominee.image).catch(() => null) : Promise.resolve(null);
  }
}
