import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FloorplanModel } from 'src/app/models/floorplan.model';
import { ReservableModel } from 'src/app/models/reservable.model';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent {
  @ViewChild('svgGrid') svgGrid: ElementRef<SVGSVGElement>;
  @Input() floorplan: FloorplanModel;

  // public floorplan = new FloorplanModel(
  //   1,
  //   800,
  //   800,
  //   'Floorplan'
  // );

  public reservables: ReservableModel[] = [
    new ReservableModel(10, 10, 50, 70, 5, 'free'),
    new ReservableModel(110, 110, 100, 120, 3, 'booked'),
    new ReservableModel(210, 210, 150, 170, 1, 'selected')
  ];



  offsetX = 0;
  offsetY = 0;
  selectedElement;
  selectedIndex: number;



  pointerDown(event) {
    if (event.target.classList.contains("draggable")) {
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

  pointerUp(event) {
    this.selectedElement = null;
    this.selectedIndex = null;
  }

  determineColor(status: string): string {
    switch(status) {
      case 'free':
        return 'green';
      case 'booked':
        return 'red'
      case 'selected':
        return 'blue';
      default:
        return 'green';
    }
  }
}
