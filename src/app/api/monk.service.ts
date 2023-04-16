import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonkService {

  constructor() {
  }

  public getIntersectionsOptimized2(gridRows: any[][], filter: string): any {
    
    
    const rows = gridRows.length;
    const cols = gridRows[0].length;
  
    const rowCounts = new Array<boolean>(rows).fill(true);
    const colCounts = new Array<boolean>(cols).fill(true);
  
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (gridRows[r][c].id !== filter) {
          rowCounts[r] = false;
          colCounts[c] = false;
        }
      }
    }
  
    const result: boolean[][] = new Array<boolean[]>(rows);
    for (let r = 0; r < rows; r++) {
      result[r] = new Array<boolean>(cols);
      for (let c = 0; c < cols; c++) {
        result[r][c] = rowCounts[r] && colCounts[c];
      }
    }
  
    return result;
    
  }
  
}
