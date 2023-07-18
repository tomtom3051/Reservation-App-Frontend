import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {

  minHour: any;
  minMinute: any;

  maxHour: any;
  maxMinute: any;

  cHours: any;

  oHours: any;

  test: any;

  openingHours = new FormControl<NgbTimeStruct | null>(null, (control1: FormControl<NgbTimeStruct | null>) => {
		const value1 = control1.value;

    if (!value1) {
      return null;
    }

    this.minHour = value1.hour;
    this.minMinute = value1.minute;

    if ((value1.hour > this.maxHour) || (value1.hour === this.maxHour && value1.minute > this.maxMinute)) {
      return { tooLate: true }
    }

    this.oHours = `${String(value1.hour).padStart(2, '0')}:${String(value1.minute).padStart(2, '0')}`;

    this.test = {
      "opening_time": this.oHours,
      "closing_time": this.cHours
    }

		return null;
	});

  closingHours = new FormControl<NgbTimeStruct | null>(null, (control2: FormControl<NgbTimeStruct | null>) => {
    const value2 = control2.value;

    if (!value2) {
      return null;
    }

    this.maxHour = value2.hour;
    this.maxMinute = value2.minute;

    if ((value2.hour < this.minHour) || (value2.hour === this.minHour && value2.minute < this.minMinute)) {
      return { tooEarly: true }
    }

    this.cHours = `${String(value2.hour).padStart(2, '0')}:${String(value2.minute).padStart(2, '0')}`;

    return null;
  });


}

