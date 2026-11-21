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
    // A seção dos Global Nominees busca o teams.json; nenhum teste aqui depende dela.
    TestBed.inject(HttpTestingController).match(() => true).forEach(r => r.flush({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Section composition', () => {
    it('should render every section in order', () => {
      const order = [...compiled().querySelectorAll<HTMLElement>(
        'app-hero-section, app-nominees2026-section, app-challenges-live-section, ' +
        'app-talks-section, .sponsors-strip, app-theme-section, app-countdown, ' +
        'app-timeline, .event-info-wrapper'
      )].map(el =>
        el.tagName.toLowerCase() === 'section'
          ? [...el.classList].find(c =>
              !c.startsWith('sa-section') && (c.endsWith('-strip') || c.endsWith('-wrapper')))
          : el.tagName.toLowerCase()
      );

      expect(order).toEqual([
        'app-hero-section',
        'app-nominees2026-section',
        'app-challenges-live-section',
        'app-talks-section',
        'sponsors-strip',
        'app-theme-section',
        'app-countdown',
        'app-timeline',
        'event-info-wrapper'
      ]);
    });

    it('should no longer render the 2025 retrospective sections', () => {
      // Recap, destaques globais, nominees e prêmios de 2025 saíram da home
      // depois do hackathon de 2026.
      for (const selector of ['app-recap2025-section', '.winners-section', '.nominees-section', '.awards-section']) {
        expect(compiled().querySelector(selector)).withContext(selector).toBeNull();
      }
    });

    it('should declare exactly one tone per inline section', () => {
      // A alternância de fato entre TODAS as seções (incluindo as que são
      // componentes) é verificada no navegador, com as cores computadas.
      // Aqui trava-se o invariante estrutural: nenhuma seção sem tom, e
      // nenhuma com os dois.
      const sections = [...compiled().querySelectorAll('.sa-section')];
      expect(sections.length).toBeGreaterThan(0);

      for (const el of sections) {
        const tones = ['sa-section--deep', 'sa-section--sunken']
          .filter(c => el.classList.contains(c));
        expect(tones.length).withContext(el.className).toBe(1);
      }
    });

    it('should label every inline section with an eyebrow', () => {
      for (const section of Array.from(compiled().querySelectorAll('.sa-section'))) {
        expect(section.querySelector('.sa-eyebrow')).withContext(section.className).toBeTruthy();
      }
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
