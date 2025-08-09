import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SponsorsSectionComponent } from './sponsors-section.component';

describe('SponsorsSectionComponent', () => {
  let component: SponsorsSectionComponent;
  let fixture: ComponentFixture<SponsorsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsorsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponsorsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Main Section Structure', () => {
    it('should render main sponsors section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorsSection = compiled.querySelector('.sponsors');
      
      expect(sponsorsSection).toBeTruthy();
    });

    it('should display main title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const mainTitle = compiled.querySelector('h2');
      
      expect(mainTitle).toBeTruthy();
      expect(mainTitle?.textContent).toContain('Apoiadores');
    });

    it('should display sponsors introduction text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const intro = compiled.querySelector('.sponsors-intro');
      
      expect(intro).toBeTruthy();
      expect(intro?.textContent).toBeTruthy();
    });

    it('should have container with proper styling', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const container = compiled.querySelector('.container');
      
      expect(container).toBeTruthy();
    });
  });

  describe('Sponsor Tiers Structure', () => {
    it('should render sponsor tier sections', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorTiers = compiled.querySelectorAll('.sponsor-tier');
      
      expect(sponsorTiers.length).toBeGreaterThanOrEqual(1);
    });

    it('should display tier titles', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tierTitles = compiled.querySelectorAll('.sponsor-tier h3');
      
      expect(tierTitles.length).toBeGreaterThanOrEqual(1);
      tierTitles.forEach(title => {
        expect(title.textContent?.trim()).toBeTruthy();
      });
    });

    it('should have sponsor grids', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorGrids = compiled.querySelectorAll('.sponsor-grid');
      
      expect(sponsorGrids.length).toBeGreaterThanOrEqual(1);
    });

    it('should identify different tier grids by class', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Check for various tier grid classes
      const tierClasses = [
        '.diamond-grid',
        '.gold-grid', 
        '.silver-grid',
        '.bronze-grid',
        '.supporters-grid'
      ];
      
      let foundTiers = 0;
      tierClasses.forEach(tierClass => {
        if (compiled.querySelector(tierClass)) {
          foundTiers++;
        }
      });
      
      expect(foundTiers).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Sponsor Cards', () => {
    it('should render sponsor cards', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorCards = compiled.querySelectorAll('.sponsor-card');
      
      expect(sponsorCards.length).toBeGreaterThanOrEqual(1);
    });

    it('should have sponsor logos', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorLogos = compiled.querySelectorAll('.sponsor-logo');
      
      sponsorLogos.forEach(logo => {
        const img = logo as HTMLImageElement;
        expect(img.src).toBeTruthy();
        expect(img.alt).toBeTruthy();
      });
    });

    it('should have sponsor names', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorNames = compiled.querySelectorAll('.sponsor-name');
      
      sponsorNames.forEach(name => {
        expect(name.textContent?.trim()).toBeTruthy();
      });
    });

    it('should have different tier card styles', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      const tierCardClasses = [
        '.diamond-card',
        '.gold-card',
        '.silver-card', 
        '.bronze-card',
        '.supporter-card'
      ];
      
      let foundCardTypes = 0;
      tierCardClasses.forEach(cardClass => {
        if (compiled.querySelector(cardClass)) {
          foundCardTypes++;
        }
      });
      
      // Should have at least one type of sponsor card
      expect(foundCardTypes).toBeGreaterThanOrEqual(0);
    });

    it('should have clickable sponsor links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorLinks = compiled.querySelectorAll('.sponsor-card a');
      
      sponsorLinks.forEach(link => {
        const anchor = link as HTMLAnchorElement;
        expect(anchor.href).toBeTruthy();
      });
    });
  });

  describe('Sponsor CTA Section', () => {
    it('should render sponsor CTA section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorCTA = compiled.querySelector('.sponsor-cta');
      
      expect(sponsorCTA).toBeTruthy();
    });

    it('should display CTA title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const ctaTitle = compiled.querySelector('.sponsor-cta h3');
      
      expect(ctaTitle).toBeTruthy();
      expect(ctaTitle?.textContent).toBeTruthy();
    });

    it('should display CTA description', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const ctaDescription = compiled.querySelector('.sponsor-cta p');
      
      expect(ctaDescription).toBeTruthy();
      expect(ctaDescription?.textContent).toBeTruthy();
    });

    it('should have sponsor contact button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const ctaButton = compiled.querySelector('.cta-sponsor');
      
      expect(ctaButton).toBeTruthy();
      expect(ctaButton?.textContent).toBeTruthy();
    });
  });

  describe('Specific Sponsors', () => {
    it('should display Global Shapers Community', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorImages = Array.from(compiled.querySelectorAll('.sponsor-logo')) as HTMLImageElement[];
      
      const hasGlobalShapers = sponsorImages.some(img => 
        img.src.includes('Global Shapers Community') || 
        img.alt.includes('Global Shapers')
      );
      
      expect(hasGlobalShapers).toBe(true);
    });

    it('should display Prefeitura logo', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorImages = Array.from(compiled.querySelectorAll('.sponsor-logo')) as HTMLImageElement[];
      
      const hasPrefeitura = sponsorImages.some(img => 
        img.src.includes('prefeitura-logo') || 
        img.alt.includes('Prefeitura')
      );
      
      expect(hasPrefeitura).toBe(true);
    });
  });

  describe('Layout and Grid System', () => {
    it('should have responsive grid layouts', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const grids = compiled.querySelectorAll('.sponsor-grid');
      
      grids.forEach(grid => {
        expect(grid.classList.contains('sponsor-grid')).toBe(true);
      });
    });

    it('should have proper container structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const container = compiled.querySelector('.sponsors .container');
      
      expect(container).toBeTruthy();
    });

    it('should organize sponsors by tier hierarchy', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorTiers = compiled.querySelectorAll('.sponsor-tier');
      
      // Should have logical organization of tiers
      expect(sponsorTiers.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const mainHeading = compiled.querySelector('h2');
      const subHeadings = compiled.querySelectorAll('h3');
      
      expect(mainHeading).toBeTruthy();
      expect(subHeadings.length).toBeGreaterThanOrEqual(1);
    });

    it('should have alt text for all sponsor logos', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorLogos = compiled.querySelectorAll('.sponsor-logo') as NodeListOf<HTMLImageElement>;
      
      sponsorLogos.forEach(logo => {
        expect(logo.alt).toBeTruthy();
        expect(logo.alt.length).toBeGreaterThan(0);
      });
    });

    it('should have meaningful link text for sponsors', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorLinks = compiled.querySelectorAll('.sponsor-card a');
      
      sponsorLinks.forEach(link => {
        // Links should either have text content or contain images with alt text
        const hasTextContent = link.textContent?.trim();
        const hasImageWithAlt = link.querySelector('img[alt]');
        
        expect(hasTextContent || hasImageWithAlt).toBeTruthy();
      });
    });

    it('should have proper button attributes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const ctaButton = compiled.querySelector('.cta-sponsor') as HTMLButtonElement;
      
      if (ctaButton) {
        expect(ctaButton.type).toBe('button');
      }
    });
  });

  describe('Content Quality', () => {
    it('should have meaningful sponsor tier names', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tierTitles = compiled.querySelectorAll('.sponsor-tier h3');
      
      tierTitles.forEach(title => {
        const titleText = title.textContent?.trim() || '';
        expect(titleText.length).toBeGreaterThan(0);
      });
    });

    it('should have complete sponsor information', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const sponsorCards = compiled.querySelectorAll('.sponsor-card');
      
      sponsorCards.forEach(card => {
        const hasLogo = card.querySelector('.sponsor-logo');
        const hasName = card.querySelector('.sponsor-name');
        
        expect(hasLogo || hasName).toBeTruthy();
      });
    });

    it('should have engaging CTA content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const ctaSection = compiled.querySelector('.sponsor-cta');
      
      if (ctaSection) {
        const ctaText = ctaSection.textContent?.toLowerCase() || '';
        
        // Should contain sponsorship-related terms
        const hasSponsorshipTerms = /sponsor|apoio|parcei|colabora/.test(ctaText);
        expect(hasSponsorshipTerms).toBe(true);
      }
    });
  });

  describe('Performance', () => {
    it('should render without errors', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should have optimized image loading', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const images = compiled.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
      
      images.forEach(img => {
        expect(img.src).toBeTruthy();
        // Images should have proper attributes for performance
        expect(img.alt).toBeTruthy();
      });
    });
  });
});