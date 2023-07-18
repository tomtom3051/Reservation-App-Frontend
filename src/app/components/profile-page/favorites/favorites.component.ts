import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BusinessModel } from 'src/app/models/business.model';
import { FavoritesService } from 'src/app/services/favorite.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  public favorites: BusinessModel[] = [];
  favoriteSub: Subscription;
  public userId: number;
  pageIdSub: Subscription;

  constructor(
    private favoritesService: FavoritesService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.userService.getPageUserId();

    this.pageIdSub = this.userService.getPageUserIdUpdateListener()
      .subscribe((pageId: number) => {
        this.userId = pageId
        this.favoritesService.getFavorites(this.userId);
      })

    this.favoritesService.getFavorites(this.userId);
    this.favoriteSub = this.favoritesService
      .getFavoriteUpdateListener()
      .subscribe((favoriteData: {favorites: BusinessModel[] }) => {
        this.favorites = favoriteData.favorites;
      });
  }

  ngOnDestroy(): void {
    this.favoriteSub.unsubscribe();
  }
}
