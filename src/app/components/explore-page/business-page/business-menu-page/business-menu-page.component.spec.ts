import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMenuPageComponent } from './business-menu-page.component';

describe('BusinessMenuPageComponent', () => {
  let component: BusinessMenuPageComponent;
  let fixture: ComponentFixture<BusinessMenuPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessMenuPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessMenuPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
