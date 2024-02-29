import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserModel } from "../models/user.model";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public pageUserId: number;
  public pageUserIdUpdated = new Subject<number>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}


  getPageUserIdUpdateListener() {
    return this.pageUserIdUpdated.asObservable();
  }



  getPageUserId() {
    return this.pageUserId;
  }

  getUser(userId: number) {
    this.pageUserId = userId;
    this.pageUserIdUpdated.next(this.pageUserId);

    return this.http.get<{
      id: number,
      name: string,
      email: string,
      password: string,
      profileImgPath: string,
      description: string,
      createdAt: string,
      updatedAt: string

    }>(
      'http://localhost:3000/user/' + userId
    );
  }


  updateUser(user: UserModel) {
    const updatedUser = {
      "profileImgPath": user.profileImgPath,
      "description": user.description
    };

    return this.http.patch<{
      message: string,
      user: any
    }>(
      "http://localhost:3000/user/update/" + user.id,
      updatedUser
    );
  }

  searchByUsername(username: string) {
    const id = this.authService.getUserId();

    const params = id + "/" + username;

    //console.log(params);

    return this.http.get<{
      users: any
    }>(
      "http://localhost:3000/user/find/" + params
    );
  }
}
