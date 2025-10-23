import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WinnerTeamsService } from '../services/winner-teams.service';
import { WinnerTeam, MediaItem } from '../shared/data/winner-teams.data';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-winner-team-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './winner-team-detail.component.html',
  styleUrl: './winner-team-detail.component.scss'
})
export class WinnerTeamDetailComponent implements OnInit {
  team?: WinnerTeam;
  loading = true;
  error = '';
  selectedMedia?: MediaItem;
  selectedMediaIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private winnerTeamsService: WinnerTeamsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.loadTeam(slug);
    });
  }

  loadTeam(slug: string): void {
    this.loading = true;
    this.error = '';

    this.winnerTeamsService.getWinnerTeamBySlug(slug).subscribe({
      next: (team) => {
        if (team) {
          this.team = team;
          if (team.mediaGallery && team.mediaGallery.length > 0) {
            this.selectedMedia = team.mediaGallery[0];
            this.selectedMediaIndex = 0;
          }
        } else {
          this.error = 'Equipe vencedora não encontrada.';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar dados da equipe. Tente novamente mais tarde.';
        this.loading = false;
        console.error('Error loading winner team:', error);
      }
    });
  }

  selectMedia(media: MediaItem, index: number): void {
    this.selectedMedia = media;
    this.selectedMediaIndex = index;
  }

  nextMedia(): void {
    if (!this.team || !this.team.mediaGallery) return;
    const nextIndex = (this.selectedMediaIndex + 1) % this.team.mediaGallery.length;
    this.selectMedia(this.team.mediaGallery[nextIndex], nextIndex);
  }

  previousMedia(): void {
    if (!this.team || !this.team.mediaGallery) return;
    const prevIndex = this.selectedMediaIndex === 0
      ? this.team.mediaGallery.length - 1
      : this.selectedMediaIndex - 1;
    this.selectMedia(this.team.mediaGallery[prevIndex], prevIndex);
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goBack(): void {
    this.router.navigate(['/times']);
  }

  getDefaultImage(): string {
    return '/assets/nasa-spaceapps-logo.png';
  }
}
