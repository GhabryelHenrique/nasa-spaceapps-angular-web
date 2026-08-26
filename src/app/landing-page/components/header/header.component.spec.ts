import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let windowOpenSpy: jasmine.Spy;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    windowOpenSpy = spyOn(window, 'open').and.stub();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render NASA Space Apps logo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logo = compiled.querySelector('.nasa-logo') as HTMLImageElement;

    expect(logo).toBeTruthy();
    expect(logo.alt).toBe('NASA Space Apps Challenge');
  });

  it('should show Entrar and Cadastrar when logged out', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const authButtons = compiled.querySelectorAll('.navbar .auth-btn');

    expect(authButtons.length).toBe(2);
    expect(authButtons[0].textContent?.trim()).toBe('Entrar');
    expect(authButtons[1].textContent?.trim()).toBe('Cadastrar');
  });

  it('should not show user menu when logged out', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.user-menu')).toBeNull();
  });

  it('should open Discord link in new tab when joinDiscordServer is called', () => {
    component.joinDiscordServer();

    expect(windowOpenSpy).toHaveBeenCalledWith('https://discord.gg/FT4Jsvj5vy', '_blank');
  });

  it('should have correct CSS classes for styling', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('header.header')).toBeTruthy();
    expect(compiled.querySelector('.navbar')).toBeTruthy();
    expect(compiled.querySelector('.nav-brand')).toBeTruthy();
    expect(compiled.querySelector('.nav-actions')).toBeTruthy();
  });
});
