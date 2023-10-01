import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';
import { iBusinessHoursModel, iBusinessHoursModelTemp } from "../models/interfaces";


@Injectable({
  providedIn: 'root'
})
export class BusinessHoursService {
  //private hours: iBusinessHoursModel[] = [];
  private hoursUpdated = new Subject<{ hours: iBusinessHoursModel[] }>();

  constructor(
    private http: HttpClient
  ) {}

  getHoursUpdateListener() {
    return this.hoursUpdated.asObservable();
  }

  getBusinessHours2(businessId: number) {
    this.http.get<{ hours: any }>(
      'http://localhost:3000/hours/' + businessId
    ).pipe(
      map((hoursData) => {
        //console.log(hoursData.hours[0].opening_time);
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
      //this.hours = transformedHoursData.hours;
      //console.log(this.hours);
      this.hoursUpdated.next({
        hours: [...transformedHoursData.hours]
      });
    });
  }


  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // return throwError(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getBusinessHours(businessId: number) {
    return this.http.get<{ hours: any }>(
      'http://localhost:3000/hours/' + businessId
    ).pipe(
      catchError(this.handleError))
  }


  getBusinessHoursFull(businessId: number) {
    this.http.get<{ hours: any }>(
      'http://localhost:3000/hours/' + businessId
    ).pipe(
      catchError(this.handleError))
      .subscribe({
        next: async data => {
          let ttHours:iBusinessHoursModel[]=[];
          let items:iBusinessHoursModelTemp[] = data.hours as iBusinessHoursModelTemp[];
          //console.log("getBusinessHours");
          //console.log(items);
          items.forEach(item => {
            let newItem:iBusinessHoursModel = {
              day:item.day,
              opening_time:this.formatTimeData(item.opening_time),
              closing_time:this.formatTimeData(item.closing_time)}
              ttHours.push(newItem);
              //console.log(newItem);
            }
          )
          console.log(ttHours);
          console.log("voor");
          await new Promise(f => setTimeout(f, 1000));
          console.log("na");
          //this.hoursUpdated.next({
          //  hours: [...ttHours]
          //});
        },
        error: error => {
          console.log("error");
        }
      });
  }



  getBusinessHoursTT(businessId: number) {
    this.http.get<{ hours: any }>(
      'http://localhost:3000/hours/' + businessId
    ).pipe(
      map((hoursData) => {
        return {
          hours: hoursData.hours.map((item) => {
            //console.log(this.formatTimeData(item.opening_time));
            return {
              day: item.day,
              //opening_time: this.formatTimeData(item.opening_time),
              //closing_time: this.formatTimeData(item.closing_time)
              opening_time: item.opening_time,
              closing_time: item.closing_time
            };
          })
        };
      })
    ).subscribe((transformedHoursData) => {
      console.log(transformedHoursData);
      let ttHours:iBusinessHoursModel[]=[];
      transformedHoursData.hours.forEach(item => {
        let newItem:iBusinessHoursModel = {
          day:item.day,
          opening_time:this.formatTimeData(item.opening_time),
          closing_time:this.formatTimeData(item.closing_time)}
        //const newItem:BusinessHoursModel = new iBusinessHoursModel(item.day,this.formatTimeData(item.opening_time),this.formatTimeData(item.closing_time));
        //console.log(newItem);
        ttHours.push(newItem);
      })
      //this.hours = transformedHoursData.hours;
      //console.log(transformedHoursData.hours);
      console.log(ttHours);
      this.hoursUpdated.next({
        hours: [...ttHours]
      });
    });
  }


  //Ensure that the opening and closing times retrieved from the backend are saved as Date objects
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

  getBusinessHoursForDay(businessId: number, weekday: string) {
    const queryParams = businessId + '/' + weekday;
    return this.http.get<{
      opening_time: string;
      closing_time: string;
    }>(
      'http://localhost:3000/hours/' + queryParams
    );
  }

  postBusinessHours(businessId: number, day: string, openingHours: Date, closingHours: Date) {
    const opening_time = this.dateToString(openingHours);
    const closing_time = this.dateToString(closingHours);

    const hoursData = {
      "businessId": businessId,
      "day": day,
      "opening_time": opening_time,
      "closing_time": closing_time
    }

    this.http.post<{
      message: string,
      result: any
    }>(
      'http://localhost:3000/hours/add',
      hoursData
    ).subscribe({
      next: data => {
        console.log(data);
      },
      error: error => {
        console.log("ERROR: " + error);
      }
    });
  }

  patchBusinessHours(hoursId: number, openingHours: Date, closingHours: Date) {
    const opening_time = this.dateToString(openingHours);
    const closing_time = this.dateToString(closingHours);

    const hoursData = {
      "opening_time": opening_time,
      "closing_time": closing_time
    }

    this.http.patch<{
      message: string,
      result: any
    }>(
      'http://localhost:3000/hours/update/' + hoursId,
      hoursData
    ).subscribe({
      next: data => {
        console.log(data);
      },
      error: error => {
        console.log("ERROR: " + error);
      }
    });
  }

  deleteBusinessHours(hoursId: number) {
    this.http
      .delete(
        'http://localhost:3000/hours/delete/' + hoursId
      ).subscribe(response => {
        // console.log('request deleted! ' + response);
      }, error => {
        // console.log('Something went wrong! ' + error);
      }
      );
  }

  dateToString(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    const formattedTime = `${formattedHours}:${formattedMinutes}`;

    return formattedTime;
  }
}
