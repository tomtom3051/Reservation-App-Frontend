import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BusinessModel } from 'src/app/models/business.model';
import { BusinessService } from 'src/app/services/business.service';
import { FavoritesService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-business-page',
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.css']
})
export class BusinessPageComponent implements OnInit {
  id: number;
  business: BusinessModel;
  isFavorite: boolean;

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router,
    private favoritesService: FavoritesService) {}

  ngOnInit(): void {
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
            password: businessData.password,
            profileImgPath: businessData.profileImgPath,
            description: businessData.description,
            location: businessData.location
          }
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
