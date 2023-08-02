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

  //Http request gets business from business database connected to the backend
  //TODO: remove password from info being sent.
  getBusinesses() {
    this.http
      .get<{ businesses: any }>('http://localhost:3000/business')
      .pipe(
        map((businessData) => {
          return {
            businesses: businessData.businesses.map((business) => {
              return {
                id: business.id,
                name: business.name,
                email: business.email,
                password: business.password,
                profileImgPath: business.profileImgPath,
                description: business.description,
                longitude: business.longitude,
                latitude: business.latitude
              };
            })
          };
        })
      )
      .subscribe((transformedBusinessData) => {
        this.businesses = transformedBusinessData.businesses;
        this.businessesUpdated.next({
          businesses: [...this.businesses]
        });
      });
  }

  getBusiness(id: number) {
    this.currentId = id;
    return this.http.get<{
      id: number;
      name: string;
      email: string;
      password: string;
      profileImgPath: string;
      description: string;
      longitude: any;
      latitude: any;
    }>('http://localhost:3000/business/' + id);
  }

  getBusinessLocation(id: number) {
    return this.http.get<{
      latitude: string;
      longitude: string;
    }>('http://localhost:3000/business/location/' + id);
  }

  getCurrentPageId() {
    return this.currentId;
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
