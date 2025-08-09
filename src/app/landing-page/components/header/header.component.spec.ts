import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let windowOpenSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    
    // Spy on window.open
    windowOpenSpy = spyOn(window, 'open').and.stub();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render NASA logo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logo = compiled.querySelector('.nasa-logo') as HTMLImageElement;
    
    expect(logo).toBeTruthy();
    expect(logo.src).toContain('assets/nasa-logo.png');
    expect(logo.alt).toBe('NASA Logo');
  });

  it('should render correct title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    
    expect(title?.textContent).toBe('Space Apps Uberlândia');
  });

  it('should render Discord button with correct text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.login-btn');
    
    expect(button?.textContent?.trim()).toContain('Entrar no Servidor');
  });

  it('should have Discord icon in button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('.login-btn i.fa-brands.fa-discord');
    
    expect(icon).toBeTruthy();
  });

  it('should call joinDiscordServer when Discord button is clicked', () => {
    spyOn(component, 'joinDiscordServer');
    
    const button = fixture.nativeElement.querySelector('.login-btn') as HTMLButtonElement;
    button.click();
    
    expect(component.joinDiscordServer).toHaveBeenCalled();
  });

  it('should open Discord link in new tab when joinDiscordServer is called', () => {
    component.joinDiscordServer();
    
    expect(windowOpenSpy).toHaveBeenCalledWith('https://discord.gg/FT4Jsvj5vy', '_blank');
  });

  it('should have correct CSS classes for styling', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    const navbar = compiled.querySelector('.navbar');
    const navBrand = compiled.querySelector('.nav-brand');
    const navActions = compiled.querySelector('.nav-actions');
    
    expect(header?.classList.contains('header')).toBe(true);
    expect(navbar?.classList.contains('navbar')).toBe(true);
    expect(navBrand?.classList.contains('nav-brand')).toBe(true);
    expect(navActions?.classList.contains('nav-actions')).toBe(true);
  });

  it('should have proper accessibility attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logo = compiled.querySelector('.nasa-logo') as HTMLImageElement;
    const button = compiled.querySelector('.login-btn') as HTMLButtonElement;
    
    expect(logo.alt).toBeTruthy();
    expect(button.type).toBe('button');
  });
});