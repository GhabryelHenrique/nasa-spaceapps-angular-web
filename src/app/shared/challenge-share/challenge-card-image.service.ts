import { Injectable } from '@angular/core';
import { Challenge } from '../data/challenges.data';
import { ShareFormat } from './challenge-share.model';

/**
 * Desenha o card de divulgação de um desafio direto no canvas.
 *
 * Canvas em vez de captura de DOM (html2canvas e afins) por três motivos: não
 * adiciona dependência, sai sempre em 1080px reais (o Instagram recomprime
 * qualquer coisa menor) e o layout não depende do CSS da página.
 *
 * Todas as imagens usadas são assets locais — o canvas não fica "tainted" e o
 * `toBlob()` funciona.
 */

const DEEP_BLUE = '#07173F';
const BLUE_YONDER = '#2E96F5';
const NEON_YELLOW = '#EAFE07';
const WHITE = '#FFFFFF';
const TEXT_SECONDARY = '#C3D3EA';

const LOGO_SRC = 'assets/nasa-spaceapps-logo-removebg-preview.png';
const PATTERN_SRC = 'assets/patterns/Orbits.png';
/** Arte do tema 2026, usada na capa do carrossel. */
const THEME_SRC = 'assets/theme/next-frontier.png';

const EXCERPT_SIZE = 32;
const EXCERPT_LINE_HEIGHT = 46;
/** Respiro entre o fim do título e o começo do resumo. */
const TITLE_GAP = 26;
/** Altura da caixa de destaque do slide de encerramento. */
const HIGHLIGHT_HEIGHT = 176;

/** Fontes da marca que precisam estar carregadas antes do primeiro `fillText`. */
const REQUIRED_FONTS = [
  '900 64px "Fira Sans"',
  '700 28px "Overpass"',
  '300 34px "Overpass"'
];

interface Box {
  x: number;
  y: number;
  width: number;
}

@Injectable({ providedIn: 'root' })
export class ChallengeCardImageService {
  private readonly imageCache = new Map<string, Promise<HTMLImageElement>>();
  private fontsReady?: Promise<void>;

  /** Redesenha o card inteiro no canvas informado, no tamanho real do formato. */
  async render(
    canvas: HTMLCanvasElement,
    challenge: Challenge,
    format: ShareFormat,
    year: number
  ): Promise<void> {
    const ctx = this.prepare(canvas, format);

    const [photo, logo, pattern] = await Promise.all([
      this.loadImage(challenge.featuredImage.url),
      this.loadImage(LOGO_SRC),
      this.loadImage(PATTERN_SRC),
      this.loadFonts()
    ]);

    const pad = 76;
    const { top: footerTop, bottom: footerBottom } = this.footerBounds(format);
    const contentBottom = footerTop - 44;

    this.drawBackground(ctx, format, pattern);
    this.drawPhoto(ctx, photo, format);

    const content: Box = { x: pad, y: format.photoHeight + 22, width: format.width - pad * 2 };

    content.y = this.drawEyebrow(ctx, content, `DESAFIO OFICIAL · SPACE APPS ${year}`);
    content.y = this.drawDifficultyChips(ctx, challenge, content);

    // O título encolhe até sobrar espaço para pelo menos três linhas de resumo:
    // alguns títulos de 2026 passam de 100 caracteres.
    const titleMaxHeight = Math.max(
      120,
      contentBottom - content.y - EXCERPT_LINE_HEIGHT * 3 - TITLE_GAP
    );

    content.y = this.drawTitle(ctx, challenge.title, content, titleMaxHeight) + TITLE_GAP;
    this.drawExcerpt(ctx, challenge.excerpt, content, contentBottom);

    this.drawFooter(ctx, logo, format, footerTop, footerBottom, pad);
  }

