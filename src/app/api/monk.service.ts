import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonkService {

  constructor() {
  }

  public getIntersectionsOptimized2(gridRows: any[][], filter: string): any {
    let rc = gridRows.length;
    let cc = gridRows[0].length;

    let rowMemo = new Array(rc);
    let colMemo = new Array(cc);

    rowMemo.fill(true);
    colMemo.fill(true);

    for (let r = 0; r < rc; r++) {
            for (let c = 0; c < cc; c++) {
                    if (gridRows[r][c].id !== filter) {
                            rowMemo[r] = false;
                            colMemo[c] = false;
                    }   
            }   
    }   

    let og = new Array(rc).fill(0).map(_ => new Array(cc).fill(0));

    for (let r = 0; r < rc; r++) {
            for (let c = 0; c < cc; c++) {
                    og[r][c] = [(rowMemo[r] === true && colMemo[c] === true), rowMemo[r] === true, colMemo[c] === true];
            }   
    }   

    return og;  
  }
}
