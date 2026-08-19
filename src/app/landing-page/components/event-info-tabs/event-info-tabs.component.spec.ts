import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventInfoTabsComponent } from './event-info-tabs.component';

describe('EventInfoTabsComponent', () => {
  let component: EventInfoTabsComponent;
  let fixture: ComponentFixture<EventInfoTabsComponent>;
  const compiled = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInfoTabsComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(EventInfoTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start on the "evento" tab with the modal closed', () => {
    expect(component.activeTab()).toBe('evento');
    expect(component.showModal()).toBe(false);
    expect(component.selectedAward()).toBeNull();
  });

  describe('Tab navigation', () => {
    it('should render one button per tab', () => {
      const buttons = compiled().querySelectorAll('.tab-btn');
      expect(buttons.length).toBe(component.tabs.length);
      expect(buttons[0].textContent?.trim()).toBe('Sobre o Evento');
      expect(buttons[3].textContent?.trim()).toBe('Modalidades e Prêmios');
    });

    it('should switch tabs on click', () => {
      (compiled().querySelectorAll('.tab-btn')[1] as HTMLButtonElement).click();
      fixture.detectChanges();

      expect(component.activeTab()).toBe('hackathon');
      expect(compiled().querySelector('#hackathon-panel')).toBeTruthy();
      expect(compiled().querySelector('#evento-panel')).toBeNull();
    });

    it('should mark only the active tab with aria-selected', () => {
      component.setActiveTab('premios');
      fixture.detectChanges();

      const selected = compiled().querySelectorAll('.tab-btn[aria-selected="true"]');
      expect(selected.length).toBe(1);
      expect(selected[0].textContent?.trim()).toBe('Modalidades e Prêmios');
    });

    it('should move between tabs with the arrow keys', () => {
      const buttons = () => compiled().querySelectorAll('.tab-btn');
      const arrow = (i: number, key: string) =>
        buttons()[i].dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

      arrow(0, 'ArrowRight');
      fixture.detectChanges();
      expect(component.activeTab()).toBe('hackathon');

      arrow(1, 'ArrowLeft');
      fixture.detectChanges();
      expect(component.activeTab()).toBe('evento');
    });

    it('should wrap around at both ends of the tablist', () => {
      const buttons = () => compiled().querySelectorAll('.tab-btn');
      const last = component.tabs.length - 1;

      buttons()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      fixture.detectChanges();
      expect(component.activeTab()).toBe(component.tabs[last].id);

      buttons()[last].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      fixture.detectChanges();
      expect(component.activeTab()).toBe('evento');
    });
  });

  describe('Evento tab', () => {
    it('should show the 2026 date and the edition theme', () => {
      const text = compiled().textContent ?? '';
      expect(text).toContain('14 e 15 de Novembro, 2026');
      expect(text).toContain('The Next Frontier');
    });
  });

  describe('Awards modal', () => {
    beforeEach(() => {
      component.setActiveTab('premios');
      fixture.detectChanges();
    });

    it('should render every award inside a holding shape', () => {
      const shapes = compiled().querySelectorAll('.award-shape img');
      expect(shapes.length).toBe(component.awardNames.length);
    });

    it('should open the modal with the award details', () => {
      (compiled().querySelector('.award') as HTMLButtonElement).click();
      fixture.detectChanges();

      expect(component.showModal()).toBe(true);
      expect(component.selectedAward()?.name).toBe('Art & Technology');
      expect(compiled().querySelector('.modal-content')?.getAttribute('aria-modal')).toBe('true');
    });

    it('should close the modal on the close button', () => {
      component.openAwardModal('Local Impact');
      fixture.detectChanges();

      (compiled().querySelector('.modal-close') as HTMLButtonElement).click();
      fixture.detectChanges();

      expect(component.showModal()).toBe(false);
      expect(compiled().querySelector('.modal-overlay')).toBeNull();
    });

    it('should close the modal on Escape', () => {
      component.openAwardModal('Galactic Impact');
      fixture.detectChanges();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();

      expect(component.showModal()).toBe(false);
    });

    it('should not close the modal when its content is clicked', () => {
      component.openAwardModal('Most Inspirational');
      fixture.detectChanges();

      (compiled().querySelector('.modal-content') as HTMLElement).click();
      fixture.detectChanges();

      expect(component.showModal()).toBe(true);
    });
  });
});
