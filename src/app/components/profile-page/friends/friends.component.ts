import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { FriendsService } from 'src/app/services/friend.service';
import { FriendRequestService } from 'src/app/services/friendRequest.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit, OnDestroy {
  //booleans for toggling different sections
  showFriends = false;
  showFriendRequests = false;
  showAddFriends = false;

  //Storing and getting friend info
  friends: UserModel[] = [];
  friendSub: Subscription;
  public userId: number;

  //Storing and getting info on friend requests
  requests: UserModel[] = [];
  requestsSub: Subscription;


  constructor(
    private friendsService: FriendsService,
    private userService: UserService,
    private friendRequestService: FriendRequestService
    ) {}

  ngOnInit(): void {
    this.userId = this.userService.getPageUserId();


    this.friendsService.getFriends(this.userId);
    this.friendSub = this.friendsService
      .getFriendUpdateListener()
      .subscribe((friendData: { friends: UserModel[] }) => {
        this.friends = friendData.friends;
      });

    this.friendRequestService.getRequests(this.userId);
    this.requestsSub = this.friendRequestService
      .getRequestUpdateListener()
      .subscribe((requestData: { requests: UserModel[] }) => {
        this.requests = requestData.requests;
      });
  }

  toggleFriends() {
    this.showFriends = !this.showFriends;
  }

  toggleFriendRequests() {
    this.showFriendRequests = !this.showFriendRequests;
  }

  toggleAddFriends() {
    this.showAddFriends = !this.showAddFriends;
  }

  ngOnDestroy(): void {
    this.friendSub.unsubscribe();
    this.requestsSub.unsubscribe();
  }
}
