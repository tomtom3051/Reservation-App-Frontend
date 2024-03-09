import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-business-menu',
  templateUrl: './business-menu.component.html',
  styleUrls: ['./business-menu.component.css']
})

/**
 * This component should be a menu bar that allows you to navigate the business page
 *
 * There should be a page with information including a location and maybe opening hours
 *
 * There could be a page with images, this could maybe be a live feed at some point
 * in the future, for the minimum viable product it won't be
 *
 * There will be a reservation tab with a form where you can book a reservation.
 *
 */
export class BusinessMenuComponent implements OnInit {

  //Check if user visiting is logged in
  userIsAuth: boolean = false;

  //Connect authservice to component
  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    //Check if user is logged in so we can control user can only access appropriate pages
    this.userIsAuth = this.authService.getIsAuth();
  }
}
