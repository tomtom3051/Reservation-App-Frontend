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

  //Variable to link with search bar
  searchInput: string = '';

  //Stores the location of the user
  lat: number;
  lng: number;
  //Stores the radius of distance from users businesses have to be
  rad: number = 100;

  isLoading: boolean = false;

  constructor(private businessService: BusinessService) {}

  ngOnInit(): void {
    //Check if location info is allowed
    if (!navigator.geolocation) {
      // console.log('Location not supported!')
    } else{
      this.isLoading = true;
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        // console.log(
        //   `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`
        // );
        this.businessService.getBusinessesByLocation(this.lat, this.lng, this.rad);
        this.businessSub = this.businessService.getBusinessUpdateListener()
          .subscribe((businessData: { businesses: BusinessModel[] }) => {
            this.businesses = businessData.businesses;
            this.isLoading = false;
            // console.log(this.businesses);
          });
      });

    }
  }

  onInputUpdated() {
    console.log(this.searchInput);
  }

  ngOnDestroy(): void {
    this.businessSub.unsubscribe();
  }
}
