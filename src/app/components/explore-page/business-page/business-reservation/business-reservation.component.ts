import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessService } from 'src/app/services/business.service';
import { BusinessHoursService } from 'src/app/services/businessHours.service';
import { FriendsService } from 'src/app/services/friend.service';

@Component({
  selector: 'app-business-reservation',
  templateUrl: './business-reservation.component.html',
  styleUrls: ['./business-reservation.component.css']
})
export class BusinessReservationComponent implements OnInit, OnDestroy {
  //these are the date and Time currently selected in the date/time pickers
  public reservationDate: string;
  public currentTime: string;
  //Saves the initial date when the reservation is being made
  public today: string;
  //Store the current users id here
  public userId: number;
  //Store the current business id of this page
  public pageId: number;

  //Store the weekday of the chosen date
  public weekday: string;

  //Store info about opening and closing time
  public openingHour: number;
  public openingMinute: number;
  public closingHour: number;
  public closingMinute: number;
  private closed: boolean = false;

  //boolean shows whether friends dropdown is open or closed
  friendsIsOpen = false;

  //Stores friends and all subs related to getting them from services.
  friends: UserModel[] = [];
  friendsSub: Subscription;

  //Array stores info of all friends invited by user.
  friendsAdded: UserModel[] = [];

  constructor(
    private friendsService: FriendsService,
    private authService: AuthService,
    private businessHoursService: BusinessHoursService,
    private businessService: BusinessService,
    //Bring in router for nav, might be removed later
    private router: Router
  ) {}

  ngOnInit(): void {
    //Get the current users id.
    this.userId = this.authService.getUserId();

    //Get the business id of the page you are currently on
    this.pageId = this.businessService.getCurrentPageId();

    //Use friendService to get all ids of users current user is friends with.
    this.friendsService.getFriends(this.userId);
    //Set up a subsciption to get correct values.
    this.friendsSub = this.friendsService
    .getFriendUpdateListener()
    .subscribe((friendData: { friends: UserModel[] }) => {
      this.friends = friendData.friends;
    });

    const currentDate = new Date();

    //Set initial weekday
    this.weekday = currentDate.toLocaleString('en-US', { weekday: 'long'});

    this.businessHoursService.getBusinessHoursForDay(this.pageId, this.weekday).subscribe({
      next: hoursData => {
        this.getMaxMinTime(hoursData);
      },
      error: error => {
        // console.log("reached!");
        this.closed = true;
      }
    })
    this.businessHoursService.getBusinessHoursForDay(this.pageId, this.weekday).subscribe(hoursData => {
      this.getMaxMinTime(hoursData);
      // console.log(this.openingHour, this.openingMinute);
      // console.log(this.closingHour, this.closingMinute);
    });

    //today needed for [min] in html to ensure no one can make a reservation in the past
    this.today = currentDate.toISOString().substring(0, 10);

    //Setting reservationDate = today ensures datepicker has current date as placeholder
    this.reservationDate = this.today;

    //setting current time to reservationTime sets current time as placeholder in time picker
    this.currentTime = currentDate.toTimeString().substring(0, 5);

  }

  reservationTime = new FormControl<NgbTimeStruct | null>(null, (control: FormControl<NgbTimeStruct | null>) => {
    const value = control.value;
    const currentDate = new Date();

    if (!value) {
      return null;
    }

    if (this.closed) {
      return { closed: true }
    }

    if (this.today === this.reservationDate && ((value.hour < currentDate.getHours()) || (value.hour === currentDate.getHours() && value.minute < currentDate.getMinutes()))) {
      return { timePast: true }
    }


    if ((value.hour > this.closingHour) || (value.hour === this.closingHour && value.minute > this.closingMinute)) {
      return { invalid: true }
    }

    if ((value.hour < this.openingHour) || (value.hour === this.openingHour && value.minute < this.openingMinute)) {
      return { invalid: true }
    }

    return null;
  });

  getSelectedWeekday(selectedDate: string) {
    const dateObj = new Date(selectedDate);
    this.weekday = dateObj.toLocaleString('en-US', { weekday: 'long'});

    this.businessHoursService.getBusinessHoursForDay(this.pageId, this.weekday)
      .subscribe({
        next: hoursData => {
          // console.log(hoursData);
          this.closed = false;
          this.getMaxMinTime(hoursData);
          this.reservationTime.updateValueAndValidity();
        },
        error: error => {
          // console.log(error);
          if (error.status === 404) {
            this.closed = true;
            this.reservationTime.updateValueAndValidity();
          }
        }
      });
  }

  getMaxMinTime(hoursData: { opening_time: string, closing_time: string }) {
    const openingTimeParts = hoursData.opening_time.split(':');
    this.openingHour = parseInt(openingTimeParts[0], 10); // Parses the hour string as an integer
    this.openingMinute = parseInt(openingTimeParts[1], 10); // Parses the minute string as an integer

    // Extracting closing_time hour and minute
    const closingTimeParts = hoursData.closing_time.split(':');
    this.closingHour = parseInt(closingTimeParts[0], 10); // Parses the hour string as an integer
    this.closingMinute = parseInt(closingTimeParts[1], 10); // Parses the minute string as an integer
  }

  //This toggles wether or not the friends dropdown menu is open
  toggleDropDown() {
    this.friendsIsOpen = !this.friendsIsOpen;
  }

  //Add a friend to the invited friends array
  inviteFriend(friend: UserModel) {
    this.friendsAdded.push(friend);
    this.removeFriendFromFriendsArray(friend);
    //console.log(this.friendsAdded);
  }

  uninvite(friend: UserModel) {
    this.friends.push(friend);
    this.removeFriendFromAddedFriendsArray(friend);
  }

  //Removes friend from friends array after they have been invited
  //Prevents user from being able to invite them twice.
  removeFriendFromFriendsArray(friend: UserModel) {
    const index = this.friends.findIndex( u => u === friend);
    if (index !== -1) {
      this.friends.splice(index, 1);
    }
  }

  removeFriendFromAddedFriendsArray(friend: UserModel) {
    const index = this.friendsAdded.findIndex( u => u === friend);
    if (index !== -1) {
      this.friendsAdded.splice(index, 1);
    }
  }

  //Temporary function brings you to page to change floorplan
  tempEditFloorplan() {
    this.router.navigate(['/business-layout', this.pageId]);
  }

  makeReservation() {
    console.log(this.friendsAdded);
    console.log(this.weekday);
    console.log(this.reservationTime.value);
  }

  //On destroy unsubs everything that needs to be unsubbed.
  ngOnDestroy(): void {
    this.friendsSub.unsubscribe();
  }
}
