import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';
import { mimeType } from 'src/app/validators/mime-type.validator';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private imageService: ImageService
  ) {}
  //Set up form
  form: FormGroup;

  //Store user info in UserModel object
  user: UserModel;

  //Store original user info, this ensures we can check if info changed
  userOriginal: UserModel;

  //Store user Id
  public userId: number;

  //isLoading variable shows whether data is being loaded from database
  isLoading: boolean = false;

  ngOnInit(): void {
    //Set isLoading to false while loading user data
    this.isLoading = true;

    //Retrieve user id from params
    this.route.params.subscribe(
      (params: Params) => {
        this.userId = +params["id"];

        //After getting user ID load users info from the backend
        this.userService.getUser(this.userId).subscribe((userData) => {
          //Store retrieved info in userOriginal object
          this.userOriginal = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: userData.password,
            profileImgPath: userData.profileImgPath,
            description: userData.description,
          }

          //Copy userOriginal object into user object
          //user object will register and store any changes that occur
          //userOriginal will not change the original data
          //This way we can check if changes where made to the data when submitting
          this.user = {...this.userOriginal};

          //Initialize form
          this.form = new FormGroup({
            image: new FormControl(this.user.profileImgPath, { validators: [Validators.required], asyncValidators: [mimeType] }),
            description: new FormControl(this.user.description, { validators: [Validators.required] }),
          });

          this.isLoading = false;
        });
      }
    );
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.user.profileImgPath = <string>reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    //Ensure input data is valid
    if (this.form.invalid) {
      return;
    }

    if (
      this.userOriginal.description === this.user.description
      &&
      this.userOriginal.profileImgPath === this.user.profileImgPath) {
        return;
      }

    //Send new image to backend

    const file: File = this.form.get('image').value;
    if (file) {
      //Use image service to make a http post of the image to the backen
      if (this.user.profileImgPath === this.userOriginal.profileImgPath) {
        this.userService.updateUser(this.user).subscribe((response) => {
          this.router.navigate(['/profile', this.userId]);
        });
      } else {
        this.imageService.uploadImage(file).subscribe(response => {
          //Store the image file name in url object
          const url = response.url;

          //Store the complete image backend url in user object
          this.user.profileImgPath = "http://localhost:3000/pictures/" + url;

          //Now update user info in the backend
          this.userService.updateUser(this.user).subscribe((response) => {
            this.router.navigate(['/profile', this.userId]);
          });

        });
      }
      //reset form
      //this.form.reset();

      //Reroute user to his profile page
      // this.router.navigate(['/profile', this.userId]);
    }
  }
}
