import { Component } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.component.html',
  styleUrls: ['./add-friends.component.css']
})
export class AddFriendsComponent {
  username: string = '';

  users: UserModel[] = [
    // new UserModel(
    //   1, "Tom", "Tom@sijbers.net", "password", "http://www.wallpapers13.com/wp-content/uploads/2015/12/Nature-Lake-Bled.-Desktop-background-image.jpg", "I am God!"
    // ),
    // new UserModel(
    //   2, "User", "User@sijbers.net", "password", "http://getwallpapers.com/wallpaper/full/8/d/1/798741-download-free-awesome-nature-backgrounds-1920x1080-for-tablet.jpg", "I am God!"
    // )

  ];


  constructor(
    private userService: UserService
  ) {}

  onInputUpdated() {
    if (this.username.length > 0) {
      this.userService.searchByUsername(this.username).subscribe({
        next: (result) => {
          // console.log(result);
          this.users = result.users.map(user => new UserModel(
            user.id, user.name, '', '', user.profileImgPath, ''
          ));
        }
      });
    } else {
      this.users = [];
    }
  }
}
