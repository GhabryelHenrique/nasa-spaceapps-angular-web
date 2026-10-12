import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Player do YouTube responsivo (16:9). Recebe só o ID do vídeo e monta a URL
 * de embed — assim o `bypassSecurityTrustResourceUrl` nunca vê URL arbitrária.
 */
@Component({
  selector: 'app-youtube-embed',
  template: `
    <div class="video-frame">
      <iframe
        [src]="embedUrl()"
        [title]="title()"
        loading="lazy"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  `,
  styleUrl: './youtube-embed.component.scss',
})
export class YoutubeEmbedComponent {
  readonly videoId = input.required<string>();
  readonly title = input('YouTube video player');

  private readonly sanitizer = inject(DomSanitizer);

  readonly embedUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${encodeURIComponent(this.videoId())}`
    )
  );
}
