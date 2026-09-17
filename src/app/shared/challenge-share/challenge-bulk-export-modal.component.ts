import { Component, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { Challenge, CURRENT_CHALLENGE_YEAR } from '../data/challenges.data';
import { ChallengeCardImageService } from './challenge-card-image.service';
import { buildCollectionCaption } from './challenge-caption';
import { SHARE_FORMATS, ShareFormatId } from './challenge-share.model';
import { downloadBlob } from './download-file';
import { ZipBytes, ZipEntry, createZip } from './zip';

type ExportState = 'idle' | 'working' | 'done';

/**
 * Kit de divulgação: todos os desafios, nos dois formatos, em um .zip — mais a
 * legenda única do carrossel.
 *
 * Um zip em vez de N downloads porque o navegador bloqueia downloads em série;
 * e porque 28 arquivos soltos na pasta de downloads não ajudam ninguém.
 */
@Component({
  selector: 'app-challenge-bulk-export-modal',
  imports: [],
  templateUrl: './challenge-bulk-export-modal.component.html',
  styleUrl: './challenge-bulk-export-modal.component.scss'
})
export class ChallengeBulkExportModalComponent {
  readonly challenges = input.required<Challenge[]>();
  readonly year = input<number>(CURRENT_CHALLENGE_YEAR);
  readonly closed = output<void>();

  private readonly cardImage = inject(ChallengeCardImageService);

  readonly formats = SHARE_FORMATS;
  readonly selectedFormats = signal<ShareFormatId[]>(SHARE_FORMATS.map(format => format.id));

  readonly state = signal<ExportState>('idle');
  readonly progress = signal(0);
  readonly currentLabel = signal('');
  readonly error = signal('');
  readonly copied = signal(false);

  /** Cada formato rende capa + um card por desafio + encerramento. */
  readonly total = computed(() => (this.challenges().length + 2) * this.selectedFormats().length);
  readonly percent = computed(() =>
    this.total() ? Math.round((this.progress() / this.total()) * 100) : 0
  );

  private readonly editedCaption = signal<string | null>(null);
  readonly suggestedCaption = computed(() => buildCollectionCaption(this.year()));
  readonly caption = computed(() => this.editedCaption() ?? this.suggestedCaption());

  isSelected(id: ShareFormatId): boolean {
    return this.selectedFormats().includes(id);
  }

  toggleFormat(id: ShareFormatId): void {
    this.selectedFormats.update(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id]
    );
  }

  onCaptionInput(event: Event): void {
    this.editedCaption.set((event.target as HTMLTextAreaElement).value);
    this.copied.set(false);
  }

  resetCaption(): void {
    this.editedCaption.set(null);
    this.copied.set(false);
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

  async generate(): Promise<void> {
    const formats = this.formats.filter(format => this.isSelected(format.id));
    if (!formats.length || this.state() === 'working') return;

    this.state.set('working');
    this.progress.set(0);
    this.error.set('');

    // Um canvas só, reaproveitado: `render()` já redimensiona a cada card.
    const canvas = document.createElement('canvas');
    const entries: ZipEntry[] = [];

    try {
      for (const format of formats) {
        const folder = format.id === 'feed' ? 'feed' : 'stories';

        // 00 e 99 para a capa e o encerramento caírem nas pontas da ordenação.
        this.currentLabel.set(`${format.label} · Capa`);
        await this.cardImage.renderCover(canvas, format, this.year(), this.challenges().length);
        entries.push({ name: `${folder}/00-capa.png`, data: await this.toBytes(canvas) });
        this.progress.update(done => done + 1);
        await this.yieldToBrowser();

        for (const [index, challenge] of this.challenges().entries()) {
          this.currentLabel.set(`${format.label} · ${challenge.title}`);

          await this.cardImage.render(canvas, challenge, format, this.year());
          const position = String(index + 1).padStart(2, '0');

          entries.push({
            name: `${folder}/${position}-${this.cardImage.shortSlug(challenge)}.png`,
            data: await this.toBytes(canvas)
          });

          this.progress.update(done => done + 1);
          await this.yieldToBrowser();
        }

        this.currentLabel.set(`${format.label} · Encerramento`);
        await this.cardImage.renderClosing(canvas, format, this.year());
        entries.push({ name: `${folder}/99-encerramento.png`, data: await this.toBytes(canvas) });
        this.progress.update(done => done + 1);
        await this.yieldToBrowser();
      }

      entries.push({
        name: 'legenda.txt',
        data: new TextEncoder().encode(this.caption())
      });

      downloadBlob(createZip(entries), `spaceapps-${this.year()}-kit-divulgacao.zip`);
      this.state.set('done');
      this.currentLabel.set('');
    } catch {
      this.state.set('idle');
      this.error.set('Não foi possível gerar o kit. Recarregue a página e tente de novo.');
    }
  }

  private async toBytes(canvas: HTMLCanvasElement): Promise<ZipBytes> {
    const blob = await this.cardImage.toBlob(canvas);
    return new Uint8Array(await blob.arrayBuffer());
  }

  /** Devolve o controle ao navegador para a barra de progresso andar. */
  private yieldToBrowser(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve));
  }

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.state() !== 'working') this.close();
  }
}
