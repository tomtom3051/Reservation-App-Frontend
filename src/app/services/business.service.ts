import { Injectable } from '@angular/core';
import { BusinessModel } from '../models/business.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

/**
 * Currently this service fetches information about businesses and
 * provides it to the business components.
 *
 * In the future this component will reach out to the back end and
 * retrieve businesses matching a given parameter to show the users.
 */
@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  //This array stores all relevant businesses
  private businesses: BusinessModel[] = [];
  private businessesUpdated = new Subject<{ businesses: BusinessModel[] }>();

  //To get the id of the page you are currently on
  private currentId: number;

  constructor(private http: HttpClient, private router: Router) {}

  getBusinessUpdateListener() {
    return this.businessesUpdated.asObservable();
  }


  getBusinessesByLocation(lat: number, lng: number, rad: number) {
    const queryString = lat + "/" + lng + "/" + rad;
    // console.log(queryString);
    this.http
      .get<{ businesses: any }>('http://localhost:3000/business/find/' + queryString)
      .pipe(
        map((businessData) => {
          return {
            businesses: businessData.businesses.map((business) => {
              return {
                id: business.id,
                name: business.name,
                email: business.email,
                profileImgPath: business.profileImgPath,
                description: business.description
              };
            })
          };
        })
      )
      .subscribe((transBusinessData) => {
        this.businesses = transBusinessData.businesses;
        this.businessesUpdated.next({
          businesses: [...this.businesses]
        });
      });
  }

  //Http request gets business from business database connected to the backend
  //TODO: remove password from info being sent.
  // getBusinesses() {
  //   this.http
  //     .get<{ businesses: any }>('http://localhost:3000/business')
  //     .pipe(
  //       map((businessData) => {
  //         return {
  //           businesses: businessData.businesses.map((business) => {
  //             return {
  //               id: business.id,
  //               name: business.name,
  //               email: business.email,
  //               profileImgPath: business.profileImgPath,
  //               description: business.description
  //             };
  //           })
  //         };
  //       })
  //     )
  //     .subscribe((transformedBusinessData) => {
  //       this.businesses = transformedBusinessData.businesses;
  //       this.businessesUpdated.next({
  //         businesses: [...this.businesses]
  //       });
  //     });
  // }

  //Get info about a specific business based on its id
  getBusiness(id: number) {
    this.currentId = id;
    return this.http.get<{
      id: number;
      name: string;
      email: string;
      profileImgPath: string;
      description: string;
    }>('http://localhost:3000/business/' + id);
  }

  //Get a businesses lat and lng info based on its id
  getBusinessLocation(id: number) {
    return this.http.get<{
      latitude: string;
      longitude: string;
    }>('http://localhost:3000/business/location/' + id);
  }

  //Return the id of the page a user is currently on
  getCurrentPageId() {
    return this.currentId;
  }

  //Get a businesses description, lat and lng based on its id
  getBusinessInfo(id: number) {
    return this.http.get<{
      description: string,
      longitude: string,
      latitude: string
    }>("http://localhost:3000/business/info/" + id);
  }

  //Update only the description of a specific business
  updateDescription(id: number, description: string) {
    const updateData = {
      "description": description
    }
    this.http.patch<{
      message: String,
      description: any
    }>(
      'http://localhost:3000/business/description/' + id,
      updateData
    ).subscribe({
      next: data => {
        // console.log(data);
      },
      error: error => {
        console.log("ERROR: " + error);
      }
    });
  }

  //Update only the location of a specific business
  updateLocation(id: number, lat: number, lng: number) {
    const updateData = {
      "longitude": lng,
      "latitude": lat
    }
    this.http.patch<{
      message: String,
      location: any
    }>(
      'http://localhost:3000/business/location/' + id,
      updateData
    ).subscribe({
      next: data => {
        console.log(data);
      },
      error: error => {
        console.log("ERROR: " + error);
      }
    });
  }

  //Update the description and location of a business
  updateDescriptionAndLocation(id: number, description: string, lat: number, lng: number) {
    const updateData = {
      "description": description,
      "longitude": lng,
      "latitude": lat
    }

    this.http.patch<{
      message: String,
      info: any
    }>(
      'http://localhost:3000/business/locdesc/' + id,
      updateData
    ).subscribe({
      next: data => {
        console.log(data);
      },
      error: error => {
        console.log("ERROR: " + error);
      }
    });
  }

  //old code in case I want to look at it.
  // private businesses: BusinessModel[] = [
  //     new BusinessModel(
  //       1,
  //       'Example',
  //       'example@gmail.com',
  //       'https://www.metoffice.gov.uk/binaries/content/gallery/metofficegovuk/hero-images/advice/maps-satellite-images/satellite-image-of-globe.jpg',
  //       'This is a test!',
  //       'Londen'
  //     ),
  //     new BusinessModel(
  //       2,
  //       'Example 2',
  //       'example2@gmail.com',
  //       'http://cdn57.picsart.com/179951678001202.jpg',
  //       'This is a test 2!',
  //       'Dubai'

  //     ),
  //     new BusinessModel(
  //       3,
  //       'Example 3',
  //       'example3@gmail.com',
  //       'https://townsquare.media/site/442/files/2018/11/shrek-reboot-oh-no.jpg?w=1200&h=0&zc=1&s=0&a=t&q=89',
  //       'This really is a test!',
  //       'Lummen'
  //     )
  //   ];
}
