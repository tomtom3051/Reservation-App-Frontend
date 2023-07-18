import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent implements OnInit, OnDestroy {
  //Stores the id of the page currently being looked at.
  public pageUserId: number;
  private pageUserIdSub: Subscription;
  //Stores the id od the user currently logged in.
  public authUserId: number;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authUserId = this.authService.getUserId();
    this.pageUserId = this.userService.getPageUserId();
    this.pageUserIdSub = this.userService.getPageUserIdUpdateListener()
      .subscribe(id => {
        this.pageUserId = id;
      })
  }

  ngOnDestroy(): void {
      this.pageUserIdSub.unsubscribe();
  }
}
