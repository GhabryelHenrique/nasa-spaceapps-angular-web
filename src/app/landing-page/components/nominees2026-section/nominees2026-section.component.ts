import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { GlobalNomineesService, NomineeTeam } from '../../../services/global-nominees.service';
import { GLOBAL_NOMINEES_2026, GLOBAL_NOMINEES_YEAR } from '../../../shared/data/global-nominees-2026.data';
import { NomineesShareModalComponent } from '../../../shared/nominees-share/nominees-share-modal.component';

/**
 * Global Nominees 2026 — primeiro bloco depois do hero.
 *
 * Os cartões aparecem logo com a lista estática (`GLOBAL_NOMINEES_2026`) e
 * ganham imagem, projeto e desafio quando o teams.json chega. O botão do
 * Instagram abre o carrossel de divulgação com todos os indicados.
 */
@Component({
  selector: 'app-nominees2026-section',
  imports: [RouterLink, NomineesShareModalComponent],
  templateUrl: './nominees2026-section.component.html',
  styleUrl: './nominees2026-section.component.scss'
})
export class Nominees2026SectionComponent {
  readonly year = GLOBAL_NOMINEES_YEAR;

  private readonly resolved = toSignal(inject(GlobalNomineesService).nominees());

  readonly nominees = computed<NomineeTeam[]>(() => this.resolved() ?? GLOBAL_NOMINEES_2026);
  /** O post só faz sentido com projeto, desafio e imagem já cruzados. */
  readonly ready = computed(() => this.resolved() !== undefined);

  readonly sharing = signal(false);

  openShare(): void {
    this.sharing.set(true);
  }

  closeShare(): void {
    this.sharing.set(false);
  }

  initials(name: string): string {
    return name
      .split(/[\s.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('');
  }
}
