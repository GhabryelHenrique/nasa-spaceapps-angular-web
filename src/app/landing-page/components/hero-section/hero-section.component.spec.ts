import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSectionComponent } from './hero-section.component';

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent]
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
});
