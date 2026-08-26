import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  const compiled = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // A busca de times dispara no ngOnInit; nenhum teste aqui depende dela.
    TestBed.inject(HttpTestingController).match(() => true).forEach(r => r.flush({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Section composition', () => {
    it('should render every section in order', () => {
      const order = [...compiled().querySelectorAll<HTMLElement>(
        'app-hero-section, app-registration-section, app-theme-section, app-countdown, ' +
        'app-timeline, app-recap2025-section, .winners-section, .nominees-section, ' +
        '.awards-section, .event-info-wrapper, .partner-section'
      )].map(el =>
        el.tagName.toLowerCase() === 'section'
          ? [...el.classList].find(c =>
              !c.startsWith('sa-section') && (c.endsWith('-section') || c.endsWith('-wrapper')))
          : el.tagName.toLowerCase()
      );

      expect(order).toEqual([
        'app-hero-section',
        'app-registration-section',
        'app-theme-section',
        'app-countdown',
        'app-timeline',
        'app-recap2025-section',
        'winners-section',
        'nominees-section',
        'awards-section',
        'event-info-wrapper',
        'partner-section'
      ]);
    });

    it('should declare exactly one tone per inline section', () => {
      // A alternância de fato entre TODAS as seções (incluindo as que são
      // componentes) é verificada no navegador, com as cores computadas.
      // Aqui trava-se o invariante estrutural: nenhuma seção sem tom, e
      // nenhuma com os dois.
      const sections = [...compiled().querySelectorAll('.sa-section')];
      expect(sections.length).toBeGreaterThan(1);

      for (const el of sections) {
        const tones = ['sa-section--deep', 'sa-section--sunken']
          .filter(c => el.classList.contains(c));
        expect(tones.length).withContext(el.className).toBe(1);
      }
    });

    it('should give every inline section the shared head structure', () => {
      for (const section of Array.from(compiled().querySelectorAll('.sa-section'))) {
        expect(section.querySelector('.sa-eyebrow')).withContext(section.className).toBeTruthy();
        expect(section.querySelector('.sa-title')).withContext(section.className).toBeTruthy();
      }
    });
  });

  describe('Destaques Globais', () => {
    it('should render a card per highlighted winner', () => {
      expect(compiled().querySelectorAll('.winner-card').length)
        .toBe(component.highlightedWinners.length);
    });

    it('should mark the top winner', () => {
      expect(compiled().querySelectorAll('.winner-card.is-top').length)
        .toBe(component.highlightedWinners.filter(w => w.isTopWinner).length);
    });

    it('should not place text on top of the team photo', () => {
      // Brand Guide 2026, pág. 10
      for (const photo of Array.from(compiled().querySelectorAll('.winner-photo'))) {
        expect(photo.textContent?.trim()).toBe('');
      }
    });
  });

  describe('Prêmios Especiais', () => {
    it('should render a card per special award', () => {
      expect(compiled().querySelectorAll('.special-award').length)
        .toBe(component.specialAwards.length);
    });

    it('should link each award out in a new tab, safely', () => {
      for (const link of Array.from(compiled().querySelectorAll<HTMLAnchorElement>('.special-award'))) {
        expect(link.target).toBe('_blank');
        expect(link.rel).toContain('noopener');
      }
    });
  });

  describe('Torne-se um Parceiro', () => {
    it('should appear exactly once', () => {
      // Esta seção estava duplicada literalmente na página.
      expect(compiled().querySelectorAll('.partner-card').length).toBe(1);
    });

    it('should offer the sponsorship page and a direct contact', () => {
      const actions = compiled().querySelectorAll<HTMLAnchorElement>('.partner-actions a');
      expect(actions.length).toBe(2);
      expect(actions[0].getAttribute('href')).toContain('/patrocinio');
      expect(actions[1].href).toContain('wa.me');
    });
  });

  describe('Accessibility', () => {
    it('should give every image an alt attribute', () => {
      for (const img of Array.from(compiled().querySelectorAll('img'))) {
        expect(img.getAttribute('alt'))
          .withContext(img.getAttribute('src') ?? '')
          .not.toBeNull();
      }
    });

    it('should have at most one h1 on the page', () => {
      expect(compiled().querySelectorAll('h1').length).toBeLessThanOrEqual(1);
    });
  });
});
