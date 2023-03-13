import { Component } from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {

  ngOnInit() {
/*    const gesture = this.gestureCtrl.create({
      el: this.rectangle.nativeElement,
      threshold: 0,
      onStart: () => { this.onStart(); }
    });
  
    gesture.enable();*/
    this.resetBoard();
  }

  constructor(public gestureCtrl: GestureController) {
    console.log('tab2', this);
  }

  resetBoard() {
    this.gridRows = [
      Array(5).fill(0),
      Array(5).fill(0),
      Array(5).fill(0)
    ];
  }
  
  clickedTile(row: any, column: any, direction: any) {
    if (direction == 1){
      this.gridRows[row][column]++;
    } else {
      this.gridRows[row][column]--;
    }

    if (this.gridRows[row][column] > 10){
      this.gridRows[row][column] = 0;
    } else if (this.gridRows[row][column] < 0){
      this.gridRows[row][column] = 10;
    }
  }

  gridRows: any = [
  ];

}
