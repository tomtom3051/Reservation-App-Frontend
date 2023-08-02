import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { BusinessHoursModel } from 'src/app/models/businessHours.model';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent {
  @Input() day: BusinessHoursModel;

  openingHour: number;
  openingMinute: number;
  chosenOpeningTime = new Date();

  closingHour: number;
  closingMinute: number;
  chosenClosingTime = new Date();

  openingTime = new FormControl<NgbTimeStruct | null>(null, (control: FormControl<NgbTimeStruct | null>) => {
    const openingValue = control.value;

    if (!openingValue) {
      return null;
    }

    if ((openingValue.hour > this.closingHour) || (openingValue.hour === this.closingHour && openingValue.minute > this.closingMinute)) {
      return { late: true }
    }

    this.openingHour = openingValue.hour;
    this.openingMinute = openingValue.minute;

    this.chosenOpeningTime.setHours(openingValue.hour);
    this.chosenOpeningTime.setMinutes(openingValue.minute);
    this.chosenOpeningTime.setSeconds(openingValue.second);
    this.day.opening_time = this.chosenOpeningTime;

    return null;
  });

  closingTime = new FormControl<NgbTimeStruct | null>(null, (control: FormControl<NgbTimeStruct | null>) => {
    const closingValue = control.value;

    if (!closingValue) {
      return null;
    }

    if ((closingValue.hour < this.openingHour) || (closingValue.hour === this.openingHour && closingValue.minute < this.openingMinute)) {
      return { early: true }
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
