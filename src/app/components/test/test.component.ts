import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator'
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  form: FormGroup;
  imagePreview: string;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      image: new FormControl(
        null,
        {validators: [
          Validators.required
        ],
      asyncValidators: [
        mimeType
      ]}
      )
    });

    // this.testService.getImage()
  }

  onSaveImg() {
    if (this.form.invalid) {
      return;
    }

    this.testService.postImage(this.form.value.image)

    this.form.reset()
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    };
    reader.readAsDataURL(file);
  }
}
