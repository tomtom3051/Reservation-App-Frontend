import { Component, Input } from '@angular/core';
import { BusinessModel } from 'src/app/models/business.model';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent {
  @Input() business: BusinessModel;

  constructor() {}
}
