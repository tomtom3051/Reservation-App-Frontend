import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { iBusinessHoursModel, iBusinessHoursModelTemp } from 'src/app/models/interfaces';
import { BusinessService } from 'src/app/services/business.service';
import { BusinessHoursService } from 'src/app/services/businessHours.service';

@Component({
  selector: 'app-business-info',
  templateUrl: './business-info.component.html',
  styleUrls: ['./business-info.component.css']
})
export class BusinessInfoComponent implements OnInit {
  id: number;
  hours: iBusinessHoursModel[] = [];

  //Test values:
  public lat: number;
  public lng: number;

  constructor (
    private businessHoursService: BusinessHoursService,
    private businessService: BusinessService,
    private router: Router
  ) {}




  ngOnInit(): void {
    //Get business id
    this.id = this.businessService.getCurrentPageId();

    //Use ID to find businesses opening/closing hours
    //this.businessHoursService.getBusinessHours(this.id);

    this.businessHoursService.getBusinessHours(this.id)
      .subscribe({
        next: data => {
          let formatedHours: iBusinessHoursModel[] = [];
          let rawHours: iBusinessHoursModelTemp[] = data.hours as iBusinessHoursModelTemp[];
          rawHours.forEach(item => {
            let newItem: iBusinessHoursModel = {
              day:item.day,
              opening_time:this.formatTimeData(item.opening_time),
              closing_time:this.formatTimeData(item.closing_time)}
              formatedHours.push(newItem);
            }
          )
          this.hours = formatedHours;
        },
        error: error => {
          console.log("error");
        }
      });

    //Get lat and lng from business service
    this.businessService.getBusinessLocation(this.id).subscribe((locationData) => {
      // console.log(locationData);
      this.lat = parseFloat(locationData.latitude),
      this.lng = parseFloat(locationData.longitude)
    });
  }

  formatTimeData(time:string):Date {
    //console.log(time);
    const [hours, minutes, seconds] = time.split(':').map(Number);
    let datum:Date = new Date();

    datum.setHours(hours);
    datum.setMinutes(minutes);
    datum.setSeconds(seconds);

    //console.log(typeof datum);

    return datum;
  }

  getTime(day: string): string {
    let index = this.hours.findIndex(listDay => listDay.day === day);
    if (index !== -1) {
      let openingTime: string = this.hours[index].opening_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      let closingTime: string = this.hours[index].closing_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      return openingTime + ' - ' + closingTime;
    } else {
      return 'Closed';
    }

  }

  tempEditInfo() {
    this.router.navigate(['/business-info', this.id]);
  }

}
