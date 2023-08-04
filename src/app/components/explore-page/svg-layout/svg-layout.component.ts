import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { FloorplanModel } from 'src/app/models/floorplan.model';

@Component({
  selector: 'app-svg-layout',
  templateUrl: './svg-layout.component.html',
  styleUrls: ['./svg-layout.component.css']
})
export class SvgLayoutComponent implements OnInit {
  floorplans: FloorplanModel[] = [
    new FloorplanModel(2, 500, 500, 'floorplan'),
    new FloorplanModel(2, 800, 800, 'floorplan 2'),
    new FloorplanModel(2, 1000, 1000, 'floorplan 3')
  ];

  selectedSize: string = 'medium';

  pageId: number;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.pageId = +params['id'];
        console.log(this.pageId);
      }
    );
  }

  onAddFloorplan(form: NgForm) {
    if (form.invalid) {
      return;
    }
    let newFloorplan: FloorplanModel;
    switch(this.selectedSize) {
      case 'large':
        newFloorplan = new FloorplanModel(this.pageId, 1000, 1000, form.value.label);
        break;
      case 'medium':
        newFloorplan = new FloorplanModel(this.pageId, 800, 800, form.value.label);
        break;
      case 'small':
        newFloorplan = new FloorplanModel(this.pageId, 500, 500, form.value.label);
        break;
    }

    this.floorplans.push(newFloorplan);
  }
}
