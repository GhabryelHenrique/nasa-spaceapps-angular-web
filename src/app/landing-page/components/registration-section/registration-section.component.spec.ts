import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RegistrationSectionComponent } from './registration-section.component';

describe('RegistrationSectionComponent', () => {
  let component: RegistrationSectionComponent;
  let fixture: ComponentFixture<RegistrationSectionComponent>;
  const compiled = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationSectionComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should announce that registration is open', () => {
    expect(compiled().querySelector('.live-badge')?.textContent?.trim()).toBe('Inscrições abertas');
  });

  it('should offer one track per audience', () => {
    expect(compiled().querySelectorAll('.track').length).toBe(component.tracks.length);
  });

  it('should send the participant to the official NASA page', () => {
    const participant = component.tracks.find(t => t.primary);

    expect(participant?.ctaUrl).toBe(component.registrationUrl);
    expect(participant?.ctaUrl).toContain('spaceappschallenge.org');
  });

  it('should open every external CTA safely in a new tab', () => {
    const ctas = compiled().querySelectorAll<HTMLAnchorElement>('.track-cta');

    expect(ctas.length).toBe(component.tracks.length);
    for (const cta of Array.from(ctas)) {
      expect(cta.target).toBe('_blank');
      expect(cta.rel).toContain('noopener');
    }
  });

  it('should link to the step-by-step guide', () => {
    const guide = compiled().querySelector('a[href="/como-se-inscrever"]');

    expect(guide).toBeTruthy();
  });
});
