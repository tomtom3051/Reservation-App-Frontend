import { Component } from '@angular/core';

@Component({
  selector: 'app-business-menu-page',
  templateUrl: './business-menu-page.component.html',
  styleUrls: ['./business-menu-page.component.css']
})
export class BusinessMenuPageComponent {
  menuItems = [
    {
      name: 'Item 1',
      image: 'https://via.placeholder.com/150',
      description: 'Description for Item 1',
      price: 25,
      currency: 'EUR'
    },
    {
      name: 'Item 2',
      image: 'https://via.placeholder.com/150',
      description: 'Description for Item 2',
      price: 30,
      currency: 'USD'
    },
    {
      name: 'Item 3',
      image: 'https://via.placeholder.com/150',
      description: 'Description for Item 3',
      price: 55,
      currency: 'EUR'
    }
  ];
}
