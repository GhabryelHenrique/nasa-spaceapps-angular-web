import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSectionComponent } from './hero-section.component';
import { PLATFORM_ID } from '@angular/core';

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;
  let windowOpenSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSectionComponent);
    component = fixture.componentInstance;
    
    // Spy on window.open
    windowOpenSpy = spyOn(window, 'open').and.stub();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render main title correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.hero-title');
    
    expect(title?.textContent).toBe('NASA Space Apps Challenge 2025');
  });

  it('should render subtitle correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const subtitle = compiled.querySelector('.hero-subtitle');
    
    expect(subtitle?.textContent).toBe('Uberlândia, Brasil');
  });

  it('should render description text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const description = compiled.querySelector('.hero-description');
    
    expect(description?.textContent).toContain('Junte-se ao maior hackathon espacial do mundo!');
    expect(description?.textContent).toContain('Resolva desafios reais da NASA');
    expect(description?.textContent).toContain('colabore com equipes globais para criar soluções inovadoras');
  });

  it('should render both action buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const primaryButton = compiled.querySelector('.cta-primary');
    const secondaryButton = compiled.querySelector('.cta-secondary');
    
    expect(primaryButton?.textContent?.trim()).toBe('Inscreva-se Agora');
    expect(secondaryButton?.textContent?.trim()).toBe('Saiba Mais');
  });

  it('should render hero image with correct attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const image = compiled.querySelector('.hero-image img') as HTMLImageElement;
    
    expect(image).toBeTruthy();
    expect(image.src).toContain('assets/nasa-spaceapps-logo.png');
    expect(image.alt).toBe('Space Apps Challenge');
  });

  it('should call registerNow when primary button is clicked', () => {
    spyOn(component, 'registerNow');
    
    const primaryButton = fixture.nativeElement.querySelector('.cta-primary') as HTMLButtonElement;
    primaryButton.click();
    
    expect(component.registerNow).toHaveBeenCalled();
  });

  it('should call scrollToInfo when secondary button is clicked', () => {
    spyOn(component, 'scrollToInfo');
    
    const secondaryButton = fixture.nativeElement.querySelector('.cta-secondary') as HTMLButtonElement;
    secondaryButton.click();
    
    expect(component.scrollToInfo).toHaveBeenCalled();
  });

  it('should open Discord link in new tab when registerNow is called', () => {
    component.registerNow();
    
    expect(windowOpenSpy).toHaveBeenCalledWith('https://discord.gg/FT4Jsvj5vy', '_blank');
  });

  it('should scroll to info element when scrollToInfo is called', () => {
    // Mock document.getElementById
    const mockElement = {
      scrollIntoView: jasmine.createSpy('scrollIntoView')
    };
    spyOn(document, 'getElementById').and.returnValue(mockElement as any);
    
    component.scrollToInfo();
    
    expect(document.getElementById).toHaveBeenCalledWith('info');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should handle scrollToInfo when element does not exist', () => {
    spyOn(document, 'getElementById').and.returnValue(null);
    
    expect(() => component.scrollToInfo()).not.toThrow();
  });

  it('should have correct CSS structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heroSection = compiled.querySelector('.hero');
    const heroContent = compiled.querySelector('.hero-content');
    const heroActions = compiled.querySelector('.hero-actions');
    const heroImage = compiled.querySelector('.hero-image');
    
    expect(heroSection).toBeTruthy();
    expect(heroContent).toBeTruthy();
    expect(heroActions).toBeTruthy();
    expect(heroImage).toBeTruthy();
  });

  it('should have proper button styling classes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const primaryButton = compiled.querySelector('.cta-primary');
    const secondaryButton = compiled.querySelector('.cta-secondary');
    
    expect(primaryButton?.classList.contains('cta-primary')).toBe(true);
    expect(secondaryButton?.classList.contains('cta-secondary')).toBe(true);
  });

  describe('Platform checks', () => {
    it('should work with server platform', async () => {
      // Create a new test bed with server platform
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [HeroSectionComponent],
        providers: [
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      }).compileComponents();

      const serverFixture = TestBed.createComponent(HeroSectionComponent);
      const serverComponent = serverFixture.componentInstance;
      
      // Should not throw error when called on server
      expect(() => serverComponent.scrollToInfo()).not.toThrow();
    });
  });
});