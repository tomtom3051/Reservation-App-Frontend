import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSearchBarComponent } from './business-search-bar.component';

describe('BusinessSearchBarComponent', () => {
  let component: BusinessSearchBarComponent;
  let fixture: ComponentFixture<BusinessSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessSearchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
