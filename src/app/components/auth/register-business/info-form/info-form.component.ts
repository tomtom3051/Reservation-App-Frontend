import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { iBusinessHoursModel, iBusinessHoursModelTemp, iBusinessHoursModelId } from 'src/app/models/interfaces';
import { BusinessService } from 'src/app/services/business.service';
import { BusinessHoursService } from 'src/app/services/businessHours.service';

@Component({
  selector: 'app-info-form',
  templateUrl: './info-form.component.html',
  styleUrls: ['./info-form.component.css']
})
export class InfoFormComponent implements OnInit, OnDestroy {
  //Store page id
  pageId: number;

  //Store lat and long data
  lat: number;
  lng: number;

  //Store and access the given business description
  description: string;

  //The initial values of description, lat and lng also need to be stored
  //This is to check if they where changed, if so a http post is needed to update their values
  //If not we can save time by not performing an uneeded http request.
  initLat: number;
  initLng: number;
  initDescription: string;


  daysString: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  //Store opening and closing hours for each day
  days: iBusinessHoursModelId[] = [];


  //Constructor to initialize services used
  constructor(
    private businessHoursService: BusinessHoursService,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  //Initialize page by getting existing info where it exists
  //Initialize location on current position if no location exists
  ngOnInit(): void {
    //TODO get pre-existing info
    this.route.params.subscribe(
      (params: Params) => {
        this.pageId = +params['id'];

        //Retrieve lat, lng and description from backend if it exists
        this.businessService.getBusinessInfo(this.pageId)
          .subscribe({
            next: data => {
              //console.log(data);
              if (data.latitude && data.longitude) {
                this.lat = parseFloat(data.latitude);
                this.initLat = parseFloat(data.latitude);
                this.lng = parseFloat(data.longitude);
                this.initLng = parseFloat(data.longitude);
              } else {
                navigator.geolocation.getCurrentPosition((position) => {
                  this.lat = position.coords.latitude;
                  this.lng = position.coords.longitude;
                  this.initLat = null;
                  this.initLng = null;
                  // console.log(
                  //   `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`
                  // );
                });
              }

              this.description = data.description;
              this.initDescription = data.description
            }
          })

        //Retrieve business hours from backend if they exist
        this.businessHoursService.getBusinessHours(this.pageId)
          .subscribe({
            next: data => {
              //Retrieved info will be in HH:MM:SS format not date format
              //Following code changes retrieved info into date format
              let formatedHours: iBusinessHoursModelId[] = [];
              let rawHours: iBusinessHoursModelTemp[] = data.hours as iBusinessHoursModelTemp[];

              rawHours.forEach(item => {
                let newItem: iBusinessHoursModelId = {
                  id: item.id,
                  day: item.day,
                  opening_time: this.formatTimeData(item.opening_time),
                  closing_time: this.formatTimeData(item.closing_time)}
                  formatedHours.push(newItem);
                }
              );
              //Now the day objects are added to the days array
              //They need to be added here cause if there is a pre existing array with null for hours, adding hours here in init are not reflected in child component
              for (let i = 0; i < this.daysString.length; i++) {
                //See if there is business hour info available for every day
                let index = formatedHours.findIndex( day => day.day === this.daysString[i]);
                //Create a newDay object to store day + hours
                let newDay: iBusinessHoursModelId;
                //If info exists add day and its hours to newday object
                if (index !== -1) {
                  newDay = {
                    id: formatedHours[index].id,
                    day: this.daysString[i],
                    opening_time: formatedHours[index].opening_time,
                    closing_time: formatedHours[index].closing_time
                  };
                }
                //If info does not exist add day to newDay object with null for the times
                else {
                  newDay = {
                    id: null,
                    day: this.daysString[i],
                    opening_time: null,
                    closing_time: null
                  };
                }
                //Push newDay onto the this.days array
                this.days.push(newDay);
              }
            },
            error: error => {
              console.log(error);
            }
          });
      }
    );




    //Check if location info is allowed
    // if (!navigator.geolocation) {
    //   // console.log('Location not supported!')
    // }
    // if (!this.lat && !this.lng) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     this.lat = position.coords.latitude;
    //     this.lng = position.coords.longitude;
    //     // console.log(
    //     //   `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`
    //     // );
    //   });
    // }

  }

  // addTimes(day: string, index: number) {
  //   let index =
  // }

  //This code formats backend businessInfo data from HH:MM:SS format to date object
  formatTimeData(time:string):Date {
    //console.log(time);
    const [hours, minutes, seconds] = time.split(':').map(Number);
    let date: Date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return date;
  }

  //Function to store backend hoursData into days array
  storeRetrievedHours( day: iBusinessHoursModel ) {
    const index = this.days.findIndex( local => local.day === day.day);
    this.days[index].opening_time = day.opening_time;
    this.days[index].closing_time = day.closing_time;
  }

  //Transformes time string retrieved from backend to Date() object
  turnHourStringToDate(hourString: string) {

    const [hours, minutes, seconds] = hourString.split(':').map(Number);
    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    console.log(date);
  }

  //Function executes when a new location on the map is clicked
  onChoseLocation(event) {
    // console.log(event);
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }

  //Function to save given info to the backend
  onRegister(form: NgForm) {
    //If description, lat and lng have changed send one big patch to update all values
    if (
      (this.description !== this.initDescription) &&
      (this.lat !== this.initLat ||
      this.lng !== this.initLng)) {
        this.businessService.updateDescriptionAndLocation(this.pageId, this.description, this.lat, this.lng);
      }
    //If only the description changed send a patch for the description
    else if (this.description !== this.initDescription) {
      this.businessService.updateDescription(this.pageId, this.description);
    }
    //If only the location changed, send a patch for the location
    else if (this.lng !== this.initLng || this.lat !== this.initLat) {
      this.businessService.updateLocation(this.pageId, this.lat, this.lng);
    }

    //For each individual day update the given values
    for (let day of this.days) {
      //Handle patch/post/delete requests for business hours
      this.updateAddDeleteBusinessHours(day);
    }

    this.router.navigate(['/explore/', this.pageId]);

  }

  updateAddDeleteBusinessHours(day: iBusinessHoursModelId) {
    //For each day, check if it has hours info and if it has an id

    //If it has hours info and an id, send a patch request
    if (day.id && day.opening_time && day.closing_time) {
      //having an ID means this day already has hours stored on the backend
      //So use patch not
      this.businessHoursService.patchBusinessHours(day.id, day.opening_time, day.closing_time);
    }
    //If it has hours info and no id, send a post request,
    else if (!day.id && day.opening_time && day.closing_time) {
      //No id, so no info on backend, use post
      this.businessHoursService.postBusinessHours(this.pageId, day.day, day.opening_time, day.closing_time);

    }
    //If it has no hour info and an id, send a delete request
    else if (day.id && (!day.opening_time || !day.closing_time)) {
      //Has id so info is on backend, however times have been deleted so use delete request
      this.businessHoursService.deleteBusinessHours(day.id);
    }
    //If it has no hours info and no id, send no request
  }

  ngOnDestroy(): void {
  }
}
