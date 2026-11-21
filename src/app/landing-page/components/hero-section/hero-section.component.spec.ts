import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeroSectionComponent } from './hero-section.component';

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero art inside a circular holding shape, with a description', () => {
    // A arte em si é escolha editorial (logo, capacete…). O que o teste
    // trava é o tratamento: existe imagem, dentro da holding shape, com alt.
    const img = fixture.nativeElement.querySelector('.orb-shape img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(component.themeImage).toBeTruthy();
    expect(img.getAttribute('alt')?.trim().length).toBeGreaterThan(0);
  });

  it('should name the 2026 theme', () => {
    const themeName = fixture.nativeElement.querySelector('.hero-theme-name') as HTMLElement;
    expect(themeName.textContent?.trim()).toBe('The Next Frontier');
  });

  it('should not place any text on top of the theme art', () => {
    // Brand Guide 2026, pág. 10: imagens nunca recebem texto ou conteúdo
    // desenhado por cima.
    const orb = fixture.nativeElement.querySelector('.hero-orb') as HTMLElement;
    expect(orb.textContent?.trim()).toBe('');
  });

  it('should expose particles array', () => {
    expect(component.particles.length).toBe(20);
  });

  it('should point the primary CTA at the Global Nominees section', () => {
    const cta = fixture.nativeElement.querySelector('.hero-actions .btn-primary') as HTMLAnchorElement;

    expect(cta.getAttribute('href')).toBe('#global-nominees');
  });

  it('should announce that the 2026 hackathon is over', () => {
    const badge = fixture.nativeElement.querySelector('.hero-live-badge') as HTMLElement;

    expect(badge.textContent?.trim()).toBe('Hackathon 2026 encerrado');
  });

  it('should show the 2026 results in the stats bar', () => {
    const values = [...fixture.nativeElement.querySelectorAll('.hero-stat-value')]
      .map((el: Element) => el.textContent?.trim());

    expect(values).toEqual(component.stats.map(stat => stat.value));
    expect(values).toContain(String(component.results.teams));
    expect(values).toContain(String(component.results.globalNominees));
  });

  it('should no longer invite registrations', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).not.toContain('Inscreva-se');
    expect(fixture.nativeElement.querySelector('.hero-mentor-note')).toBeNull();
  });
});
