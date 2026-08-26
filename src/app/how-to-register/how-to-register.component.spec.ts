import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HowToRegisterComponent } from './how-to-register.component';

describe('HowToRegisterComponent', () => {
  let component: HowToRegisterComponent;
  let fixture: ComponentFixture<HowToRegisterComponent>;
  const compiled = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToRegisterComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HowToRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one numbered card per step, in order', () => {
    const numbers = [...compiled().querySelectorAll('.step-number')]
      .map(el => el.textContent?.trim());

    expect(numbers).toEqual(component.steps.map((_, i) => String(i + 1)));
  });

  it('should start the guide at the official NASA registration page', () => {
    expect(component.steps[0].action?.url).toBe(component.registrationUrl);
    expect(component.registrationUrl).toContain('spaceappschallenge.org');
  });

  it('should expose the mentor form on the mentor section', () => {
    const cta = compiled().querySelector<HTMLAnchorElement>('#mentores .btn-primary');

    expect(cta?.getAttribute('href')).toBe(component.mentorFormUrl);
    expect(cta?.target).toBe('_blank');
    expect(cta?.rel).toContain('noopener');
  });

  it('should route internal step actions instead of leaving the app', () => {
    // O passo dos desafios aponta para uma rota interna: sem target _blank.
    const internal = component.steps.filter(s => s.action && !s.action.external);

    expect(internal.length).toBeGreaterThan(0);
    for (const step of internal) {
      expect(compiled().querySelector(`a[href="${step.action!.url}"]`)).toBeTruthy();
    }
  });

  describe('FAQ', () => {
    it('should render one item per question', () => {
      expect(compiled().querySelectorAll('.faq-item').length).toBe(component.faqs.length);
    });

    it('should open only one answer at a time', () => {
      component.toggleFaq(2);
      fixture.detectChanges();

      expect(compiled().querySelectorAll('.faq-answer').length).toBe(1);
      expect(compiled().querySelectorAll('.faq-item.is-open').length).toBe(1);
    });

    it('should close the open answer when clicked again', () => {
      const first = compiled().querySelector<HTMLButtonElement>('.faq-question')!;

      expect(first.getAttribute('aria-expanded')).toBe('true');

      first.click();
      fixture.detectChanges();

      expect(component.openFaq()).toBeNull();
      expect(compiled().querySelectorAll('.faq-answer').length).toBe(0);
    });
  });

  it('should have exactly one h1', () => {
    expect(compiled().querySelectorAll('h1').length).toBe(1);
  });
});
