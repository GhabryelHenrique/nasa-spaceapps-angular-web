import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengesSectionComponent } from './challenges-section.component';

describe('ChallengesSectionComponent', () => {
  let component: ChallengesSectionComponent;
  let fixture: ComponentFixture<ChallengesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengesSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
