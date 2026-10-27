/**
 * Utilidades de canvas compartilhadas pelos cards de divulgação (desafios e
 * palestras). Tudo aqui é função pura sobre o contexto 2D — o layout de cada
 * card fica no serviço correspondente.
 */

/** Ponto focal do recorte, em frações de 0 a 1 (equivalente ao `object-position`). */
export interface Focus {
  x: number;
  y: number;
}

const CENTER: Focus = { x: 0.5, y: 0.5 };

const imageCache = new Map<string, Promise<HTMLImageElement>>();
const fontCache = new Map<string, Promise<void>>();

/** Zera o canvas no tamanho real do card e devolve o contexto. */
export function prepareCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponível neste navegador.');

  canvas.width = width;
  canvas.height = height;
  return ctx;
}

/** PNG do canvas, pronto para download. */
export function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Não foi possível gerar a imagem.'))),
      'image/png'
    );
  });
}

/** `object-fit: cover` no canvas — com recorte, senão a imagem vaza da área. */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  focus: Focus = CENTER
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
    x + (width - drawWidth) * focus.x,
    y + (height - drawHeight) * focus.y,
    drawWidth,
    drawHeight
  );
  ctx.restore();
}

/** Converte um `object-position` em porcentagem ("50% 35%") no ponto focal. */
export function parseFocus(position: string | undefined, fallback: Focus = CENTER): Focus {
  const match = position?.match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);
  return match ? { x: Number(match[1]) / 100, y: Number(match[2]) / 100 } : fallback;
}

/** Quebra só em espaço comum: o espaço inseparável (U+00A0) mantém as palavras juntas. */
export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = '';

  for (const word of text.split(/[ \t\r\n]+/)) {
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
export function clampLines(
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

export function roundRect(
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
export function setLetterSpacing(ctx: CanvasRenderingContext2D, value: string): void {
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = value;
}

/** Imagens são assets locais: o canvas não fica "tainted" e o `toBlob()` funciona. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached) return cached;

  const loading = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Não foi possível carregar a imagem ${src}.`));
    img.src = src;
  });

  imageCache.set(src, loading);
  return loading;
}

/**
 * Sem isto o primeiro card sai em fonte de sistema: as fontes do Google só
 * são baixadas quando algo no DOM pede — o canvas não conta.
 */
export function loadFonts(fonts: string[]): Promise<void> {
  const key = fonts.join('|');
  let ready = fontCache.get(key);

  if (!ready) {
    ready = Promise.all(fonts.map(font => document.fonts.load(font)))
      .then(() => undefined)
      .catch(() => undefined);
    fontCache.set(key, ready);
  }

  return ready;
}
