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

  it('should point the primary CTA at the official NASA registration page', () => {
    const cta = fixture.nativeElement.querySelector('.hero-actions .btn-primary') as HTMLAnchorElement;

    expect(cta.getAttribute('href')).toBe(component.registrationUrl);
    expect(cta.target).toBe('_blank');
    expect(cta.rel).toContain('noopener');
  });

  it('should announce that registration is open', () => {
    const badge = fixture.nativeElement.querySelector('.hero-live-badge') as HTMLElement;

    expect(badge.textContent?.trim()).toBe('Inscrições abertas');
  });

  it('should offer the mentor form as a secondary path', () => {
    const link = fixture.nativeElement.querySelector('.hero-mentor-note a') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe(component.mentorFormUrl);
    expect(link.target).toBe('_blank');
  });
});
