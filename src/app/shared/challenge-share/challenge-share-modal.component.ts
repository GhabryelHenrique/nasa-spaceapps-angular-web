import {
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';
import { Challenge, CURRENT_CHALLENGE_YEAR } from '../data/challenges.data';
import { ChallengeCardImageService } from './challenge-card-image.service';
import { buildInstagramCaption } from './challenge-caption';
import { downloadBlob } from './download-file';
import { SHARE_FORMATS, ShareFormat } from './challenge-share.model';

/**
 * Exportação do desafio para o Instagram: card em PNG 1080px + legenda pronta.
 *
 * O card é desenhado no canvas pelo `ChallengeCardImageService`; aqui fica só a
 * interface (prévia, troca de formato, download e cópia da legenda).
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
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('cardCanvas');

  readonly formats = SHARE_FORMATS;
  readonly format = signal<ShareFormat>(SHARE_FORMATS[0]);
  readonly rendering = signal(false);
  readonly error = signal('');
  readonly copied = signal(false);

  /** Legenda editada pelo usuário; `null` enquanto ele não mexe, aí vale a sugerida. */
  private readonly editedCaption = signal<string | null>(null);
  readonly suggestedCaption = computed(() => buildInstagramCaption(this.challenge(), this.year()));
  readonly caption = computed(() => this.editedCaption() ?? this.suggestedCaption());

  constructor() {
    effect(() => {
      const challenge = this.challenge();
      const format = this.format();
      const year = this.year();
      void this.draw(challenge, format, year);
    });
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
      downloadBlob(blob, this.cardImage.fileName(this.challenge(), this.format(), this.year()));
    } catch {
      this.error.set('Não foi possível baixar a imagem. Tente novamente.');
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

  private async draw(challenge: Challenge, format: ShareFormat, year: number): Promise<void> {
    this.rendering.set(true);
    this.error.set('');

    try {
      await this.cardImage.render(this.canvasRef().nativeElement, challenge, format, year);
    } catch {
      this.error.set('Não foi possível gerar o card. Recarregue a página e tente de novo.');
    } finally {
      this.rendering.set(false);
    }
  }
}
