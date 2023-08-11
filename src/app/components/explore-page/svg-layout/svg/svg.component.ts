import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FloorplanModel } from 'src/app/models/floorplan.model';
import { ReservableModel } from 'src/app/models/reservable.model';
import { FloorplanService } from 'src/app/services/floorplan.service';
import { ReservableService } from 'src/app/services/reservable.service';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent implements OnInit, OnDestroy {
  //For info on how objects are moved in this component check out the following tutorial
  //https://www.youtube.com/watch?v=5WnXA_fcVNM

  //Used to get accurate x and y coordinates when moving reservable
  @ViewChild('svgGrid') svgGrid: ElementRef<SVGSVGElement>;

  //Gets floorplan data from svg-layout.component.html
  @Input() floorplan: FloorplanModel;

  public selectedSize: string = 'medium';

  //Stores all reservable objects in this floorplan
  public reservables: ReservableModel[] = [];
  //Subscription to get pre existing reservables
  public reservableSub: Subscription;


  //These variables are used to move reservables around the floorplan
  offsetX = 0;
  offsetY = 0;
  selectedElement;
  selectedIndex: number;


  //Constructor sets up services needed in this component
  constructor(
    private floorplanService: FloorplanService,
    private reservableService: ReservableService
  ) {}

  //init initializes the floorplan component with existing data if needed
  ngOnInit(): void {
    //If there is a floorplan.id then floorplan is saved to the backend
    //In this case there might be pre-existing reservables
    if (this.floorplan.id) {
      //This function gets all this businesses pre existing reservables from the backend
      this.reservableService.getReservables(this.floorplan.businessId);
      //This sub listens for updates to the reservable service
      this.reservableSub = this.reservableService.getReservablesUpdateListener()
        .subscribe({
          next: data => {
            // console.log(data.reservables);
            //This function adds the retrieved reservables to the local reservable array
            this.getReservables(data.reservables);
          },
          error: error => {
            console.log("ERROR: " + error);
          }
        });
    }
  }

  //Function adds reservables to the local reservable array
  getReservables(reservableArr: ReservableModel[]) {
    //Loops through each reservable
    for (let reservable of reservableArr) {
      //Performs 2 checks to ensure reservables are added correctly
      if (
        //1. it only adds reservables to local reservable array if it belongs to this floorplan
        //Otherwise all reservables are added to each floorplan
        (reservable.floorplanId === this.floorplan.id) &&
        //2. Ensures a reservable being added does not already exist in local reservable array
        //Mainly added cause init function executes for every floorplan
        //This caused reservables to be added multiple times, once for every floorplan initialization
        !(this.reservables.find(res => res.id === reservable.id))) {
          this.reservables.push(reservable);
      }
    }
  }

  //Activates when reservable is clicked
  pointerDown(event) {
    //Only objects with the draggable class can be moved
    if (event.target.classList.contains("draggable")) {
      //Store the rect being moved the index where its info is stored in reservables
      this.selectedElement = event.target;
      this.selectedIndex = event.target.getAttribute('index');

      let targetPositionX = this.selectedElement.getAttributeNS(null, 'x');
      let targetPositionY = this.selectedElement.getAttributeNS(null, 'y');

      let mousePositionX = event.clientX;
      let mousePositionY = event.clientY;

      let ctm = this.svgGrid.nativeElement.getScreenCTM();

      mousePositionX -= ctm.e;
      mousePositionY -= ctm.f;

      this.offsetX = mousePositionX - targetPositionX;
      this.offsetY = mousePositionY - targetPositionY;
    }
  }

  //What happens when clicked reservable is moved
  pointerMove(event) {
    if (this.selectedElement) {
      // console.log('poiterMove: ', event);

      let mousePositionX = event.clientX;
      let mousePositionY = event.clientY;

      // console.log('x: ', mousePositionX);
      // console.log('y: ', mousePositionY);



      let ctm = this.svgGrid.nativeElement.getScreenCTM();

      mousePositionX -= ctm.e;
      mousePositionY -= ctm.f;

      mousePositionX -= this.offsetX;
      mousePositionY -= this.offsetY;

      this.selectedElement.setAttributeNS(null, 'x', mousePositionX);
      this.selectedElement.setAttributeNS(null, 'y', mousePositionY);

      this.reservables[this.selectedIndex].x = mousePositionX;
      this.reservables[this.selectedIndex].y = mousePositionY;
      // console.log(this.reservables);
    }
    event.preventDefault();
  }

  //What happens when clicked reservable is released
  pointerUp(event) {
    this.selectedElement = null;
    this.selectedIndex = null;
  }

  //Submit function to add a new reservable
  onAddReservable(form: NgForm) {
    //If form is not valid stop
    if (form.invalid) {
      return;
    }

    if (this.reservables.find(res => res.label === form.value.label)) {
      return;
    }

    //Create a new reservable object
    let newReservable: ReservableModel;
    //Switch statement initializes object based on the selected size
    switch(this.selectedSize) {
      case 'large':
        newReservable = new ReservableModel(
          null,
          this.floorplan.id,
          this.floorplan.businessId,
          ((this.floorplan.width / 2) - (90 / 2)),
          ((this.floorplan.height / 2) - (70 / 2)),
          70,
          90,
          form.value.capacity,
          form.value.label
        );
        break;
      case 'medium':
        newReservable = new ReservableModel(
          null,
          this.floorplan.id,
          this.floorplan.businessId,
          ((this.floorplan.width / 2) - (70 / 2)),
          ((this.floorplan.height / 2) - (50 / 2)),
          50,
          70,
          form.value.capacity,
          form.value.label
        );
        break;
      case 'small':
        newReservable = new ReservableModel(
          null,
          this.floorplan.id,
          this.floorplan.businessId,
          ((this.floorplan.width / 2) - (50 / 2)),
          ((this.floorplan.height / 2) - (30 / 2)),
          30,
          50,
          form.value.capacity,
          form.value.label
        );
        break;
    }
    //Newly created reservable is added to the array
    this.reservables.push(newReservable);
  }

  //Function saves or updates floorplan and reservables
  onSaveFloorplan() {
    //If no floorplan.id, it is not yet saved to the backend
    if (!this.floorplan.id) {
      //Following function saves floorplan to the backend
      this.floorplanService.saveFloorplan(
        this.floorplan.businessId,
        this.floorplan.height,
        this.floorplan.width,
        this.floorplan.name
      ).subscribe({
        next: data => {
          //data contains the floorplans id as assigned by the backen
          //Set data.id as the floorplan.id
          this.floorplan.id = data.id;
          //Add the id to all reservables so they can be stored correctly
          this.reservables = this.addFloorplanIdToReservables(
            this.floorplan.id,
            this.reservables
          );
          //For each reservable save or update them to the backend
          for (let reservable of this.reservables) {
            this.saveOrUpdateReservables(reservable);
          }
        }
      });
    }
    //If floorplan has an id reservables already have a floorplan id assigned to them
    //No need to add it like before
    else {
      //For each reservable save or update it to the backend
      for (let reservable of this.reservables) {
        this.saveOrUpdateReservables(reservable);
      }
    }
  }

  //Deletes a floorplan
  onDeleteFloorplan() {
    //If floorplan has no id it is not saved to the backend
    //In this case it only needs to be deleted from the array in FloorplanService
    if (!this.floorplan.id) {
      this.floorplanService.deleteFromArrayByName(this.floorplan.name);
    }
    //If there is a floorplan id the floorplan is saved on the backend
    //Following function deletes the floorplan from the backend
    else {
      this.floorplanService.deleteFloorplan(this.floorplan.businessId, this.floorplan.id);
    }
  }

  //Function adds the floorplan id to each reservable in the array
  addFloorplanIdToReservables(floorplanId: number, reservables: ReservableModel[]) {
    reservables.forEach((reservable) => {
      reservable.floorplanId = floorplanId;
    });
    return reservables;
  }

  //Function determines whether a reservable needs to be saved to the backend or updated
  saveOrUpdateReservables(reservable: ReservableModel) {
    //If reservable has an id, it exists in the backend and a http patch request needs to be send
    if (reservable.id) {
      // This function sends the patch request
      this.reservableService.updateReservable(
        reservable.id,
        reservable.floorplanId,
        reservable.businessId,
        reservable.x,
        reservable.y,
        reservable.height,
        reservable.width,
        reservable.capacity,
        reservable.label
      );
    }
    //If reservable has no id, it is not in the backend and a http post request needs to be send
    else {
      // This function sends the post request
      this.reservableService.saveReservable(
        reservable.floorplanId,
        reservable.businessId,
        reservable.x,
        reservable.y,
        reservable.height,
        reservable.width,
        reservable.capacity,
        reservable.label
      ).subscribe({
        next: data => {
          this.addIdToSavedReservable(data.id, data.label);
        }
      });
    }
  }

  //Add backend ID to reservable
  addIdToSavedReservable(id: number, label: string) {
    let index = this.reservables.findIndex(res => res.label === label);
    this.reservables[index].id = id;
  }

  //On destroy unsub to all Subscription objects
  ngOnDestroy(): void {
    this.reservableSub.unsubscribe();
  }
}
