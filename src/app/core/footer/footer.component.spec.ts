/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { provideRouter } from '@angular/router';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose both registration paths', () => {
    const links = fixture.debugElement
      .queryAll(By.css('.footer-links a'))
      .map((el: DebugElement) => (el.nativeElement as HTMLAnchorElement).getAttribute('href'));

    expect(links).toContain(component.registrationUrl);
    expect(links).toContain(component.mentorFormUrl);
  });

  it('should route to the step-by-step guide', () => {
    // routerLink só vira href quando RouterLink está importado no componente.
    const guide = fixture.nativeElement.querySelector('a[href="/como-se-inscrever"]');

    expect(guide).toBeTruthy();
  });
});
