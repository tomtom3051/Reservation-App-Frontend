import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BusinessModel } from 'src/app/models/business.model';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessService } from 'src/app/services/business.service';
import { FavoritesService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-business-page',
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.css']
})
export class BusinessPageComponent implements OnInit {
  //used to retrieve business id from params
  id: number;
  //Used to store business info
  business: BusinessModel;
  //Stores if logged in user favourites business
  isFavorite: boolean;
  //Store if viewing user is authenticated
  userIsAuth = false;
  isLoading: boolean = false;

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router,
    private favoritesService: FavoritesService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        //I am getting businesses from my array in the service here,
        //in the final version array might not contain every business,
        //Change this to get info directly from the backend.
        this.businessService.getBusiness(this.id).subscribe((businessData) => {
          this.business = {
            id: businessData.id,
            name: businessData.name,
            email: businessData.email,
            profileImgPath: businessData.profileImgPath,
            description: businessData.description
          }
          this.userIsAuth = this.authService.getIsAuth();
          this.isLoading = false;
        });
      }
    );
    this.favoritesService.checkIfFavorite(this.id).subscribe((result) => {
      this.isFavorite = result;
    });
  }

  goBack(): void {
    this.router.navigate(['/explore']);
  }

  changeFavorite() {
    if (this.isFavorite) {
      this.favoritesService.removeFavorite(this.id);
    } else {
      this.favoritesService.addFavorite(this.id);
    }
    this.isFavorite = !this.isFavorite;
  }
}
