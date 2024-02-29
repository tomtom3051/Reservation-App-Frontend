import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { AuthService } from "../services/auth.service";
import { map } from 'rxjs/operators';
import { BusinessModel } from "../models/business.model";

/**
 * This service gets a users favourite businesses from the backend and provides them to
 * the profile-favourites component so they can be shown
 *
 * Possible issue: businesses might have a different id than in the BusinessService with how
 * the arrays are currently set up, so must find some way to keep them consistent so that
 * we can also navigate to the business page from user profiles.
 */
@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
  private favorites: BusinessModel[] = [];
  private favoritesUpdated = new Subject<{ favorites: BusinessModel[] }>();

    constructor(
      private http: HttpClient,
      private authService: AuthService
    ) {}

    getFavoriteUpdateListener() {
      return this.favoritesUpdated.asObservable();
    }

    getFavorites(userId: number) {
      this.http
        .get<{ favorites: any }>('http://localhost:3000/favorite/' + userId)
        .pipe(
          map((favData) => {
            return {
              favorites: favData.favorites.map((favorite) => {
                return {
                  id: favorite.id,
                  name: favorite.name,
                  email: favorite.email,
                  profileImgPath: favorite.profileImgPath,
                  description: favorite.description,
                };
              })
            };
          })
        )
        .subscribe((transformedFavData) => {
          this.favorites = transformedFavData.favorites;
          this.favoritesUpdated.next({
            favorites: [...this.favorites]
          });
        });
    }

    addFavorite(businessId: number) {
      const userId = this.authService.getUserId();
      const queryParams = userId + '/' + businessId;
      this.http.post<{ message: string, favorite: any }>(
        'http://localhost:3000/favorite/' + queryParams, {}
      ).subscribe(response => {
        //console.log(response);
      }, error => {
        //console.log(error);
      });
    }

    checkIfFavorite(businessId: number): Observable<boolean> {
      const userId = this.authService.getUserId();
      const queryParams = userId + '/' + businessId;
      return this.http.get<{ isFavorite: boolean }>(
        'http://localhost:3000/favorite/' + queryParams
      ).pipe(map((response) => response.isFavorite));
    }

    removeFavorite(businessId: number) {
      const userId = this.authService.getUserId();
      const queryParams = userId + '/' + businessId;
      this.http.delete('http://localhost:3000/favorite/' + queryParams)
        .subscribe(response => {
          //console.log(response);
        }, error => {
          //console.log(error);
      });
    }
}