  /**
   * Capa do carrossel: arte do tema, a manchete e o convite para arrastar.
   * Sem foto de desafio — é o slide que segura o scroll no feed.
   */
  async renderCover(
    canvas: HTMLCanvasElement,
    format: ShareFormat,
    year: number,
    challengeCount: number
  ): Promise<void> {
    const ctx = this.prepare(canvas, format);
    const [theme, logo, pattern] = await Promise.all([
      this.loadImage(THEME_SRC),
      this.loadImage(LOGO_SRC),
      this.loadImage(PATTERN_SRC),
      this.loadFonts()
    ]);

    const pad = 76;
    const width = format.width - pad * 2;
    const center = format.width / 2;
    const { top: footerTop, bottom: footerBottom } = this.footerBounds(format);

    this.drawBackground(ctx, format, pattern, true);

    // Holding shape circular com a arte do tema (Brand Guide, pág. 10).
    const radius = format.id === 'feed' ? 225 : 285;
    const artCenterY = radius + (format.id === 'feed' ? 105 : 190);
    this.drawCircularArt(ctx, theme, center, artCenterY, radius);

    let y = artCenterY + radius + (format.id === 'feed' ? 70 : 110);

    y = this.drawCenteredLabel(ctx, `NASA SPACE APPS CHALLENGE ${year}`, center, y);
    y += format.id === 'feed' ? 14 : 24;

    y = this.drawCenteredHeadline(ctx, `OS ${challengeCount} DESAFIOS`, center, y, width, WHITE);
    y = this.drawCenteredHeadline(ctx, 'JÁ ESTÃO NO AR', center, y, width, NEON_YELLOW);

    y += format.id === 'feed' ? 26 : 44;
    ctx.save();
    ctx.font = '300 34px "Overpass", sans-serif';
    ctx.fillStyle = TEXT_SECONDARY;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    // Espaço duplo em volta do "·": no Overpass Light o ponto cola na palavra seguinte.
    ctx.fillText('The Next Frontier  ·  A Próxima Fronteira', center, y);
    ctx.restore();

    // Pílula de instrução, ancorada logo acima do rodapé.
    // No feed o carrossel se arrasta; no story, avança no toque.
    const pill = format.id === 'feed' ? 'ARRASTA PARA VER TODOS  →' : 'TOCA PARA VER TODOS  →';
    this.drawPill(ctx, pill, center, footerTop - 110);

    this.drawFooter(ctx, logo, format, footerTop, footerBottom, pad);
  }

  /** Último slide: o que fazer depois de escolher o desafio. */
  async renderClosing(
    canvas: HTMLCanvasElement,
    format: ShareFormat,
    year: number
  ): Promise<void> {
    const ctx = this.prepare(canvas, format);
    const [logo, pattern] = await Promise.all([
      this.loadImage(LOGO_SRC),
      this.loadImage(PATTERN_SRC),
      this.loadFonts()
    ]);

    const pad = 76;
    const { top: footerTop, bottom: footerBottom } = this.footerBounds(format);
    const box: Box = { x: pad, y: format.id === 'feed' ? 150 : 260, width: format.width - pad * 2 };

    this.drawBackground(ctx, format, pattern, true);

    box.y = this.drawEyebrow(ctx, box, 'ESCOLHEU O SEU DESAFIO?');
    box.y = this.drawTitle(ctx, 'Agora é montar a equipe', box, 240) + 44;

    const steps = [
      'Monte uma equipe de até 6 pessoas — de qualquer idade e de qualquer área.',
      `Faça a inscrição gratuita na página de Uberlândia, no site oficial da NASA.`,
      'Apareça nos dias 14 e 15 de novembro. O projeto só pode começar lá.'
    ];

    // A caixa de data fica ancorada logo acima do rodapé, e os passos esticam
    // para ocupar o vão — no meio da página sobrava um vazio grande.
    const highlightTop = footerTop - 44 - HIGHLIGHT_HEIGHT;
    const stepsBottom = this.drawSteps(ctx, steps, box, highlightTop - 40);

    box.y = Math.max(stepsBottom + 30, highlightTop);
    this.drawHighlight(
      ctx,
      box,
      '14 E 15 DE NOVEMBRO',
      `Uberlândia (MG)  ·  Inscrição gratuita  ·  Space Apps ${year}`
    );

    this.drawFooter(
      ctx,
      logo,
      format,
      footerTop,
      footerBottom,
      pad,
      'INSCRIÇÃO NO LINK DA BIO',
      '@nasaspaceappsuberlandia'
    );
  }

