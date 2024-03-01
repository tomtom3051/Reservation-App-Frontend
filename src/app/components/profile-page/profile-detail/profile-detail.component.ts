import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FriendsService } from 'src/app/services/friend.service';
import { FriendRequestService } from 'src/app/services/friendRequest.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css']
})
export class ProfileDetailComponent implements OnInit {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private friendsService: FriendsService,
    private friendRequestService: FriendRequestService
  ) {}

  public isLoading: boolean = false;
  public userId: number;
  user: UserModel;

  myProfile = false;
  isFriend = false;

  //To keep track of friend status between users, can be:
  //"friends" if the users are friends
  //"requester" if there is a outgoing request
  //"requested" if there is an incoming request
  //"none" if there is no request and users aren't friends
  friendStatus: string = '';

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params.subscribe(
      (params: Params) => {
        this.userId = +params['id'];
        const authId = this.authService.getUserId();
        if (this.userId === authId) {
          this.myProfile = true;
        } else {
          this.myProfile = false;
        }
        this.userService.getUser(this.userId).subscribe((userData) => {
          this.user = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: userData.password,
            profileImgPath: userData.profileImgPath,
            description: userData.description,
          };

          if (!this.myProfile) {
            //check friend http request
            this.friendsService.checkIfFriend(authId, this.userId).subscribe({
              next: result => {
                this.friendStatus = result.status;
                this.isLoading = false;
              },
              error: error => {
                console.log("ERROR: " + error);
              }
            });
          }
          this.isLoading = false;
        });
      }
    );
  }

  getFriendStatus() {
    switch (this.friendStatus) {
      case "none":
        return "Add Friend";
      case "friends":
        return "Remove Friend";
      case "requester":
        return "Cancel Request";
      case "requested":
        return "Accept Request";
      default:
        return "ERROR";
    }
  }

  //Changes friend status appropriatly when clicking friend button
  changeFriend() {
    //Get id of logged in user
    const authId = this.authService.getUserId();

    switch (this.friendStatus) {

      case "none":
        //users have no relation so friend request will be sent from auth user to page user
        //Send request
        this.friendRequestService.postFriendRequest(authId, this.userId).subscribe({
          next: result => {
            //After post is done change friend status appropriatly
            this.friendStatus = "requester";
          },
          error: error => {
            console.log("ERROR: " + error);
          }
        });
        break;

      case "friends":
        //Users are friends so delete friendship relation in DB
        this.friendsService.removeFriend(authId, this.userId).subscribe({
          next: result => {
            //After delete is done change friend status appropriatly
            this.friendStatus = "none";
          },
          error: error => {
            console.log("ERROR: " + error);
          }
        });
        break;

      case "requester":
        //There is an outgoing request to this pages user

        //remove request
        this.friendRequestService.deleteRequest(authId, this.userId);

        //After delete is done change friend status appropriatly
        this.friendStatus = "none";
        break;

      case "requested":
        //There is a request from this page user to the auth user
        this.friendRequestService.deleteRequest(this.userId, authId);
        this.friendsService.addFriend(authId, this.userId);

        //After change is done change friend status appropriatly
        this.friendStatus = "friends";
        break;

      default:
        console.log("Invalid status");
        break;
    }
  }

  //This function allows the user to change information on their profile, this includes
  //profile picture, description and password
  //This does NOT include
  //id, user name and email as these are used as primary keys throughout the app
  editProfile() {
    if (this.myProfile) {
      this.router.navigate(['/edit-profile', this.userId]);
    }

  }
}
