import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, map } from "rxjs";
import { UserModel } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private friends: UserModel[] = [];
  private friendsUpdated = new Subject< { friends: UserModel[] }>();

  constructor(
    private http: HttpClient
  ) {}

  getFriendUpdateListener() {
    return this.friendsUpdated.asObservable();
  }


  //gets all friend profile info
  getFriends(userId: number) {
    this.http
      .get<{ friends: any }>('http://localhost:3000/friend/' + userId)
      .pipe(
        map((friendData) => {
          return {
            friends: friendData.friends.map((friend) => {
              return {
                id: friend.id,
                name: friend.name,
                email: friend.email,
                password: friend.password,
                profileImgPath: friend.profileImgPath,
                description: friend.description
              };
            })
          };
        })
      )
      .subscribe((transformedFriendData) => {
        this.friends = transformedFriendData.friends;
        this.friendsUpdated.next({
          friends: [...this.friends]
        });
      });
  }

  //Adds a friend
  addFriend(friend1Id: number, friend2Id: number) {
    const queryParams = friend1Id + '/' + friend2Id;
    this.http
      .post<{ message: string, friend: any }>(
        'http://localhost:3000/friend/' + queryParams, {}
      ).subscribe(response => {
        // console.log(response);
        const friend: UserModel = {
          id: response.friend.id,
          name: response.friend.name,
          email: response.friend.email,
          password: response.friend.password,
          profileImgPath: response.friend.profileImgPath,
          description: response.friend.description,
        }

        this.friends.push(friend);
        this.friendsUpdated.next({
          friends: [...this.friends]
        });
      }, error => {
        // console.log(error);
      });
  }

  removeFriend() {}

  checkIfFriend() {}
}