  /** PNG do card, pronto para download. */
  async toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => (blob ? resolve(blob) : reject(new Error('Não foi possível gerar a imagem.'))),
        'image/png'
      );
    });
  }

  /** Nome de arquivo previsível: `spaceapps-2026-slug-do-desafio-feed.png`. */
  fileName(challenge: Challenge, format: ShareFormat, year: number): string {
    return `spaceapps-${year}-${this.shortSlug(challenge)}-${format.id}.png`;
  }

  /**
   * Slug cortado no limite de palavra. Os títulos de 2026 geram slugs de mais de
   * 100 caracteres, que estouram o limite de caminho do Windows quando o zip é
   * extraído dentro de uma pasta já funda.
   */
  shortSlug(challenge: Challenge, max = 44): string {
    const slug = challenge.slug;
    if (slug.length <= max) return slug;

    const cut = slug.lastIndexOf('-', max);
    return slug.slice(0, cut > 12 ? cut : max);
  }

  // ─── Blocos do card ─────────────────────────────────────────

  /** Zera o canvas no tamanho real do formato e devolve o contexto. */
  private prepare(canvas: HTMLCanvasElement, format: ShareFormat): CanvasRenderingContext2D {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D indisponível neste navegador.');

    canvas.width = format.width;
    canvas.height = format.height;
    return ctx;
  }

  private drawBackground(
    ctx: CanvasRenderingContext2D,
    format: ShareFormat,
    pattern: HTMLImageElement,
    /** Capa e encerramento usam o gradiente da marca; os cards, o azul chapado. */
    useBrandGradient = false
  ): void {
    if (useBrandGradient) {
      // Gradiente da marca a 45° descendo (Brand Guide 2026, pág. 8).
      const gradient = ctx.createLinearGradient(0, 0, format.width, format.height);
      gradient.addColorStop(0, '#0042A6');
      gradient.addColorStop(0.45, '#0A2F6B');
      gradient.addColorStop(1, DEEP_BLUE);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = DEEP_BLUE;
    }
    ctx.fillRect(0, 0, format.width, format.height);

    // Padrão da marca rebaixado, como nas seções do site (Brand Guide, pág. 19).
    const tile = ctx.createPattern(pattern, 'repeat');
    if (tile) {
      ctx.save();
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = tile;
      ctx.fillRect(0, 0, format.width, format.height);
      ctx.restore();
    }
  }

  private drawPhoto(
    ctx: CanvasRenderingContext2D,
    photo: HTMLImageElement,
    format: ShareFormat
  ): void {
    this.drawImageCover(ctx, photo, 0, 0, format.width, format.photoHeight);

    // Degradê para a foto morrer no fundo, sem emenda dura.
    const fade = ctx.createLinearGradient(0, format.photoHeight * 0.45, 0, format.photoHeight);
    fade.addColorStop(0, 'rgba(7, 23, 63, 0)');
    fade.addColorStop(0.65, 'rgba(7, 23, 63, 0.65)');
    fade.addColorStop(1, DEEP_BLUE);
    ctx.fillStyle = fade;
    ctx.fillRect(0, format.photoHeight * 0.45, format.width, format.photoHeight * 0.55 + 2);
  }

  /** Losango Neon Yellow + rótulo em caixa-alta. Devolve o novo `y`. */
  private drawEyebrow(ctx: CanvasRenderingContext2D, box: Box, label: string): number {
    const size = 12;
    const centerY = box.y + 14;

    ctx.save();
    ctx.translate(box.x + size / 2, centerY);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = NEON_YELLOW;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();

    ctx.save();
    this.setLetterSpacing(ctx, '4px');
    ctx.font = '700 26px "Overpass", sans-serif';
    ctx.fillStyle = BLUE_YONDER;
    ctx.textBaseline = 'middle';
    ctx.fillText(label, box.x + size + 16, centerY);
    ctx.restore();

    return box.y + 58;
  }

  /** Chips de dificuldade: contorno na cor do nível, texto branco. */
  private drawDifficultyChips(
    ctx: CanvasRenderingContext2D,
    challenge: Challenge,
    box: Box
  ): number {
    const height = 48;
    const padX = 22;
    const gap = 12;
    let x = box.x;

    ctx.save();
    ctx.font = '700 24px "Overpass", sans-serif';
    ctx.textBaseline = 'middle';
    this.setLetterSpacing(ctx, '1.5px');

    for (const category of challenge.categories) {
      const label = category.name.toUpperCase();
      const width = ctx.measureText(label).width + padX * 2;

      // Quebra para a linha de baixo se estourar a largura útil.
      if (x + width > box.x + box.width && x > box.x) break;

      ctx.beginPath();
      this.roundRect(ctx, x, box.y, width, height, height / 2);
      ctx.fillStyle = 'rgba(7, 23, 63, 0.55)';
      ctx.fill();
      ctx.strokeStyle = category.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = WHITE;
      ctx.fillText(label, x + padX, box.y + height / 2 + 1);

      x += width + gap;
    }

    ctx.restore();
    return box.y + height + 34;
  }

  /**
   * Título em Fira Sans Black. Encolhe a fonte até o bloco caber em
   * `maxHeight`; se nem no menor corpo couber, corta com reticências.
   * Devolve o `y` onde o título termina de verdade.
   */
  private drawTitle(
    ctx: CanvasRenderingContext2D,
    title: string,
    box: Box,
    maxHeight: number
  ): number {
    const text = title.toUpperCase();
    let size = 58;
    let lines: string[] = [];
    let lineHeight = 0;

    ctx.save();
    this.setLetterSpacing(ctx, '1px');

    while (true) {
      ctx.font = `900 ${size}px "Fira Sans", sans-serif`;
      lines = this.wrapText(ctx, text, box.width);
      lineHeight = Math.round(size * 1.12);
      if (lines.length * lineHeight <= maxHeight || size <= 36) break;
      size -= 3;
    }

    const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight));
    lines = this.clampLines(ctx, lines, maxLines, box.width);

    ctx.fillStyle = WHITE;
    ctx.textBaseline = 'top';
    lines.forEach((line, i) => ctx.fillText(line, box.x, box.y + i * lineHeight));
    ctx.restore();

    return box.y + lines.length * lineHeight;
  }

  /** Resumo em Overpass Light, cortado no limite do espaço livre. */
  private drawExcerpt(
    ctx: CanvasRenderingContext2D,
    excerpt: string,
    box: Box,
    limitY: number
  ): void {
    const maxLines = Math.max(1, Math.floor((limitY - box.y) / EXCERPT_LINE_HEIGHT));

    ctx.save();
    ctx.font = `300 ${EXCERPT_SIZE}px "Overpass", sans-serif`;
    ctx.fillStyle = TEXT_SECONDARY;
    ctx.textBaseline = 'top';

    const lines = this.clampLines(ctx, this.wrapText(ctx, excerpt, box.width), maxLines, box.width);
    lines.forEach((line, i) => ctx.fillText(line, box.x, box.y + i * EXCERPT_LINE_HEIGHT));
    ctx.restore();
  }

  // ─── Blocos da capa e do encerramento ───────────────────────

  /** Arte dentro do "holding shape" circular, com os anéis da identidade. */
  private drawCircularArt(
    ctx: CanvasRenderingContext2D,
    art: HTMLImageElement,
    centerX: number,
    centerY: number,
    radius: number
  ): void {
    ctx.save();
    ctx.strokeStyle = 'rgba(46, 150, 245, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(46, 150, 245, 0.18)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 56, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = 'rgba(2, 8, 24, 0.45)';
    ctx.fill();
    this.drawImageCover(ctx, art, centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();
  }

  /** Rótulo centralizado em Overpass Bold, com losango de cada lado. */
  private drawCenteredLabel(
    ctx: CanvasRenderingContext2D,
    label: string,
    centerX: number,
    y: number
  ): number {
    ctx.save();
    this.setLetterSpacing(ctx, '4px');
    ctx.font = '700 26px "Overpass", sans-serif';
    ctx.fillStyle = BLUE_YONDER;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(label, centerX, y);

    const half = ctx.measureText(label).width / 2;
    ctx.restore();

    for (const x of [centerX - half - 30, centerX + half + 30]) {
      ctx.save();
      ctx.translate(x, y + 14);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = NEON_YELLOW;
      ctx.fillRect(-6, -6, 12, 12);
      ctx.restore();
    }

    return y + 44;
  }

  /** Uma linha de manchete, encolhendo até caber na largura útil. */
  private drawCenteredHeadline(
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    y: number,
    maxWidth: number,
    color: string
  ): number {
    let size = 92;

    ctx.save();
    this.setLetterSpacing(ctx, '2px');
    while (size > 44) {
      ctx.font = `900 ${size}px "Fira Sans", sans-serif`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 3;
    }

    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(text, centerX, y);
    ctx.restore();

    return y + Math.round(size * 1.1);
  }

  /** Pílula contornada em Neon Yellow — o "arrasta para o lado" da capa. */
  private drawPill(
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    y: number
  ): void {
    const height = 76;

    ctx.save();
    this.setLetterSpacing(ctx, '3px');
    ctx.font = '700 28px "Overpass", sans-serif';
    const width = ctx.measureText(text).width + 76;

    ctx.beginPath();
    this.roundRect(ctx, centerX - width / 2, y, width, height, height / 2);
    ctx.fillStyle = 'rgba(234, 254, 7, 0.12)';
    ctx.fill();
    ctx.strokeStyle = NEON_YELLOW;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = NEON_YELLOW;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, y + height / 2 + 1);
    ctx.restore();
  }

  /**
   * Lista numerada do slide de encerramento. Com `fillTo`, distribui a sobra de
   * espaço nos vãos entre os passos em vez de deixar tudo amontoado no topo.
   * Devolve o `y` final.
   */
  private drawSteps(
    ctx: CanvasRenderingContext2D,
    steps: string[],
    box: Box,
    fillTo?: number
  ): number {
    const bullet = 54;
    const gapAfterBullet = 26;
    const lineHeight = 44;
    const textX = box.x + bullet + gapAfterBullet;
    const textWidth = box.width - bullet - gapAfterBullet;

    ctx.save();
    ctx.font = '300 31px "Overpass", sans-serif';
    const wrapped = steps.map(step => this.wrapText(ctx, step, textWidth));
    ctx.restore();

    const heights = wrapped.map(lines => Math.max(bullet, lines.length * lineHeight));
    let gap = 34;

    if (fillTo && steps.length > 1) {
      const natural = heights.reduce((total, height) => total + height, 0) + gap * (steps.length - 1);
      const spare = fillTo - box.y - natural;
      if (spare > 0) gap = Math.min(gap + spare / (steps.length - 1), 120);
    }

    let y = box.y;

    steps.forEach((step, index) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(box.x + bullet / 2, y + bullet / 2, bullet / 2, 0, Math.PI * 2);
      ctx.fillStyle = NEON_YELLOW;
      ctx.fill();

      ctx.font = '900 28px "Fira Sans", sans-serif';
      ctx.fillStyle = DEEP_BLUE;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(index + 1), box.x + bullet / 2, y + bullet / 2 + 2);
      ctx.restore();

      ctx.save();
      ctx.font = '300 31px "Overpass", sans-serif';
      ctx.fillStyle = TEXT_SECONDARY;
      ctx.textBaseline = 'top';
      wrapped[index].forEach((line, i) => ctx.fillText(line, textX, y + 6 + i * lineHeight));
      ctx.restore();

      y += heights[index] + (index < steps.length - 1 ? gap : 0);
    });

    return y;
  }

  /** Caixa de destaque com a data do hackathon. */
  private drawHighlight(
    ctx: CanvasRenderingContext2D,
    box: Box,
    title: string,
    subtitle: string
  ): void {
    const height = HIGHLIGHT_HEIGHT;

    ctx.save();
    ctx.beginPath();
    this.roundRect(ctx, box.x, box.y, box.width, height, 24);
    ctx.fillStyle = 'rgba(2, 8, 24, 0.42)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(46, 150, 245, 0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = NEON_YELLOW;
    ctx.fillRect(box.x + 34, box.y + 44, 6, height - 88);

    this.setLetterSpacing(ctx, '2px');
    ctx.font = '900 46px "Fira Sans", sans-serif';
    ctx.fillStyle = WHITE;
    ctx.textBaseline = 'middle';
    ctx.fillText(title, box.x + 62, box.y + height / 2 - 26);

    this.setLetterSpacing(ctx, '0px');
    ctx.font = '400 28px "Overpass", sans-serif';
    ctx.fillStyle = TEXT_SECONDARY;
    ctx.fillText(subtitle, box.x + 62, box.y + height / 2 + 32);
    ctx.restore();
  }

  /** Faixa do rodapé, já descontada a margem que o Instagram cobre no story. */
  private footerBounds(format: ShareFormat): { top: number; bottom: number } {
    const bottom = format.height - format.bottomSafe;
    return { top: bottom - Math.round(format.height * 0.115), bottom };
  }

  private drawFooter(
    ctx: CanvasRenderingContext2D,
    logo: HTMLImageElement,
    format: ShareFormat,
    footerTop: number,
    footerBottom: number,
    pad: number,
    primaryLine = '14 E 15 DE NOVEMBRO · UBERLÂNDIA (MG)',
    secondaryLine = '@nasaspaceappsuberlandia'
  ): void {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(pad, footerTop, format.width - pad * 2, 2);

    // Régua Neon Yellow marcando o início do rodapé.
    ctx.fillStyle = NEON_YELLOW;
    ctx.fillRect(pad, footerTop, 120, 2);

    const logoSize = 92;
    const logoY = footerTop + (footerBottom - footerTop - logoSize) / 2;
    const ratio = logo.width ? logo.height / logo.width : 1;
    ctx.drawImage(logo, pad, logoY, logoSize, logoSize * ratio);

    const textX = pad + logoSize + 28;
    const centerY = (footerTop + footerBottom) / 2;

    ctx.save();
    ctx.textBaseline = 'middle';

    this.setLetterSpacing(ctx, '2px');
    ctx.font = '900 30px "Fira Sans", sans-serif';
    ctx.fillStyle = WHITE;
    ctx.fillText(primaryLine, textX, centerY - 22);

    this.setLetterSpacing(ctx, '1px');
    ctx.font = '400 26px "Overpass", sans-serif';
    ctx.fillStyle = TEXT_SECONDARY;
    ctx.fillText(secondaryLine, textX, centerY + 24);
    ctx.restore();
  }

  // ─── Utilidades ─────────────────────────────────────────────

  /** `object-fit: cover` no canvas — com recorte, senão a imagem vaza da faixa. */
  private drawImageCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const scale = Math.max(width / img.width, height / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    ctx.drawImage(
      img,
      x + (width - drawWidth) / 2,
      y + (height - drawHeight) / 2,
      drawWidth,
      drawHeight
    );
    ctx.restore();
  }

  private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    let current = '';

    for (const word of text.split(/\s+/)) {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }

    if (current) lines.push(current);
    return lines;
  }

  /** Corta no número de linhas disponível e fecha a última com reticências. */
  private clampLines(
    ctx: CanvasRenderingContext2D,
    lines: string[],
    maxLines: number,
    maxWidth: number
  ): string[] {
    if (lines.length <= maxLines) return lines;

    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];

    // Corta por palavra: "…concluíram suas missõ…" fica pior que uma palavra a menos.
    while (last && ctx.measureText(`${last}…`).width > maxWidth) {
      const cut = last.lastIndexOf(' ');
      last = (cut > 0 ? last.slice(0, cut) : last.slice(0, -1)).trimEnd();
    }

    kept[maxLines - 1] = `${last.replace(/[.,;:]$/, '')}…`;
    return kept;
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, width, height, radius);
    } else {
      ctx.rect(x, y, width, height);
    }
  }

  /** `letterSpacing` não existe em todo navegador; onde falta, é só ignorado. */
  private setLetterSpacing(ctx: CanvasRenderingContext2D, value: string): void {
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = value;
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    const cached = this.imageCache.get(src);
    if (cached) return cached;

    const loading = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Não foi possível carregar a imagem ${src}.`));
      img.src = src;
    });

    this.imageCache.set(src, loading);
    return loading;
  }

  /**
   * Sem isto o primeiro card sai em fonte de sistema: as fontes do Google só
   * são baixadas quando algo no DOM pede — o canvas não conta.
   */
  private loadFonts(): Promise<void> {
    this.fontsReady ??= Promise.all(REQUIRED_FONTS.map(font => document.fonts.load(font)))
      .then(() => undefined)
      .catch(() => undefined);
    return this.fontsReady;
  }
}
