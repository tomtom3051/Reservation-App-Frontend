import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { FloorplanModel } from 'src/app/models/floorplan.model';
import { FloorplanService } from 'src/app/services/floorplan.service';

@Component({
  selector: 'app-svg-layout',
  templateUrl: './svg-layout.component.html',
  styleUrls: ['./svg-layout.component.css']
})
export class SvgLayoutComponent implements OnInit {
  //Store all floorplans for this business
  floorplans: FloorplanModel[] = [];
  //Sub to the observable of floorplans in the service
  floorplanSub: Subscription;

  //Default size of new floorplan is medium, if changed this value changes to the selected size
  selectedSize: string = 'medium';

  //The id of the business whos page you are looking at
  pageId: number;

  constructor(
    private route: ActivatedRoute,
    private floorplanService: FloorplanService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.pageId = +params['id'];

        this.floorplanService.getFloorplans(this.pageId);
        this.floorplanSub = this.floorplanService.getFloorplanUpdateListener()
          .subscribe({
            next: data => {
              this.floorplans = data.floorplans
            },
            error: error => {
              console.log("ERROR: " + error);
            }
          });
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
        newFloorplan = new FloorplanModel(null, this.pageId, 1000, 1000, form.value.label);
        break;
      case 'medium':
        newFloorplan = new FloorplanModel(null, this.pageId, 800, 800, form.value.label);
        break;
      case 'small':
        newFloorplan = new FloorplanModel(null, this.pageId, 500, 500, form.value.label);
        break;
    }
    this.floorplanService.addFloorplan(newFloorplan);
  }

  onTest() {
    console.log(this.floorplans);
  }
}
