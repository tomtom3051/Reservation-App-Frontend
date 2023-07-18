import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessReservationComponent } from './business-reservation.component';

describe('BusinessReservationComponent', () => {
  let component: BusinessReservationComponent;
  let fixture: ComponentFixture<BusinessReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessReservationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
