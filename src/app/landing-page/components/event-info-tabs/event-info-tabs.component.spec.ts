import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventInfoTabsComponent } from './event-info-tabs.component';
import { CommonModule } from '@angular/common';

describe('EventInfoTabsComponent', () => {
  let component: EventInfoTabsComponent;
  let fixture: ComponentFixture<EventInfoTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInfoTabsComponent, CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventInfoTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default active tab as "evento"', () => {
    expect(component.activeTab).toBe('evento');
  });

  it('should initialize with modal closed', () => {
    expect(component.showModal).toBe(false);
    expect(component.selectedAward).toBe(null);
  });

  describe('Tab Navigation', () => {
    it('should render all three tab buttons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabButtons = compiled.querySelectorAll('.tab-btn');
      
      expect(tabButtons.length).toBe(3);
      expect(tabButtons[0].textContent?.trim()).toBe('Sobre o Evento');
      expect(tabButtons[1].textContent?.trim()).toBe('O que é o Hackathon');
      expect(tabButtons[2].textContent?.trim()).toBe('Modalidades e Prêmios');
    });

    it('should set active tab when tab button is clicked', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const hackathonTab = compiled.querySelectorAll('.tab-btn')[1] as HTMLButtonElement;
      
      hackathonTab.click();
      fixture.detectChanges();
      
      expect(component.activeTab).toBe('hackathon');
    });

    it('should apply active class to current tab', () => {
      component.setActiveTab('premios');
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const tabButtons = compiled.querySelectorAll('.tab-btn');
      
      expect(tabButtons[2].classList.contains('active')).toBe(true);
      expect(tabButtons[0].classList.contains('active')).toBe(false);
      expect(tabButtons[1].classList.contains('active')).toBe(false);
    });

    it('should show correct tab content based on active tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Default tab (evento)
      expect(compiled.querySelector('.info-grid')).toBeTruthy();
      
      // Switch to hackathon tab
      component.setActiveTab('hackathon');
      fixture.detectChanges();
      expect(compiled.querySelector('.hackathon-info')).toBeTruthy();
      
      // Switch to premios tab
      component.setActiveTab('premios');
      fixture.detectChanges();
      expect(compiled.querySelector('.awards-section')).toBeTruthy();
    });
  });

  describe('Event Info Tab Content', () => {
    beforeEach(() => {
      component.setActiveTab('evento');
      fixture.detectChanges();
    });

    it('should display event info cards', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const infoCards = compiled.querySelectorAll('.info-card');
      
      expect(infoCards.length).toBe(4);
    });

    it('should display correct event information', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const cardTitles = Array.from(compiled.querySelectorAll('.info-card h3'))
        .map(el => el.textContent);
      
      expect(cardTitles).toContain('Quando');
      expect(cardTitles).toContain('Onde');
      expect(cardTitles).toContain('Equipes');
      expect(cardTitles).toContain('Prêmios');
    });
  });

  describe('Awards Modal', () => {
    it('should have awards information for all award types', () => {
      const expectedAwards = [
        'Art & Technology',
        'Best Mission Concept',
        'Best Use of Data',
        'Best Use of Science',
        'Best Use of Storytelling',
        'Best Use of Technology',
        'Galactic Impact',
        'Global Community',
        'Local Impact',
        'Most Inspirational'
      ];

      expectedAwards.forEach(award => {
        expect(component.awardsInfo[award]).toBeDefined();
        expect(component.awardsInfo[award].name).toBe(award);
        expect(component.awardsInfo[award].description).toBeTruthy();
        expect(component.awardsInfo[award].fullDescription).toBeTruthy();
      });
    });

    it('should render all award images when on premios tab', () => {
      component.setActiveTab('premios');
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const awardImages = compiled.querySelectorAll('.award-image');
      
      expect(awardImages.length).toBe(10);
    });

    it('should open modal when award image is clicked', () => {
      component.setActiveTab('premios');
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const firstAwardImage = compiled.querySelector('.award-image') as HTMLImageElement;
      
      firstAwardImage.click();
      fixture.detectChanges();
      
      expect(component.showModal).toBe(true);
      expect(component.selectedAward).toBeTruthy();
    });

    it('should display modal with correct award information', () => {
      component.openAwardModal('Best Use of Science');
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const modal = compiled.querySelector('.modal-overlay');
      const modalTitle = compiled.querySelector('.modal-body h3');
      const modalDescription = compiled.querySelector('.award-description');
      
      expect(modal).toBeTruthy();
      expect(modalTitle?.textContent).toBe('Best Use of Science');
      expect(modalDescription?.textContent).toContain('Melhor aplicação do método científico');
    });

    it('should close modal when close button is clicked', () => {
      component.openAwardModal('Best Use of Data');
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const closeButton = compiled.querySelector('.modal-close') as HTMLButtonElement;
      
      closeButton.click();
      fixture.detectChanges();
      
      expect(component.showModal).toBe(false);
      expect(component.selectedAward).toBe(null);
    });

    it('should close modal when overlay is clicked', () => {
      component.openAwardModal('Galactic Impact');
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const overlay = compiled.querySelector('.modal-overlay') as HTMLElement;
      
      overlay.click();
      fixture.detectChanges();
      
      expect(component.showModal).toBe(false);
      expect(component.selectedAward).toBe(null);
    });

    it('should not close modal when modal content is clicked', () => {
      component.openAwardModal('Most Inspirational');
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const modalContent = compiled.querySelector('.modal-content') as HTMLElement;
      
      // Simulate stopPropagation behavior
      spyOn(Event.prototype, 'stopPropagation');
      modalContent.click();
      fixture.detectChanges();
      
      expect(component.showModal).toBe(true);
    });

    it('should reset modal state when closeModal is called', () => {
      component.openAwardModal('Art & Technology');
      expect(component.showModal).toBe(true);
      expect(component.selectedAward).toBeTruthy();
      
      component.closeModal();
      
      expect(component.showModal).toBe(false);
      expect(component.selectedAward).toBe(null);
    });
  });

  describe('Hackathon Info Tab', () => {
    beforeEach(() => {
      component.setActiveTab('hackathon');
      fixture.detectChanges();
    });

    it('should display hackathon description', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const description = compiled.querySelector('.hackathon-description');
      
      expect(description).toBeTruthy();
      expect(description?.textContent).toContain('NASA Space Apps Challenge');
      expect(description?.textContent).toContain('hackathon internacional');
    });

    it('should display challenge categories', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const categories = compiled.querySelectorAll('.category');
      
      expect(categories.length).toBe(4);
    });
  });

  describe('Method Tests', () => {
    it('should set active tab correctly', () => {
      component.setActiveTab('hackathon');
      expect(component.activeTab).toBe('hackathon');
      
      component.setActiveTab('premios');
      expect(component.activeTab).toBe('premios');
      
      component.setActiveTab('evento');
      expect(component.activeTab).toBe('evento');
    });

    it('should handle invalid award name gracefully', () => {
      component.openAwardModal('Invalid Award');
      
      expect(component.selectedAward).toBeUndefined();
      expect(component.showModal).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper button attributes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('.tab-btn');
      
      buttons.forEach(button => {
        expect((button as HTMLButtonElement).type).toBe('button');
      });
    });

    it('should have proper modal accessibility', () => {
      component.openAwardModal('Best Use of Technology');
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const closeButton = compiled.querySelector('.modal-close') as HTMLButtonElement;
      
      expect(closeButton.type).toBe('button');
      expect(closeButton.textContent).toContain('×');
    });
  });
});