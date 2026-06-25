import { Component, OnDestroy, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './landing-page/components/header/header.component';
import { FooterComponent } from './core/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'nasa-spaceapps-angular-web';
  private revealObserver: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => {
      this.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              this.revealObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      const observe = () => {
        document.querySelectorAll('.reveal').forEach((el) => {
          this.revealObserver?.observe(el);
        });
      };

      observe();
      setTimeout(observe, 300);
      setTimeout(observe, 800);
    });
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }
}
