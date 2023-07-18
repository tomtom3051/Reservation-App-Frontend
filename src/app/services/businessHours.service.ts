import { Injectable } from "@angular/core";
import { BusinessHoursModel } from "../models/businessHours.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusinessHoursService {
  private hours: BusinessHoursModel[] = [];
  private hoursUpdated = new Subject<{ hours: BusinessHoursModel[] }>();

  constructor(
    private http: HttpClient
  ) {}

  getHoursUpdateListener() {
    return this.hoursUpdated.asObservable();
  }

  getBusinessHours(businessId: number) {
    this.http.get<{ hours: any }>(
      'http://localhost:3000/hours/' + businessId
    ).pipe(
      map((hoursData) => {
        return {
          hours: hoursData.hours.map((item) => {
            return {
              day: item.day,
              opening_time: item.opening_time,
              closing_time: item.closing_time
            };
          })
        };
      })
    ).subscribe((transformedHoursData) => {
      this.hours = transformedHoursData.hours;
      this.hoursUpdated.next({
        hours: [...this.hours]
      });
    });
  }

  getBusinessHoursForDay(businessId: number, weekday: string) {
    const queryParams = businessId + '/' + weekday;
    return this.http.get<{
      opening_time: string;
      closing_time: string;
    }>(
      'http://localhost:3000/hours/' + queryParams
    );
  }
}
