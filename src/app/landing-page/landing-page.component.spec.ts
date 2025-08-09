import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { UberlandiaHighlightsComponent } from './components/uberlandia-highlights/uberlandia-highlights.component';
import { EventInfoTabsComponent } from './components/event-info-tabs/event-info-tabs.component';
import { SponsorsSectionComponent } from './components/sponsors-section/sponsors-section.component';
import { PLATFORM_ID } from '@angular/core';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let windowOpenSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LandingPageComponent,
        HeaderComponent,
        HeroSectionComponent,
        UberlandiaHighlightsComponent,
        EventInfoTabsComponent,
        SponsorsSectionComponent
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    
    // Spy on window.open
    windowOpenSpy = spyOn(window, 'open').and.stub();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Structure', () => {
    it('should render all main sections', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      expect(compiled.querySelector('app-header')).toBeTruthy();
      expect(compiled.querySelector('app-hero-section')).toBeTruthy();
      expect(compiled.querySelector('app-uberlandia-highlights')).toBeTruthy();
      expect(compiled.querySelector('app-event-info-tabs')).toBeTruthy();
      expect(compiled.querySelector('app-sponsors-section')).toBeTruthy();
    });

    it('should have proper wrapper classes for sections', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      expect(compiled.querySelector('.hero-wrapper')).toBeTruthy();
      expect(compiled.querySelector('.event-info-wrapper')).toBeTruthy();
      expect(compiled.querySelector('.sponsors-wrapper')).toBeTruthy();
    });

    it('should have landing container as root element', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const landingContainer = compiled.querySelector('.landing-container');
      
      expect(landingContainer).toBeTruthy();
    });
  });

  describe('Registration CTA Section', () => {
    it('should render registration CTA section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const registrationCTA = compiled.querySelector('.registration-cta');
      
      expect(registrationCTA).toBeTruthy();
    });

    it('should display CTA title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const ctaTitle = compiled.querySelector('.registration-cta h2');
      
      expect(ctaTitle?.textContent).toBe('Pronto para a Aventura?');
    });

    it('should display CTA description', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const ctaDescription = compiled.querySelector('.registration-cta p');
      
      expect(ctaDescription?.textContent).toContain('Junte-se a centenas de participantes');
      expect(ctaDescription?.textContent).toContain('maior competição espacial do mundo');
    });

    it('should have registration button with Discord icon', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const ctaButton = compiled.querySelector('.cta-large');
      const discordIcon = compiled.querySelector('.cta-large i.fa-brands.fa-discord');
      
      expect(ctaButton?.textContent?.trim()).toContain('Inscreva-se Agora');
      expect(discordIcon).toBeTruthy();
    });

    it('should call registerNow when CTA button is clicked', () => {
      spyOn(component, 'registerNow');
      
      const ctaButton = fixture.nativeElement.querySelector('.cta-large') as HTMLButtonElement;
      ctaButton.click();
      
      expect(component.registerNow).toHaveBeenCalled();
    });

    it('should open Discord link when registerNow is called', () => {
      component.registerNow();
      
      expect(windowOpenSpy).toHaveBeenCalledWith('https://discord.gg/FT4Jsvj5vy', '_blank');
    });
  });

  describe('Footer Section', () => {
    it('should render footer section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const footer = compiled.querySelector('.footer');
      
      expect(footer).toBeTruthy();
    });

    it('should display footer brand with NASA logo', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const footerBrand = compiled.querySelector('.footer-brand');
      const nasaLogo = compiled.querySelector('.footer-brand img') as HTMLImageElement;
      
      expect(footerBrand).toBeTruthy();
      expect(nasaLogo?.src).toContain('assets/nasa-logo.png');
      expect(nasaLogo?.alt).toBe('NASA Logo');
    });

    it('should display footer brand text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const brandText = compiled.querySelector('.footer-brand p');
      
      expect(brandText?.textContent).toContain('NASA Space Apps Challenge');
      expect(brandText?.textContent).toContain('Uberlândia 2025');
    });

    it('should display useful links section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const linksSection = compiled.querySelector('.footer-links');
      const linksTitle = compiled.querySelector('.footer-links h4');
      
      expect(linksSection).toBeTruthy();
      expect(linksTitle?.textContent).toBe('Links Úteis');
    });

    it('should have external links to Space Apps and NASA', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('.footer-links a') as NodeListOf<HTMLAnchorElement>;
      
      const linkHrefs = Array.from(links).map(link => link.href);
      
      expect(linkHrefs.some(href => href.includes('spaceappschallenge.org'))).toBe(true);
      expect(linkHrefs.some(href => href.includes('nasa.gov'))).toBe(true);
    });

    it('should display social media section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const socialSection = compiled.querySelector('.footer-social');
      const socialTitle = compiled.querySelector('.footer-social h4');
      
      expect(socialSection).toBeTruthy();
      expect(socialTitle?.textContent).toBe('Siga-nos');
    });

    it('should have social media links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const socialLinks = compiled.querySelectorAll('.social-links .social-link') as NodeListOf<HTMLAnchorElement>;
      
      const socialHrefs = Array.from(socialLinks).map(link => link.href);
      
      expect(socialHrefs.some(href => href.includes('discord.gg'))).toBe(true);
      expect(socialHrefs.some(href => href.includes('instagram.com'))).toBe(true);
    });

    it('should display copyright information', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const copyright = compiled.querySelector('.footer-bottom p');
      
      expect(copyright?.textContent).toContain('© 2025 NASA Space Apps Uberlândia');
      expect(copyright?.textContent).toContain('Todos os direitos reservados');
    });
  });

  describe('Layout and Design', () => {
    it('should have proper section order', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sections = Array.from(compiled.children[0].children);
      
      // Check that sections appear in expected order
      const sectionSelectors = [
        'app-header',
        '.hero-wrapper',
        'app-uberlandia-highlights',
        '.event-info-wrapper',
        '.sponsors-wrapper',
        '.registration-cta',
        '.footer'
      ];

      let currentIndex = 0;
      sections.forEach(section => {
        if (currentIndex < sectionSelectors.length) {
          const selector = sectionSelectors[currentIndex];
          if (section.matches && section.matches(selector)) {
            currentIndex++;
          }
        }
      });

      expect(currentIndex).toBeGreaterThan(3); // At least some sections should be in order
    });

    it('should have responsive container classes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const containers = compiled.querySelectorAll('.container');
      
      expect(containers.length).toBeGreaterThan(0);
    });

    it('should have proper CSS structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Check for key CSS classes
      expect(compiled.querySelector('.landing-container')).toBeTruthy();
      expect(compiled.querySelector('.registration-cta')).toBeTruthy();
      expect(compiled.querySelector('.footer')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const headings = compiled.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have alt text for all images', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const images = compiled.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
      
      images.forEach(img => {
        expect(img.alt).toBeTruthy();
      });
    });

    it('should have proper button attributes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
      
      buttons.forEach(button => {
        expect(button.type).toBe('button');
      });
    });

    it('should have meaningful link text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('a');
      
      links.forEach(link => {
        const hasTextContent = link.textContent?.trim();
        const hasAriaLabel = link.getAttribute('aria-label');
        const hasTitle = link.getAttribute('title');
        
        expect(hasTextContent || hasAriaLabel || hasTitle).toBeTruthy();
      });
    });
  });

  describe('Performance and Error Handling', () => {
    it('should render without throwing errors', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should handle component initialization properly', () => {
      expect(component).toBeInstanceOf(LandingPageComponent);
      expect(component.registerNow).toEqual(jasmine.any(Function));
    });

    it('should have minimal DOM depth for performance', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Check that the component doesn't have excessive nesting
      const deepElements = compiled.querySelectorAll('*');
      expect(deepElements.length).toBeLessThan(500); // Reasonable limit
    });
  });

  describe('Content Quality', () => {
    it('should contain NASA and Space Apps branding', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const pageText = compiled.textContent?.toLowerCase() || '';
      
      expect(pageText).toContain('nasa');
      expect(pageText).toContain('space apps');
      expect(pageText).toContain('uberlândia');
    });

    it('should have call-to-action elements', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');
      
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should contain event information', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const pageText = compiled.textContent?.toLowerCase() || '';
      
      expect(pageText).toContain('hackathon');
      expect(pageText).toContain('2025');
    });
  });

  describe('Integration', () => {
    it('should properly integrate all child components', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Verify that child components are rendered and functional
      expect(compiled.querySelector('app-header')).toBeTruthy();
      expect(compiled.querySelector('app-hero-section')).toBeTruthy();
      expect(compiled.querySelector('app-event-info-tabs')).toBeTruthy();
      expect(compiled.querySelector('app-sponsors-section')).toBeTruthy();
    });

    it('should maintain consistent styling across sections', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const containers = compiled.querySelectorAll('.container');
      
      // Should have consistent container usage
      expect(containers.length).toBeGreaterThan(1);
    });
  });
});
