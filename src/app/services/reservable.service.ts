import { Injectable } from "@angular/core";
import { ReservableModel } from "../models/reservable.model";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { SvgComponent } from '../components/explore-page/svg-layout/svg/svg.component';
@Injectable({
  providedIn: 'root'
})
export class ReservableService {
  //This array contains all the reservables for one business
  private reservables: ReservableModel[] = [];
  //This subject can be subbed to to listen for changes
  private reservablesUpdated = new Subject<{ reservables: ReservableModel[] }>();

  constructor(
    private http: HttpClient
  ) {}

  //Sets up the observable that can be subbed to for reservable changes
  getReservablesUpdateListener() {
    return this.reservablesUpdated.asObservable();
  }

  //Function gets reservables based on the businessId
  getReservables(businessId: number) {
    //Sends a http get request to backend server
    this.http
      .get<{ reservables: any }>('http://localhost:3000/reservable/get/' + businessId)
      .pipe(
        //Following function structures data retrieved from http get request
        map((reservableData) => {
          return {
            reservables: reservableData.reservables.map((reservable) => {
              return {
                id: reservable.id,
                floorplanId: reservable.floorplanId,
                businessId: reservable.businessId,
                x: reservable.x,
                y: reservable.y,
                height: reservable.height,
                width: reservable.width,
                capacity: reservable.capacity,
                label: reservable.label
              };
            })
          };
        })
      )
      .subscribe({
        next: data => {
          //Retrieved data is stored in reservables array
          this.reservables = data.reservables;
          // console.log(data.reservables);
          //Data is forewarded through the Subject to components that are listening
          this.reservablesUpdated.next({
            reservables: [...this.reservables]
          });
        },
        error: error => {
          console.log("ERROR: " + error);
        }
      });
  }

  //Sends http post request to save reservable to the backend
  saveReservable(
    floorplanId: number,
    businessId: number,
    x: number,
    y: number,
    height: number,
    width: number,
    capacity: number,
    label: string
  ) {
    //Create json object to send to the backend
    const reservableData = {
      "floorplanId": floorplanId,
      "businessId": businessId,
      "x": x,
      "y": y,
      "height": height,
      "width": width,
      "capacity": capacity,
      "label": label
    };

    //Send http post request and return the result
    return this.http.post<{
      id: number,
      floorplanId: number,
      businessId: number,
      x: number,
      y: number,
      height: number,
      width: number,
      capacity: number,
      label: string
    }>(
      'http://localhost:3000/reservable/add',
      reservableData
    );
  }

  //Sends http patch request to update reservable data on the backend
  updateReservable(
    id: number | null,
    floorplanId: number,
    businessId: number,
    x: number,
    y: number,
    height: number,
    width: number,
    capacity: number,
    label: string
  ) {
    const reservableData = {
      "floorplanId": floorplanId,
      "businessId": businessId,
      "x": x,
      "y": y,
      "height": height,
      "width": width,
      "capacity": capacity,
      "label": label
    };
    this.http.patch<{
      message: string,
      reservable: any
    }>(
      'http://localhost:3000/reservable/update/' + id,
      reservableData
    ).subscribe({
      next: data => {
        // console.log(data);
      },
      error: error => {
        console.log("ERROR: " + error);
      }
    });
  }


  //Function deletes a reservable saved on the backend
  deleteReservable(id: number) {
    this.http.delete(
      'http://localhost:3000/reservable/delete/' + id
    ).subscribe({
      next: data => {
        this.deleteFromArray(id);
      },
      error: error => {
        console.log('ERROR: ' + error);
      }
    });
  }

  //Remove reservable from service array
  deleteFromArray(id: number) {
    this.reservables = this.reservables.filter((reservable) => reservable.id !== id);
    this.reservablesUpdated.next({
      reservables: [...this.reservables]
    });
  }

}
