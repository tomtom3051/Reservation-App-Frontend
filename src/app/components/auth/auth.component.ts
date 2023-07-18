import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  loggedIn = false;
  authSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedIn = this.authService.getIsAuth();
    this.authSub = this.authService.getAuthStatusListner()
      .subscribe((loggedIn: boolean) => {
        this.loggedIn = loggedIn;
      });

    if (this.loggedIn) {
      this.router.navigate(['/explore']);
    }

  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
