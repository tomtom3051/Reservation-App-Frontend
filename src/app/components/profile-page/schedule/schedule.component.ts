import { Component, ElementRef, ViewChild } from '@angular/core';
import { test } from 'src/app/models/test.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  @ViewChild('svgGrid') svgGrid: ElementRef<SVGSVGElement>;

  offsetX = 0;
  offsetY = 0;

  public blocks: test[] = [
    new test(
      10,
      10,
      3,
      false
    ),
    new test(
      70,
      10,
      5,
      false
    ),
    new test(
      10,
      70,
      2,
      true
    ),
    new test(
      70,
      70,
      1,
      true
    )
  ];

  selectedElement;
  selectedIndex: number;



  pointerDown(event) {
    if (event.target.classList.contains("draggable")) {
      this.selectedElement = event.target;
      this.selectedIndex = event.target.getAttribute('data-index');

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

      this.blocks[this.selectedIndex].x = mousePositionX;
      this.blocks[this.selectedIndex].y = mousePositionY;
    }
    event.preventDefault();
  }

  pointerUp(event) {
    this.selectedElement = null;
    this.selectedIndex = null;
  }

  addBlock() {
    let newBlock = new test(130, 10, 3, false);
    this.blocks.push(newBlock);
    console.log(this.blocks);
  }
}

