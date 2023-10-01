import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BusinessModel } from 'src/app/models/business.model';
import { BusinessService } from 'src/app/services/business.service';

@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.css']
})
export class ExplorePageComponent implements OnInit, OnDestroy {
  businesses: BusinessModel[] = [];
  private businessSub: Subscription;

  lat: number;
  lng: number;

  constructor(private businessService: BusinessService) {}

  ngOnInit(): void {
    //Check if location info is allowed
    if (!navigator.geolocation) {
      // console.log('Location not supported!')
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      // console.log(
      //   `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`
      // );
    });

    this.businessService.getBusinesses();
    this.businessSub = this.businessService.getBusinessUpdateListener()
      .subscribe((businessData: { businesses: BusinessModel[] }) => {
        this.businesses = businessData.businesses;
        // console.log(this.businesses);
      });
  }

  ngOnDestroy(): void {
    this.businessSub.unsubscribe();
  }
}
