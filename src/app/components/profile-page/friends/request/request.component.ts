import { Component, Input } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { FriendsService } from 'src/app/services/friend.service';
import { FriendRequestService } from 'src/app/services/friendRequest.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent {
  @Input() userRequest: UserModel;

  constructor(
    private userService: UserService,
    private friendService: FriendsService,
    private friendRequestService: FriendRequestService){}


  acceptRequest() {
    const pageId = this.userService.getPageUserId();
    this.friendRequestService.deleteRequest(this.userRequest.id, pageId);
    this.friendService.addFriend(this.userRequest.id, pageId);
  }

  declineRequest() {
    console.log('decline!');
  }
}
