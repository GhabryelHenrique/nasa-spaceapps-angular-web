import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsMapComponent } from './events-map.component';

describe('EventsMapComponent', () => {
  let component: EventsMapComponent;
  let fixture: ComponentFixture<EventsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
