import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mimeType } from '../../validators/mime-type.validator'
import { TestService } from 'src/app/services/test.service';
import { ReservableModel } from 'src/app/models/reservable.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  //
  //
  //Image Upload Test Variables
  //
  //

  // form: FormGroup;
  // imagePreview: string;


  //
  //
  //SVG Reservation Test Variables
  //
  //

  public reservables: ReservableModel[] = [
    new ReservableModel(
      1, 20, 3, 62, 91, 30, 50, 2, "1"
    ),
    new ReservableModel(
      2, 20, 3, 58, 246, 70, 90, 9, "2"
    ),
    new ReservableModel(
      3, 20, 3, 243, 429, 50, 70, 4, "3"
    ),
    new ReservableModel(
      4, 20, 3, 445, 214, 70, 90, 4, "4"
    )
  ];

  public selected: number[] = [1];

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    // this.form = new FormGroup({
    //   image: new FormControl(
    //     null,
    //     {validators: [
    //       Validators.required
    //     ],
    //   asyncValidators: [
    //     mimeType
    //   ]}
    //   )
    // });

    // this.testService.getImage()
  }

  //
  //
  //Image Upload Test Code
  //
  //

  // onSaveImg() {
  //   if (this.form.invalid) {
  //     return;
  //   }

  //   this.testService.postImage(this.form.value.image)

  //   this.form.reset()
  // }

  // onImagePicked(event: Event) {
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.form.patchValue({ image: file });
  //   this.form.get('image').updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = <string>reader.result;
  //   };
  //   reader.readAsDataURL(file);
  // }


  //
  //
  //SVG Reservation Test Code
  //
  //
  pointerDown(event) {
    if (event.target.classList.contains("draggable")) {
      const num = +event.target.getAttribute('index');
      const index = this.selected.indexOf(num);

      if (index === -1) {
        this.selected.push(num);
      } else {
        this.selected.splice(index, 1);
      }
      // console.log(index);

      // if (this.selected.includes(num)) {
      //   console.log("Target " + num + " is already selected!");
      //   //Remove index from selected
      //   this.remove(num);

      // } else {
      //   console.log("Target " + num + " is not selected!");
      //   //add index to selected
      //   this.selected.push(num);
      // }
    }
  }

  remove(num: number) {
    const index = this.selected.indexOf(num);
    console.log(index);
    if (index !== -1) {

      this.selected = this.selected.splice(index, 1);
    }
  }


  checkResults() {
    console.log(this.selected);
  }

  getColor(i: number) {
    // if (i % 2 == 0) {
    //   return '#cccccc';
    // } else {
    //   return '#737373';
    // }

    if (this.selected.includes(i)) {
      return "red";
    } else {
      return '#737373';
    }
  }
}
