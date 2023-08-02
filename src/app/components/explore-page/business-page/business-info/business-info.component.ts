import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BusinessHoursModel } from 'src/app/models/businessHours.model';
import { BusinessService } from 'src/app/services/business.service';
import { BusinessHoursService } from 'src/app/services/businessHours.service';

@Component({
  selector: 'app-business-info',
  templateUrl: './business-info.component.html',
  styleUrls: ['./business-info.component.css']
})
export class BusinessInfoComponent implements OnInit, OnDestroy {
  monday: any;
  tuesday: any;
  wednesday: any;
  thursday: any;
  friday: any;
  saturday: any;
  sunday: any;

  id: number;
  hours: BusinessHoursModel[] = [];
  hoursSub: Subscription;

  //Test values:
  public lat: number;
  public lng: number;

  constructor (
    private businessHoursService: BusinessHoursService,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    //Get business id
    this.id = this.businessService.getCurrentPageId();

    //Use ID to find businesses opening/closing hours
    this.businessHoursService.getBusinessHours(this.id);

    //Use this sub to format the hours so they can be used
    this.hoursSub = this.businessHoursService.getHoursUpdateListener()
      .subscribe((hoursData: { hours: BusinessHoursModel[] }) => {
        this.hours = hoursData.hours;

        this.monday = this.hours.find(item => item.day === 'Monday');
        if (this.monday) {
          this.monday.opening_time = this.formatTime(this.monday.opening_time);
          this.monday.closing_time = this.formatTime(this.monday.closing_time);
        }

        this.tuesday = this.hours.find(item => item.day === 'Tuesday');
        if (this.tuesday) {
          this.tuesday.opening_time = this.formatTime(this.tuesday.opening_time);
          this.tuesday.closing_time = this.formatTime(this.tuesday.closing_time);
        }

        this.wednesday = this.hours.find(item => item.day === 'Wednesday');
        if (this.wednesday) {
          this.wednesday.opening_time = this.formatTime(this.wednesday.opening_time);
          this.wednesday.closing_time = this.formatTime(this.wednesday.closing_time);
        }

        this.thursday = this.hours.find(item => item.day === 'Thursday');
        if (this.thursday) {
          this.thursday.opening_time = this.formatTime(this.thursday.opening_time);
          this.thursday.closing_time = this.formatTime(this.thursday.closing_time);
        }

        this.friday = this.hours.find(item => item.day === 'Friday');
        if (this.friday) {
          this.friday.opening_time = this.formatTime(this.friday.opening_time);
          this.friday.closing_time = this.formatTime(this.friday.closing_time);
        }

        this.saturday = this.hours.find(item => item.day === 'Saturday');
        if (this.saturday) {
          this.saturday.opening_time = this.formatTime(this.saturday.opening_time);
          this.saturday.closing_time = this.formatTime(this.saturday.closing_time);
        }

        this.sunday = this.hours.find(item => item.day === 'Sunday');
        if (this.sunday) {
          this.sunday.opening_time = this.formatTime(this.sunday.opening_time);
          this.sunday.closing_time = this.formatTime(this.sunday.closing_time);
        }
      });

     //Get lat and lng from business service
    this.businessService.getBusinessLocation(this.id).subscribe((locationData) => {
      // console.log(locationData);
      this.lat = parseFloat(locationData.latitude),
      this.lng = parseFloat(locationData.longitude)
    });
  }

  formatTime(time: string): string {
    const date = new Date(`1970-01-01T${time}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  ngOnDestroy(): void {
    this.hoursSub.unsubscribe();
  }

}
