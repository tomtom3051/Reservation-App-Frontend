import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessImagesComponent } from './business-images.component';

describe('BusinessImagesComponent', () => {
  let component: BusinessImagesComponent;
  let fixture: ComponentFixture<BusinessImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessImagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
