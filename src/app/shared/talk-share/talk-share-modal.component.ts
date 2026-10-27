import {
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild
} from '@angular/core';
import { CURRENT_CHALLENGE_YEAR } from '../data/challenges.data';
import { Talk } from '../data/talks.data';
import { SHARE_FORMATS, ShareFormat } from '../challenge-share/challenge-share.model';
import { downloadBlob } from '../challenge-share/download-file';
import { TalkCardImageService } from './talk-card-image.service';
import { buildTalkPostCaption } from './talk-caption';
import { TALK_POST_KINDS, TalkPostKind } from './talk-share.model';

/**
 * Exportação da palestra para o Instagram: post da pessoa ou da palestra, em
 * PNG 1080px, + legenda pronta. Mesma interface do modal dos desafios — o
 * layout dos posts fica no `TalkCardImageService`.
 */
@Component({
  selector: 'app-talk-share-modal',
  imports: [],
  templateUrl: './talk-share-modal.component.html',
  styleUrl: '../challenge-share/challenge-share-modal.component.scss'
})
export class TalkShareModalComponent {
  readonly talk = input.required<Talk>();
  /** Post aberto primeiro; dá para trocar dentro do modal. */
  readonly initialKind = input<TalkPostKind>('speaker');
  readonly year = input<number>(CURRENT_CHALLENGE_YEAR);
  readonly closed = output<void>();

  private readonly cardImage = inject(TalkCardImageService);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('cardCanvas');

  readonly kinds = TALK_POST_KINDS;
  readonly formats = SHARE_FORMATS;
  readonly kind = linkedSignal(() => this.initialKind());
  readonly format = signal<ShareFormat>(SHARE_FORMATS[0]);
  readonly rendering = signal(false);
  readonly error = signal('');
  readonly copied = signal(false);

  /** Legenda editada pelo usuário; volta para a sugerida ao trocar de post. */
  private readonly editedCaption = linkedSignal<TalkPostKind, string | null>({
    source: this.kind,
    computation: () => null
  });
  readonly suggestedCaption = computed(() => buildTalkPostCaption(this.talk(), this.kind(), this.year()));
  readonly caption = computed(() => this.editedCaption() ?? this.suggestedCaption());

  constructor() {
    effect(() => {
      const talk = this.talk();
      const kind = this.kind();
      const format = this.format();
      const year = this.year();
      void this.draw(talk, kind, format, year);
    });
  }

  selectKind(kind: TalkPostKind): void {
    this.kind.set(kind);
    this.copied.set(false);
  }

  selectFormat(format: ShareFormat): void {
    this.format.set(format);
  }

  onCaptionInput(event: Event): void {
    this.editedCaption.set((event.target as HTMLTextAreaElement).value);
    this.copied.set(false);
  }

  resetCaption(): void {
    this.editedCaption.set(null);
    this.copied.set(false);
  }

  async download(): Promise<void> {
    try {
      const blob = await this.cardImage.toBlob(this.canvasRef().nativeElement);
      downloadBlob(blob, this.cardImage.fileName(this.talk(), this.kind(), this.format()));
    } catch {
      this.error.set('Não foi possível baixar a imagem. Tente novamente.');
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

  private async draw(talk: Talk, kind: TalkPostKind, format: ShareFormat, year: number): Promise<void> {
    this.rendering.set(true);
    this.error.set('');

    try {
      await this.cardImage.render(this.canvasRef().nativeElement, talk, kind, format, year);
    } catch {
      this.error.set('Não foi possível gerar o post. Recarregue a página e tente de novo.');
    } finally {
      this.rendering.set(false);
    }
  }
}
