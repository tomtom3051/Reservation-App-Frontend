import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-business',
  templateUrl: './register-business.component.html',
  styleUrls: ['./register-business.component.css']
})
export class RegisterBusinessComponent implements OnInit, OnDestroy {
  isLoading = false;
  authSub: Subscription;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    //I don't know why this is here
    this.authSub = this.authService.getAuthStatusListner().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  //Executes when register button is pressed
  onRegister(form: NgForm) {
    //registration fails if form is invalid
    if (form.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.authService.registerBusiness(form.value.name, form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

}
