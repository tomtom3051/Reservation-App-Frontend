import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ExplorePageComponent } from './components/explore-page/explore-page.component';
import { AuthGuard } from './guards/auth.guard';
import { BusinessPageComponent } from './components/explore-page/business-page/business-page.component';
import { BusinessInfoComponent } from './components/explore-page/business-page/business-info/business-info.component';
import { BusinessMenuPageComponent } from './components/explore-page/business-page/business-menu-page/business-menu-page.component';
import { BusinessReservationComponent } from './components/explore-page/business-page/business-reservation/business-reservation.component';
import { BusinessImagesComponent } from './components/explore-page/business-page/business-images/business-images.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { FavoritesComponent } from './components/profile-page/favorites/favorites.component';
import { FriendsComponent } from './components/profile-page/friends/friends.component';
import { ScheduleComponent } from './components/profile-page/schedule/schedule.component';
import { RegisterBusinessComponent } from './components/auth/register-business/register-business.component';
import { InfoFormComponent } from './components/auth/register-business/info-form/info-form.component';
import { SvgLayoutComponent } from './components/explore-page/svg-layout/svg-layout.component';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'register-business', component: RegisterBusinessComponent },
  { path: 'business-info/:id', component: InfoFormComponent },
  { path: 'business-layout/:id', component: SvgLayoutComponent },
  { path: 'explore', component: ExplorePageComponent, canActivate: [AuthGuard] },
  { path: 'explore/:id', component: BusinessPageComponent, canActivate: [AuthGuard], children: [
    { path: '', redirectTo: 'info', pathMatch: 'full' },
    { path: 'info', component: BusinessInfoComponent },
    { path: 'menu', component: BusinessMenuPageComponent },
    { path: 'reservation', component: BusinessReservationComponent },
    // { path: 'images', component: BusinessImagesComponent}
  ] },
  { path: 'profile/:id', component: ProfilePageComponent, canActivate: [AuthGuard], children: [
    { path: '', redirectTo: 'favorites', pathMatch: 'full' },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'friends', component: FriendsComponent },
    { path: 'schedule', component: ScheduleComponent }
  ] },
  { path: 'test', component: TestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule { }
