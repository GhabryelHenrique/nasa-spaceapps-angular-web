import {
  Component,
  DestroyRef,
  HostListener,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked
} from '@angular/core';
import { Challenge, CURRENT_CHALLENGE_YEAR } from '../data/challenges.data';
import { ChallengeCardImageService } from './challenge-card-image.service';
import { buildInstagramCaption } from './challenge-caption';
import { downloadBlob } from './download-file';
import { SHARE_FORMATS, ShareFormat } from './challenge-share.model';
import { ZipEntry, createZip } from './zip';

/** Limite de imagens por carrossel no Instagram. */
const INSTAGRAM_CAROUSEL_LIMIT = 20;

/** Um slide já renderizado do post. */
interface PostSlide {
  label: string;
  /** Pedaço do nome do arquivo: `02-contexto-1`. */
  fileStem: string;
  blob: Blob;
  url: string;
}

/**
 * Exportação do desafio para o Instagram: um carrossel com o card do resumo,
 * o enunciado completo (contexto, objetivos e considerações, paginados) e o
 * slide de encerramento — mais a legenda pronta.
 *
 * Os slides são desenhados no canvas pelo `ChallengeCardImageService`; aqui fica
 * só a interface (prévia, troca de formato, downloads e cópia da legenda).
 */
@Component({
  selector: 'app-challenge-share-modal',
  imports: [],
  templateUrl: './challenge-share-modal.component.html',
  styleUrl: './challenge-share-modal.component.scss'
})
export class ChallengeShareModalComponent {
  readonly challenge = input.required<Challenge>();
  readonly year = input<number>(CURRENT_CHALLENGE_YEAR);
  readonly closed = output<void>();

  private readonly cardImage = inject(ChallengeCardImageService);

  readonly formats = SHARE_FORMATS;
  readonly carouselLimit = INSTAGRAM_CAROUSEL_LIMIT;
  readonly format = signal<ShareFormat>(SHARE_FORMATS[0]);
  readonly slides = signal<PostSlide[]>([]);
  readonly selected = signal(0);
  readonly rendering = signal(false);
  readonly error = signal('');
  readonly copied = signal(false);

  readonly current = computed<PostSlide | undefined>(() => this.slides()[this.selected()]);

  /** Legenda editada pelo usuário; `null` enquanto ele não mexe, aí vale a sugerida. */
  private readonly editedCaption = signal<string | null>(null);
  readonly suggestedCaption = computed(() => buildInstagramCaption(this.challenge(), this.year()));
  readonly caption = computed(() => this.editedCaption() ?? this.suggestedCaption());

  /** Cada troca de formato começa um novo desenho; o anterior para no meio. */
  private renderRun = 0;

  constructor() {
    effect(() => {
      const challenge = this.challenge();
      const format = this.format();
      const year = this.year();
      // `build()` lê e grava `slides` — sem o `untracked`, o effect passaria a
      // depender dele e redesenharia o post em loop.
      untracked(() => void this.build(challenge, format, year));
    });

    inject(DestroyRef).onDestroy(() => {
      this.renderRun++;
      this.revoke(this.slides());
    });
  }

  selectFormat(format: ShareFormat): void {
    this.format.set(format);
  }

  select(index: number): void {
    const last = this.slides().length - 1;
    this.selected.set(Math.min(Math.max(index, 0), last));
  }

  onCaptionInput(event: Event): void {
    this.editedCaption.set((event.target as HTMLTextAreaElement).value);
    this.copied.set(false);
  }

  resetCaption(): void {
    this.editedCaption.set(null);
    this.copied.set(false);
  }

  downloadCurrent(): void {
    const slide = this.current();
    if (!slide) return;
    downloadBlob(slide.blob, `${this.baseName()}-${slide.fileStem}.png`);
  }

  /** O post inteiro em um .zip, com os slides numerados na ordem do carrossel e a legenda. */
  async downloadAll(): Promise<void> {
    try {
      const entries: ZipEntry[] = await Promise.all(
        this.slides().map(async slide => ({
          name: `${slide.fileStem}.png`,
          data: new Uint8Array(await slide.blob.arrayBuffer())
        }))
      );
      entries.push({ name: 'legenda.txt', data: new TextEncoder().encode(this.caption()) });
      downloadBlob(createZip(entries), `${this.baseName()}.zip`);
    } catch {
      this.error.set('Não foi possível gerar o .zip. Tente novamente.');
    }
  }

  async copyCaption(): Promise<void> {
    const text = this.caption();

    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    } catch {
      this.error.set('O navegador bloqueou a cópia. Selecione o texto e copie manualmente.');
    }
  }

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  /** Setas trocam de slide — menos quando o foco está na legenda, onde elas movem o cursor. */
  @HostListener('document:keydown.arrowright', ['$event'])
  onNext(event: Event): void {
    if (!this.isTyping(event)) this.select(this.selected() + 1);
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  onPrevious(event: Event): void {
    if (!this.isTyping(event)) this.select(this.selected() - 1);
  }

  private isTyping(event: Event): boolean {
    return event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement;
  }

  /** `spaceapps-2026-slug-do-desafio-feed`. */
  private baseName(): string {
    return `spaceapps-${this.year()}-${this.cardImage.shortSlug(this.challenge())}-${this.format().id}`;
  }

  /**
   * Desenha o carrossel slide a slide, publicando cada um assim que fica pronto —
   * a prévia aparece logo, sem esperar os dez ou doze slides de texto.
   */
  private async build(challenge: Challenge, format: ShareFormat, year: number): Promise<void> {
    const run = ++this.renderRun;
    const canvas = document.createElement('canvas');

    this.revoke(this.slides());
    this.slides.set([]);
    this.selected.set(0);
    this.rendering.set(true);
    this.error.set('');

    const add = async (label: string, slug: string): Promise<boolean> => {
      if (run !== this.renderRun) return false;
      const blob = await this.cardImage.toBlob(canvas);
      if (run !== this.renderRun) return false;

      const position = String(this.slides().length + 1).padStart(2, '0');
      this.slides.update(slides => [
        ...slides,
        { label, fileStem: `${position}-${slug}`, blob, url: URL.createObjectURL(blob) }
      ]);
      return true;
    };

    try {
      await this.cardImage.render(canvas, challenge, format, year);
      if (!(await add('Resumo', 'resumo'))) return;

      const statementSlides = await this.cardImage.planStatementSlides(challenge, format);
      for (const slide of statementSlides) {
        await this.cardImage.renderStatement(canvas, challenge, slide, format);
        const suffix = slide.pages > 1 ? ` ${slide.page}/${slide.pages}` : '';
        const slug = this.slugify(slide.sectionTitle) + (slide.pages > 1 ? `-${slide.page}` : '');
        if (!(await add(`${slide.sectionTitle}${suffix}`, slug))) return;
      }

      await this.cardImage.renderClosing(canvas, format, year);
      await add('Encerramento', 'encerramento');
    } catch {
      if (run === this.renderRun) {
        this.error.set('Não foi possível gerar o post. Recarregue a página e tente de novo.');
      }
    } finally {
      if (run === this.renderRun) this.rendering.set(false);
    }
  }

  private slugify(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
  }

  private revoke(slides: PostSlide[]): void {
    slides.forEach(slide => URL.revokeObjectURL(slide.url));
  }
}
