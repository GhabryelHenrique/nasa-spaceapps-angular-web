import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationChartsComponent } from './registration-charts.component';

describe('RegistrationChartsComponent', () => {
  let component: RegistrationChartsComponent;
  let fixture: ComponentFixture<RegistrationChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
