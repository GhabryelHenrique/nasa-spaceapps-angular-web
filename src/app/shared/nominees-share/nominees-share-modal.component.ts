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
import { NomineeTeam } from '../../services/global-nominees.service';
import { GLOBAL_NOMINEES_YEAR } from '../data/global-nominees-2026.data';
import { SHARE_FORMATS, ShareFormat } from '../challenge-share/challenge-share.model';
import { downloadBlob } from '../challenge-share/download-file';
import { ZipEntry, createZip } from '../challenge-share/zip';
import { NomineesCardImageService } from './nominees-card-image.service';
import { buildNomineesCaption } from './nominees-caption';

/** Um slide já renderizado do carrossel. */
interface PostSlide {
  label: string;
  /** Pedaço do nome do arquivo: `02-mineiro`. */
  fileStem: string;
  blob: Blob;
  url: string;
}

/**
 * Exportação dos Global Nominees para o Instagram: carrossel com a capa (todos
 * os times) e um slide por time, mais a legenda pronta. Mesma interface do
 * modal dos desafios — o desenho fica no `NomineesCardImageService`.
 */
@Component({
  selector: 'app-nominees-share-modal',
  imports: [],
  templateUrl: './nominees-share-modal.component.html',
  styleUrl: '../challenge-share/challenge-share-modal.component.scss'
})
export class NomineesShareModalComponent {
  readonly nominees = input.required<NomineeTeam[]>();
  readonly year = input<number>(GLOBAL_NOMINEES_YEAR);
  readonly closed = output<void>();

  private readonly cardImage = inject(NomineesCardImageService);

  readonly formats = SHARE_FORMATS;
  readonly format = signal<ShareFormat>(SHARE_FORMATS[0]);
  readonly slides = signal<PostSlide[]>([]);
  readonly selected = signal(0);
  readonly rendering = signal(false);
  readonly error = signal('');
  readonly copied = signal(false);

  readonly current = computed<PostSlide | undefined>(() => this.slides()[this.selected()]);

  /** Legenda editada pelo usuário; `null` enquanto ele não mexe, aí vale a sugerida. */
  private readonly editedCaption = signal<string | null>(null);
  readonly suggestedCaption = computed(() => buildNomineesCaption(this.nominees(), this.year()));
  readonly caption = computed(() => this.editedCaption() ?? this.suggestedCaption());

  /** Cada troca de formato começa um novo desenho; o anterior para no meio. */
  private renderRun = 0;

  constructor() {
    effect(() => {
      const nominees = this.nominees();
      const format = this.format();
      const year = this.year();
      // `build()` lê e grava `slides` — sem o `untracked`, o effect redesenharia em loop.
      untracked(() => void this.build(nominees, format, year));
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

  /** O carrossel inteiro em um .zip, com os slides numerados na ordem e a legenda. */
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
    try {
      await navigator.clipboard.writeText(this.caption());
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

  /** `spaceapps-2026-global-nominees-feed`. */
  private baseName(): string {
    return `spaceapps-${this.year()}-global-nominees-${this.format().id}`;
  }

  /** Desenha slide a slide, publicando cada um assim que fica pronto. */
  private async build(nominees: NomineeTeam[], format: ShareFormat, year: number): Promise<void> {
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
      await this.cardImage.renderCover(canvas, nominees, format, year);
      if (!(await add('Capa', 'capa'))) return;

      for (const nominee of nominees) {
        await this.cardImage.renderTeam(canvas, nominee, format, year);
        if (!(await add(nominee.name, nominee.slug))) return;
      }
    } catch {
      if (run === this.renderRun) {
        this.error.set('Não foi possível gerar o post. Recarregue a página e tente de novo.');
      }
    } finally {
      if (run === this.renderRun) this.rendering.set(false);
    }
  }

  private revoke(slides: PostSlide[]): void {
    slides.forEach(slide => URL.revokeObjectURL(slide.url));
  }
}
