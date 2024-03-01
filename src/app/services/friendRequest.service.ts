import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, map } from "rxjs";
import { UserModel } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {
  private requests: UserModel [] = [];
  private requestsUpdated = new Subject< { requests: UserModel[] } >();

  constructor(
    private http: HttpClient
  ) {}

  getRequestUpdateListener() {
    return this.requestsUpdated.asObservable();
  }

  getRequests(userId: number) {
    this.http
      .get<{ requests: any }>('http://localhost:3000/request/' + userId)
      .pipe(
        map((requestData) => {
          return {
            requests: requestData.requests.map((request) => {
              return {
                id: request.id,
                name: request.name,
                email: request.email,
                password: request.password,
                profileImgPath: request.profileImgPath,
                description: request.description
              };
            })
          };
        })
      )
      .subscribe((transformedRequestData) => {
        this.requests = transformedRequestData.requests;
        this.requestsUpdated.next({
          requests: [...this.requests]
        });
      });
  }

  deleteRequest(requestUserId: number, receiverUserId: number) {
    const queryParams = requestUserId + '/' + receiverUserId;
    this.http
      .delete(
        'http://localhost:3000/request/' + queryParams
      ).subscribe(response => {
        // console.log('request deleted! ' + response);
        this.requests = this.removeIdFromRequests(requestUserId);
        this.requestsUpdated.next({
          requests: [...this.requests]
        });
      }, error => {
        // console.log('Something went wrong! ' + error);
      }
      );
  }

  removeIdFromRequests(id: number): UserModel[] {
    const index = this.requests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.requests.splice(index, 1);
    }
    return this.requests;
  }

  postFriendRequest(requesterId: number, RequestedId: number) {
    const queryParams = requesterId + '/' + RequestedId;

    return this.http.post<{
      message: string,
      request: any
    }>("http://localhost:3000/request/" + queryParams, {});
  }
}
