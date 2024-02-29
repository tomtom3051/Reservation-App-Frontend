import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
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
    private router: Router
  ) {}

  public isLoading: boolean = false;
  public userId: number;
  user: UserModel;

  myProfile = false;
  isFriend = false;

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
          this.isLoading = false;
        });
      }
    );
  }


  changeFriend() {
    this.isFriend = !this.isFriend;
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
