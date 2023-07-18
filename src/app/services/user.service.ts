import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserModel } from "../models/user.model";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public pageUserId: number;
  public pageUserIdUpdated = new Subject<number>();

  constructor(
    private http: HttpClient
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
}
