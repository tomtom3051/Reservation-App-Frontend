import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { ExplorePageComponent } from './components/explore-page/explore-page.component';
import { BusinessComponent } from './components/explore-page/business/business.component';
import { BusinessPageComponent } from './components/explore-page/business-page/business-page.component';
import { BusinessSearchBarComponent } from './components/explore-page/business-search-bar/business-search-bar.component';
import { BusinessInfoComponent } from './components/explore-page/business-page/business-info/business-info.component';
import { BusinessMenuComponent } from './components/explore-page/business-page/business-menu/business-menu.component';
import { BusinessMenuPageComponent } from './components/explore-page/business-page/business-menu-page/business-menu-page.component';
import { MenuItemComponent } from './components/explore-page/business-page/business-menu-page/menu-item/menu-item.component';
import { BusinessReservationComponent } from './components/explore-page/business-page/business-reservation/business-reservation.component';
import { BusinessImagesComponent } from './components/explore-page/business-page/business-images/business-images.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { FriendsComponent } from './components/profile-page/friends/friends.component';
import { FriendComponent } from './components/profile-page/friends/friend/friend.component';
import { ProfileDetailComponent } from './components/profile-page/profile-detail/profile-detail.component';
import { FavoritesComponent } from './components/profile-page/favorites/favorites.component';
import { FavoriteComponent } from './components/profile-page/favorites/favorite/favorite.component';
import { ProfileMenuComponent } from './components/profile-page/profile-menu/profile-menu.component';
import { ScheduleComponent } from './components/profile-page/schedule/schedule.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RequestComponent } from './components/profile-page/friends/request/request.component';
import { RegisterBusinessComponent } from './components/auth/register-business/register-business.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { TimePickerComponent } from './components/auth/register-business/time-picker/time-picker.component';
import { InfoFormComponent } from './components/auth/register-business/info-form/info-form.component';
import { SvgLayoutComponent } from './components/explore-page/svg-layout/svg-layout.component';
import { SvgComponent } from './components/explore-page/svg-layout/svg/svg.component';
import { TestComponent } from './components/test/test.component';
import { EditProfileComponent } from './components/auth/edit-profile/edit-profile.component';
import { AddFriendsComponent } from './components/profile-page/friends/add-friends/add-friends.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    SignupComponent,
    NavigationBarComponent,
    ExplorePageComponent,
    BusinessComponent,
    BusinessPageComponent,
    BusinessSearchBarComponent,
    BusinessInfoComponent,
    BusinessMenuComponent,
    BusinessMenuPageComponent,
    MenuItemComponent,
    BusinessReservationComponent,
    BusinessImagesComponent,
    ProfilePageComponent,
    FriendsComponent,
    FriendComponent,
    ProfileDetailComponent,
    FavoritesComponent,
    FavoriteComponent,
    ProfileMenuComponent,
    ScheduleComponent,
    RequestComponent,
    RegisterBusinessComponent,
    TimePickerComponent,
    InfoFormComponent,
    SvgLayoutComponent,
    SvgComponent,
    TestComponent,
    EditProfileComponent,
    AddFriendsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    NoopAnimationsModule,
    NgbModule,
    NgbTimepickerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAdhtoKDi47LSipXPmij_N9ZA0Ti9ouOvc'
    })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
