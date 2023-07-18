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

  constructor(private businessService: BusinessService) {}

  ngOnInit(): void {
    this.businessService.getBusinesses();
    this.businessSub = this.businessService.getBusinessUpdateListener()
      .subscribe((businessData: { businesses: BusinessModel[] }) => {
        this.businesses = businessData.businesses;
      });
  }

  ngOnDestroy(): void {
      this.businessSub.unsubscribe();
  }
}
