import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSectionComponent } from './hero-section.component';
import { PLATFORM_ID } from '@angular/core';

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a hero background image', () => {
    const img = fixture.nativeElement.querySelector('.hero-bg-photo') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(component.heroBg).toBeTruthy();
  });

  it('should expose particles array', () => {
    expect(component.particles.length).toBe(20);
  });

  it('should not throw when scrollToCountdown is called on browser', () => {
    spyOn(document, 'querySelector').and.returnValue(null);
    expect(() => component.scrollToCountdown()).not.toThrow();
  });

  it('should not throw when scrollToInfo is called on browser', () => {
    spyOn(document, 'getElementById').and.returnValue(null);
    expect(() => component.scrollToInfo()).not.toThrow();
  });

  it('should not throw when methods are called on server platform', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }]
    }).compileComponents();

    const serverFixture = TestBed.createComponent(HeroSectionComponent);
    const serverComponent = serverFixture.componentInstance;

    expect(() => serverComponent.scrollToInfo()).not.toThrow();
    expect(() => serverComponent.scrollToCountdown()).not.toThrow();
  });
});
