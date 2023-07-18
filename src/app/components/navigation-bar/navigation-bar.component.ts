import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  public loggedIn: boolean = false;
  private authListenerSubs: Subscription;
  public userId: number;
  private idSub: Subscription;
  constructor(private authService: AuthService) {}

  //When the page is initialized this checks if the user is logged in,
  //this is used to hide features that should not be visible when not logged in or logged in.
  //also gets user id so we can redirect to the correct user profile
  ngOnInit(): void {
    this.loggedIn = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authListenerSubs = this.authService.getAuthStatusListner()
      .subscribe(isAuthenticated => {
        this.loggedIn = isAuthenticated;
      });

    //Had to set up a sub for user id in this component cause component is never destroyed
    //So when a user logs out and a new user logs in it retains the old users user id.
    //This should send a signal to change the id when user log in or out.
    this.idSub = this.authService.getUserIdListner()
      .subscribe(updatedId => {
        this.userId = updatedId;
      });

  }
  //This code activates when the logout button is pressed, it logs the user out
  logout() {
    //this.userId = null;
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.idSub.unsubscribe();
  }
}
