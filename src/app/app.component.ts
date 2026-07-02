import { Component, OnDestroy, afterNextRender, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './landing-page/components/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'nasa-spaceapps-angular-web';
  private revealObserver: IntersectionObserver | null = null;
  private routerSubscription: Subscription | null = null;

  constructor() {
    const router = inject(Router);

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
          // Se já tem a classe 'visible', não precisamos re-observar
          if (!el.classList.contains('visible')) {
            this.revealObserver?.observe(el);
          }
        });
      };

      observe();
      setTimeout(observe, 300);
      setTimeout(observe, 800);

      // Escuta eventos de rota para re-observar quando o usuário navega
      this.routerSubscription = router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe(() => {
        // Roda a observação após as transições de rota
        setTimeout(observe, 150);
        setTimeout(observe, 600);
        setTimeout(observe, 1200);
      });
    });
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.routerSubscription?.unsubscribe();
  }
}
