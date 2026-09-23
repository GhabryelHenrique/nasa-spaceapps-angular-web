import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { TeamsService } from '../services/teams.service';
import { Team } from '../shared/data/teams.data';
import { CURRENT_CHALLENGE_YEAR } from '../shared/data/challenges.data';
import { REGISTRATION_URL } from '../shared/data/registration.data';

/** Edições com listagem de times, da mais recente para a mais antiga. */
export const TEAMS_YEARS = [2026, 2025];

type SubmissionStatus = '' | 'submitted' | 'not-submitted';

@Component({
  selector: 'app-teams',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly teamsService = inject(TeamsService);

  readonly years = TEAMS_YEARS;
  readonly registrationUrl = REGISTRATION_URL;

  /**
   * Ano vem do `data` da rota (/times/2025 | /times/2026). Via observable, e não
   * do snapshot, porque o seletor de edição troca de URL reusando a mesma
   * instância do componente — com snapshot a página não atualizaria.
   */
  readonly year = toSignal(
    this.route.data.pipe(map(d => (d['year'] as number) ?? CURRENT_CHALLENGE_YEAR)),
    { initialValue: CURRENT_CHALLENGE_YEAR }
  );

  readonly isCurrentEdition = computed(() => this.year() === CURRENT_CHALLENGE_YEAR);

  readonly loading = signal(true);
  readonly error = signal('');

  /** Times da edição sem nenhum filtro; a filtragem toda acontece em memória. */
  private readonly allTeams = signal<Team[]>([]);

  readonly searchQuery = signal('');
  readonly selectedChallenge = signal('');
  readonly selectedSubmissionStatus = signal<SubmissionStatus>('');
  readonly onlyOpenTeams = signal(false);

  constructor() {
    effect(() => this.load(this.year()));
  }

  // ── Dados derivados ───────────────────────────────────────

  /** Desafios efetivamente escolhidos pelos times da edição. */
  readonly availableChallenges = computed(() => {
    const byId = new Map<string, string>();

    for (const team of this.allTeams()) {
      const challenge = team.challengeDetails;
      if (challenge?.title) {
        byId.set(challenge.id || team.challenge, challenge.title);
      }
    }

    return [...byId.entries()]
      .map(([id, title]) => ({ id, title }))
      .sort((a, b) => a.title.localeCompare(b.title));
  });

  /**
   * Antes do hackathon ninguém submeteu nada — o filtro de status só aparece
   * quando existe ao menos um projeto entregue.
   */
  readonly hasSubmissions = computed(() => this.allTeams().some(t => t.projectSubmitted));

  /** Idem para "aberto a novos membros", que só vale enquanto dá para entrar. */
  readonly hasOpenTeams = computed(() => this.allTeams().some(t => t.joinEnabled));

  readonly openTeamsCount = computed(() => this.allTeams().filter(t => t.joinEnabled).length);
  readonly submittedCount = computed(() => this.allTeams().filter(t => t.projectSubmitted).length);
  readonly totalTeams = computed(() => this.allTeams().length);

  readonly teams = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const challengeId = this.selectedChallenge();
    const status = this.selectedSubmissionStatus();
    const openOnly = this.onlyOpenTeams();

    return this.allTeams().filter(team => {
      if (query) {
        const haystack = [team.title, team.excerpt, team.challengeDetails?.title]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      if (challengeId && (team.challengeDetails?.id || team.challenge) !== challengeId) return false;
      if (status === 'submitted' && !team.projectSubmitted) return false;
      if (status === 'not-submitted' && team.projectSubmitted) return false;
      if (openOnly && !team.joinEnabled) return false;

      return true;
    });
  });

  readonly hasActiveFilters = computed(
    () =>
      !!this.searchQuery() ||
      !!this.selectedChallenge() ||
      !!this.selectedSubmissionStatus() ||
      this.onlyOpenTeams()
  );

  readonly selectedChallengeTitle = computed(
    () => this.availableChallenges().find(c => c.id === this.selectedChallenge())?.title ?? ''
  );

  readonly submissionStatusLabel = computed(() => {
    switch (this.selectedSubmissionStatus()) {
      case 'submitted':
        return 'Projeto submetido';
      case 'not-submitted':
        return 'Projeto não submetido';
      default:
        return '';
    }
  });

  // ── Carregamento ──────────────────────────────────────────

  private load(year: number): void {
    this.loading.set(true);
    this.error.set('');

    this.teamsService.getTeams(year).subscribe({
      next: response => {
        this.allTeams.set(response?.data?.[0]?.teams?.edges?.map(edge => edge.node) ?? []);
        this.loading.set(false);
      },
      error: err => {
        console.error('[Times] erro ao carregar times:', err);
        this.error.set('Erro ao carregar times. Tente novamente mais tarde.');
        this.loading.set(false);
      }
    });
  }

  retry(): void {
    this.load(this.year());
  }

  // ── Ações e helpers de template ───────────────────────────

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedChallenge.set('');
    this.selectedSubmissionStatus.set('');
    this.onlyOpenTeams.set(false);
  }

  getTeamImageUrl(team: Team): string {
    return team.featuredImage?.rendition?.url || '/assets/nasa-spaceapps-logo.png';
  }

  /** 2026 vem com `displayName` vazio; o `title` ("Uberlândia") é o fallback. */
  getLocationLabel(team: Team): string {
    return team.locationDetails?.displayName || team.locationDetails?.title || '';
  }

  getOfficialUrl(team: Team): string {
    return `https://www.spaceappschallenge.org${team.meta.relativeUrl}`;
  }
}
