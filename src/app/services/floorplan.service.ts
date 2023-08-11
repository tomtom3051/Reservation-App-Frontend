import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FloorplanModel } from "../models/floorplan.model";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FloorplanService {
  private floorplans: FloorplanModel[] = [];
  private floorplansUpdated = new Subject<{ floorplans: FloorplanModel[] }>();

  constructor(
    private http: HttpClient
  ) {}

  //Observable that can be subbed to to observe changes in floorplans
  getFloorplanUpdateListener() {
    return this.floorplansUpdated.asObservable();
  }

  //Old method no longer used
  //Replaced with saveFloorplan cause I needed to have access to backend id in svgComponent
  // saveFloorplanOld(
  //   businessId: number,
  //   height: number,
  //   width: number,
  //   name: string) {
  //     const floorplanData = {
  //       "businessId": businessId,
  //       "height": height,
  //       "width": width,
  //       "name": name
  //     };
  //     this.http.post<{
  //       id: number,
  //       businessId: number,
  //       height: number,
  //       width: number,
  //       name: string
  //     }>(
  //       'http://localhost:3000/floorplan/add',
  //       floorplanData
  //     ).subscribe({
  //       next: data => {
  //         this.floorplans = this.addIdToFloorplan(data.name, data.id);
  //         // this.floorplans.push(newFloorplan);
  //         this.floorplansUpdated.next({
  //           floorplans: [...this.floorplans]
  //         });
  //       },
  //       error: error => {
  //         console.log('ERROR: ' + error);
  //       }
  //     });
  // }

  //Saves a floorplan to the backend via http post request
  //Gets the floorplanId given in the backend and adds it to the floorplan object in the array
  saveFloorplan(
    businessId: number,
    height: number,
    width: number,
    name: string
  ) {
    const floorplanData = {
      "businessId": businessId,
      "height": height,
      "width": width,
      "name": name
    };

    return this.http.post<{
      id: number,
      businessId: number,
      height: number,
      width: number,
      name: string
    }>(
      'http://localhost:3000/floorplan/add',
      floorplanData
    );
  }

  //Adds backend id to floorplan object in array after it has been saved to the backend
  addIdToFloorplan(name: string, floorplanId: number) {
    const index = this.floorplans.findIndex(floorplan => floorplan.name === name);
    if (index !== -1) {
      this.floorplans[index].id = floorplanId;
    }
    return this.floorplans;
  }

  //Returns all floorplans stored in the backend.
  getFloorplans(businessId: number) {
    this.http
      .get<{ floorplans: any }>('http://localhost:3000/floorplan/get/' + businessId)
      .pipe(
        map((floorplanData) => {
          return {
            floorplans: floorplanData.floorplans.map((floorplan) => {
              return {
                id: floorplan.id,
                businessId: floorplan.businessId,
                height: floorplan.height,
                width: floorplan.width,
                name: floorplan.name
              };
            })
          };
        })
      )
      .subscribe({
        next: data => {
          this.floorplans = data.floorplans;
          this.floorplansUpdated.next({
            floorplans: [...this.floorplans]
          });
        },
        error: error => {
          console.log("ERROR: " + error);
        }
      });
  }

  //Deletes a floorplan from the backend
  deleteFloorplan(businessId: number, floorplanId: number) {
    const queryParams = businessId + '/' + floorplanId;
    this.http
      .delete(
        'http://localhost:3000/floorplan/delete/' + queryParams
      ).subscribe({
        next: data => {
          this.floorplans = this.removeFromArray(floorplanId);
          this.floorplansUpdated.next({
            floorplans: [...this.floorplans]
          });
        },
        error: error => {
          console.log('ERROR: ' + error);
        }
      });
  }

  //Removes a floorplan from the floorplan array based on its id
  removeFromArray(floorplanId: number) {
    const index = this.floorplans.findIndex(floorplan => floorplan.id === floorplanId);
    if (index !== -1) {
      this.floorplans.splice(index, 1);
    }
    return this.floorplans;
  }

  //Removes a floorplan from the floorplan array based on its name
  deleteFromArrayByName(name: string) {
    const index = this.floorplans.findIndex(floorplan => floorplan.name === name);
    if (index !== -1) {
      this.floorplans.splice(index, 1);
    }
    this.floorplansUpdated.next({
      floorplans: [...this.floorplans]
    });
  }



  //Adds a floorplan to the array NOT the backend
  addFloorplan(
    floorplan: FloorplanModel) {
      if (!this.floorplans.find(floorplan2 => floorplan2.name === floorplan.name)) {
        this.floorplans.push(floorplan);
        this.floorplansUpdated.next({
          floorplans: [...this.floorplans]
        });
      }
  }
}
