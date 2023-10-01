import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { iBusinessHoursModel, iBusinessHoursModelId } from 'src/app/models/interfaces';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  //Store the weekday this timepicker component is for
  @Input() day: iBusinessHoursModelId;

  //Store the chosen opening hour, minute & a date object for it
  openingHour: number;
  openingMinute: number;
  chosenOpeningTime = new Date();

  //Store the chosen closing hour, minute & a date object for it
  closingHour: number;
  closingMinute: number;
  chosenClosingTime = new Date();

  //Booleans so validity checks can check if info is filled out in other time picker
  openingTimeFilled: boolean = false;
  closingTimeFilled: boolean = false;

  ngOnInit(): void {
    //Check if there is pre existing opening and closing times
    if (this.day.opening_time && this.day.closing_time) {
      //If so set pre existing opening time
      const setOpeningTime: NgbTimeStruct = {
        hour: this.day.opening_time.getHours(),
        minute: this.day.opening_time.getMinutes(),
        second: this.day.opening_time.getSeconds()
      };
      this.openingTime.setValue(setOpeningTime);

      //Set pre existing closing time
      const setClosingTime: NgbTimeStruct = {
        hour: this.day.closing_time.getHours(),
        minute: this.day.closing_time.getMinutes(),
        second: this.day.closing_time.getSeconds()
      };
      this.closingTime.setValue(setClosingTime);

      this.openingTimeFilled = true;
      this.closingTimeFilled = true;
    }
  }

  //This variable is tied to the opening time picker, changes in the picked value are handled here
  openingTime = new FormControl<NgbTimeStruct | null>(null, (control: FormControl<NgbTimeStruct | null>) => {
    const openingValue = control.value;


    //If there is no chosen value do nothing
    if (!openingValue) {
      this.openingTimeFilled = false;
      try {
        if (this.openingTime.dirty) {
          this.day.opening_time = null;
        }
      } catch {

      }

      return null;
    } else {
      this.openingTimeFilled = true;
    }

    //If the chosen value is after the chosen closing time return an error
    if ((openingValue.hour > this.closingHour) || (openingValue.hour === this.closingHour && openingValue.minute > this.closingMinute)) {
      return { late: true }
    }

    if (!(this.openingTimeFilled && this.closingTimeFilled)) {
      return { incomplete: true }
    }

    //Store the chosen opening hour & minute in variables where other code can access the info
    this.openingHour = openingValue.hour;
    this.openingMinute = openingValue.minute;

    //Add the chosen values to a date object
    this.chosenOpeningTime.setHours(openingValue.hour);
    this.chosenOpeningTime.setMinutes(openingValue.minute);
    this.chosenOpeningTime.setSeconds(openingValue.second);

    //Set this date object to the day variable
    //Doing this updates the value in the day array in the info-form parrent component
    this.day.opening_time = this.chosenOpeningTime;

    return null;
  });

  //This variable is tied to the closing time picker, changes in the picked value are handled here
  closingTime = new FormControl<NgbTimeStruct | null>(null, (control: FormControl<NgbTimeStruct | null>) => {
    const closingValue = control.value;

    if (!closingValue) {
      this.closingTimeFilled = false;
      try {
        if (this.closingTime.dirty) {
          this.day.closing_time = null;
        }
      } catch {

      }
      return null;
    } else {
      this.closingTimeFilled = true;
    }

    if ((closingValue.hour < this.openingHour) || (closingValue.hour === this.openingHour && closingValue.minute < this.openingMinute)) {
      return { early: true }
    }

    if (!(this.openingTimeFilled && this.closingTimeFilled)) {
      return { incomplete: true }
    }

    this.closingHour = closingValue.hour;
    this.closingMinute = closingValue.minute;

    this.chosenClosingTime.setHours(closingValue.hour);
    this.chosenClosingTime.setMinutes(closingValue.minute);
    this.chosenClosingTime.setSeconds(closingValue.second);
    this.day.closing_time = this.chosenClosingTime;

    return null;
  });
}
