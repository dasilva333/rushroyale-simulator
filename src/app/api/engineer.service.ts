import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EngineerService {

  constructor() { }

  countConnectedNodes(graph: any, value: any) {
    const counts: any = [];
  
    for (let i = 0; i < graph.length; i++) {
      counts[i] = [];
      for (let j = 0; j < graph[i].length; j++) {
        if (graph[i][j].id === value) {
          counts[i][j] = this.countAdjacent(i, j, graph, value);
          this.clearVisited(graph);
        } else {
          counts[i][j] = '-';
        }
      }
    }
    return counts;
  }
  
  clearVisited(graph: any) {
    for (let i = 0; i < graph.length; i++) {
      for (let j = 0; j < graph[i].length; j++) {
        graph[i][j].visited = false;
      }
    }
  }
  
  countAdjacent(i: any, j: any, graph: any, value: any) {
    let count = 0;
    graph[i][j].visited = true;
    // check top neighbor
    if (i > 0 && graph[i-1][j].visited == false && graph[i-1][j].id === value) {
      count++;
      count += this.countAdjacent(i-1, j, graph, value);
    }
    // check bottom neighbor
    if (i < graph.length-1 && graph[i+1][j].visited == false && graph[i+1][j].id === value) {
      count++;
      count += this.countAdjacent(i+1, j, graph, value);
    }
    // check left neighbor
    if (j > 0 && graph[i][j-1].visited == false && graph[i][j-1].id === value) {
      count++;
      count += this.countAdjacent(i, j-1, graph, value);
    }
    // check right neighbor
    if (j < graph[i].length-1 && graph[i][j+1].visited == false && graph[i][j+1].id === value) {
      count++;
      count += this.countAdjacent(i, j+1, graph, value);
    }
    return count;
  }
  /*
  const graph = [
    [{v:'A', visited:false}, {v:'A', visited:false}, {v:'A', visited:false}, {v:'B', visited:false}, {v:'A', visited:false}],
    [{v:'A', visited:false}, {v:'A', visited:false}, {v:'A', visited:false}, {v:'B', visited:false}, {v:'A', visited:false}],
    [{v:'C', visited:false}, {v:'A', visited:false}, {v:'A', visited:false}, {v:'B', visited:false}, {v:'A', visited:false}],
  ];
  
  const counts = countConnectedNodes(graph, 'A');
  console.log(counts);*/
}
