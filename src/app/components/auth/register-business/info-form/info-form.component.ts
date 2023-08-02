import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BusinessHoursModel } from 'src/app/models/businessHours.model';

@Component({
  selector: 'app-info-form',
  templateUrl: './info-form.component.html',
  styleUrls: ['./info-form.component.css']
})
export class InfoFormComponent implements OnInit {
  lat: number;
  lng: number;
  days: BusinessHoursModel[] = [
    new BusinessHoursModel(
      'Monday',
      null,
      null
    ),
    new BusinessHoursModel(
      'Tuesday',
      null,
      null
    ),
    new BusinessHoursModel(
      'Wednesday',
      null,
      null
    ),
    new BusinessHoursModel(
      'Thursday',
      null,
      null
    ),
    new BusinessHoursModel(
      'Friday',
      null,
      null
    ),
    new BusinessHoursModel(
      'Saturday',
      null,
      null
    ),
    new BusinessHoursModel(
      'Sunday',
      null,
      null
    ),
  ];
  ngOnInit(): void {
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
  }

  onChoseLocation(event) {
    // console.log(event);
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }

  onRegister(form: NgForm) {
    // console.log(form.value.description);
    // console.log(this.days);
    // console.log(this.lat);
    // console.log(this.lng);
  }
}
