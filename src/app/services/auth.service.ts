import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({
  providedIn:'root'
})
export class AuthService {
  private token: string;
  private authStatusListner = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: NodeJS.Timer;
  private userId: number;
  private userIdListner = new Subject<number>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Function gets users json web token.
   * @returns The users json web token.
   */
  getToken() {
    return this.token;
  }

  /**
   * Function to get the users id.
   * @returns The users id.
   */
  getUserId() {
    return this.userId;
  }

  /**
   * Returns users auth status.
   * @returns Whether a user is currently logged in.
   */
  getIsAuth() {
    return this.isAuthenticated;
  }

  /**
   * Function creates an observable that can be subscribed to to detect changes in auth status.
   * @returns An observable that sends out a signal when auth status changes.
   */
  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  getUserIdListner() {
    return this.userIdListner.asObservable();
  }


  /**
   * Function creates the user on the backend, then also logs user in automatically.
   * @param name username given by user.
   * @param email email given by user.
   * @param password password given by user.
   */
  signupUser(name: string, email: string, password: string) {
    const signupData = {
      "name": name,
      "email": email,
      "password": password
    };

    this.http.post<{ message: string, user: any }>(
      'http://localhost:3000/auth/user/signup',
      signupData
    ).subscribe(response => {
      this.loginUser(email, password);
    }, error => {
      this.authStatusListner.next(false);
    });
  }

  registerBusiness(name: string, email: string, password: string) {
    const registerData = {
      "name": name,
      "email": email,
      "password": password
    };

    this.http.post<{ message: string, user: any }>(
      'http://localhost:3000/auth/business/signup',
      registerData
    ).subscribe(response => {
      //this.loginUser(email, password);
      //Add a business login here
    }, error => {
      this.authStatusListner.next(false);
    });
  }

  /**
   * Logs user in and stores json web token and user id in auth service.
   * @param email User provided email.
   * @param password User provided password.
   */
  loginUser(email: string, password: string) {

    const loginData = {
      "email": email,
      "password": password
    };
    this.http.post<{ message: string, token: string, id: number }>('http://localhost:3000/auth/user/login', loginData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListner.next(this.isAuthenticated);
          this.userId = response.id;
          this.userIdListner.next(this.userId);
          this.saveAuthData(token, this.userId);
          this.router.navigate(['/explore']);
        }
      }, error => {
        this.authStatusListner.next(false);
      });
  }

  /**
   * Logout function clears all auth info.
   */
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(this.isAuthenticated);
    this.userId = null;
    this.userIdListner.next(this.userId);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }


  /**
   * This function saves auth data with cookies so you do not need to constantly log in.
   * @param token A string with the Json web token
   * @param userId The userId number,
   * can only be stored as string so needs to be turned back into a number when retrieving data
   */
  private saveAuthData(token: string, userId: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', String(userId));
  }

  /**
   * Clears auth data from cookies when user is logged out.
   */
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const userIdString = localStorage.getItem('userId');

    if (!token || !userIdString) {
      return null;
    }
    const userId = parseInt(userIdString, 10);
    return {
      token: token,
      userId: userId
    };
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    this.token = authInformation.token;
    this.userId = authInformation.userId;
    this.isAuthenticated = true;
    this.authStatusListner.next(this.isAuthenticated);
    this.userIdListner.next(this.userId);
    // this.router.navigate(['/explore']);
  }

}
