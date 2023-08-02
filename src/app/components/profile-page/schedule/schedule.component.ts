import { Component } from '@angular/core';
import { test } from 'src/app/models/test.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
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

  addBlock() {
    let newBlock = new test(130, 10, 3, false);
    this.blocks.push(newBlock);
  }
}

