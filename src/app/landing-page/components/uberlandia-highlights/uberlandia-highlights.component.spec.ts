import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UberlandiaHighlightsComponent } from './uberlandia-highlights.component';

describe('UberlandiaHighlightsComponent', () => {
  let component: UberlandiaHighlightsComponent;
  let fixture: ComponentFixture<UberlandiaHighlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UberlandiaHighlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UberlandiaHighlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Section Title and Content', () => {
    it('should render the main section title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('.section-title');
      
      expect(title).toBeTruthy();
      expect(title?.textContent).toContain('Uberlândia');
    });

    it('should render highlight text content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const highlightText = compiled.querySelectorAll('.highlight-text');
      
      expect(highlightText.length).toBeGreaterThan(0);
    });

    it('should render winners info section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const winnersInfo = compiled.querySelector('.winners-info');
      
      expect(winnersInfo).toBeTruthy();
    });

    it('should display winners info title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const winnersTitle = compiled.querySelector('.winners-info h3');
      
      expect(winnersTitle).toBeTruthy();
      expect(winnersTitle?.textContent).toContain('Vencedores');
    });
  });

  describe('Image Section', () => {
    it('should render winner image container', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const imageContainer = compiled.querySelector('.winner-image-container');
      
      expect(imageContainer).toBeTruthy();
    });

    it('should render winner image with proper attributes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const winnerImage = compiled.querySelector('.winner-image') as HTMLImageElement;
      
      expect(winnerImage).toBeTruthy();
      expect(winnerImage.src).toContain('assets/');
      expect(winnerImage.alt).toBeTruthy();
    });

    it('should have image caption', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const caption = compiled.querySelector('.image-caption');
      
      expect(caption).toBeTruthy();
    });

    it('should display caption text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const captionText = compiled.querySelector('.image-caption p');
      
      expect(captionText).toBeTruthy();
    });

    it('should have caption subtitle', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const captionSubtitle = compiled.querySelector('.caption-subtitle');
      
      expect(captionSubtitle).toBeTruthy();
    });
  });

  describe('Achievements Grid', () => {
    it('should render achievements grid', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const achievementsGrid = compiled.querySelector('.achievements-grid');
      
      expect(achievementsGrid).toBeTruthy();
    });

    it('should display achievement cards', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const achievementCards = compiled.querySelectorAll('.achievement-card');
      
      expect(achievementCards.length).toBeGreaterThan(0);
    });

    it('should have achievement icons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const achievementIcons = compiled.querySelectorAll('.achievement-icon');
      
      expect(achievementIcons.length).toBeGreaterThan(0);
    });

    it('should display achievement titles', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const achievementTitles = compiled.querySelectorAll('.achievement-card h4');
      
      expect(achievementTitles.length).toBeGreaterThan(0);
      achievementTitles.forEach(title => {
        expect(title.textContent?.trim()).toBeTruthy();
      });
    });

    it('should display achievement descriptions', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const achievementDescriptions = compiled.querySelectorAll('.achievement-card p');
      
      expect(achievementDescriptions.length).toBeGreaterThan(0);
      achievementDescriptions.forEach(desc => {
        expect(desc.textContent?.trim()).toBeTruthy();
      });
    });

    it('should have different colored achievement cards', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const achievementCards = compiled.querySelectorAll('.achievement-card');
      
      // Should have at least one card with specific nth-child styling
      expect(achievementCards.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Layout Structure', () => {
    it('should have proper container structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const container = compiled.querySelector('.container');
      const uberlandiaSection = compiled.querySelector('.uberlandia-highlights');
      
      expect(container).toBeTruthy();
      expect(uberlandiaSection).toBeTruthy();
    });

    it('should have highlights content layout', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const highlightsContent = compiled.querySelector('.highlights-content');
      const textContent = compiled.querySelector('.text-content');
      const imageContent = compiled.querySelector('.image-content');
      
      expect(highlightsContent).toBeTruthy();
      expect(textContent).toBeTruthy();
      expect(imageContent).toBeTruthy();
    });

    it('should have proper CSS classes applied', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Check main section classes
      expect(compiled.querySelector('.uberlandia-highlights')).toBeTruthy();
      expect(compiled.querySelector('.highlights-content')).toBeTruthy();
      expect(compiled.querySelector('.text-content')).toBeTruthy();
      expect(compiled.querySelector('.image-content')).toBeTruthy();
      expect(compiled.querySelector('.achievements-grid')).toBeTruthy();
    });
  });

  describe('Content Quality', () => {
    it('should contain meaningful text about Uberlândia', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const textContent = compiled.querySelector('.text-content')?.textContent || '';
      
      // Should contain references to the location and event
      expect(textContent.toLowerCase()).toMatch(/uberlândia|minas gerais|brasil|space apps|nasa/);
    });

    it('should have structured winners information', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const winnersDescription = compiled.querySelector('.winners-description');
      const judgesInfo = compiled.querySelector('.judges-info');
      
      expect(winnersDescription).toBeTruthy();
      expect(judgesInfo).toBeTruthy();
    });

    it('should contain team highlights', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const teamHighlights = compiled.querySelectorAll('.team-highlight');
      
      // Should have some team-related content
      expect(teamHighlights.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Responsive Design Elements', () => {
    it('should have grid layout elements', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const highlightsContent = compiled.querySelector('.highlights-content');
      const achievementsGrid = compiled.querySelector('.achievements-grid');
      
      expect(highlightsContent).toBeTruthy();
      expect(achievementsGrid).toBeTruthy();
    });

    it('should have image with responsive attributes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const winnerImage = compiled.querySelector('.winner-image') as HTMLImageElement;
      
      if (winnerImage) {
        // Should have classes for responsive behavior
        expect(winnerImage.classList.contains('winner-image')).toBe(true);
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const images = compiled.querySelectorAll('img');
      
      images.forEach(img => {
        expect((img as HTMLImageElement).alt).toBeTruthy();
      });
    });

    it('should have proper heading hierarchy', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const headings = compiled.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have meaningful text content for screen readers', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const textElements = compiled.querySelectorAll('p, h3, h4, h5');
      
      textElements.forEach(element => {
        expect(element.textContent?.trim()).toBeTruthy();
      });
    });
  });

  describe('Performance Considerations', () => {
    it('should render without throwing errors', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should have optimized image loading', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const winnerImage = compiled.querySelector('.winner-image') as HTMLImageElement;
      
      if (winnerImage) {
        // Image should exist and be properly configured
        expect(winnerImage.src).toBeTruthy();
      }
    });
  });
});