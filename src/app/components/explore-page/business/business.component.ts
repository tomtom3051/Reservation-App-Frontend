import { Component, Input } from '@angular/core';
import { BusinessModel } from 'src/app/models/business.model';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent {
  @Input() business: BusinessModel;
}
