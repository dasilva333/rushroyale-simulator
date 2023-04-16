function getIntersections(graph) {
    const rows = graph.length;
    const cols = graph[0].length;
  
    const intersections = [];
    for (let i = 0; i < rows; i++) {
      intersections.push(new Array(cols).fill(false));
    }
  
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (graph[i][j] === "M") {
          let hasHorizontalNeighbors = true;
          let hasVerticalNeighbors = true;
  
          // Check for horizontal neighbors
          for (let k = 0; k < cols; k++) {
            if (k !== j && graph[i][k] !== "M") {
              hasHorizontalNeighbors = false;
              break;
            }
          }
  
          // Check for vertical neighbors
          for (let k = 0; k < rows; k++) {
            if (k !== i && graph[k][j] !== "M") {
              hasVerticalNeighbors = false;
              break;
            }
          }
  
          // Mark the intersection if it exists
          if (hasHorizontalNeighbors && hasVerticalNeighbors) {
            intersections[i][j] = true;
          }
        }
      }
    }
  
    return intersections;
  }
  

I want you to adjust the create a function in Javascript so that when provided the following graphs I receive that expected output. 
The general idea is to find nodes with the letter M, and then check to see if that node has other neighbors spanning vertically AND horizontally upto the edge
Both conditions must be satisfied for the output to return true for that node
The nodes that are part of the intersection should return true and other nodes that are not in an intersection should return false
Please don't provide me the code to review, instead I want you to run the 3 provided examples and show me the output for your code

The function should take in a 2D array representing the graph, and return another 2D array with the same dimensions, 
where each element is a boolean value indicating whether the corresponding node is part of an intersection or not.

The function will loop through each node of the graph and check if the node contains the letter 'M'. 
If it does, then it will check if the node has neighboring nodes with the letter 'M' horizontally and vertically, up to the edge of the graph. 
If both conditions are satisfied, then the node is part of an intersection and the corresponding element in the output array will be set to true. 
If either condition is not satisfied, then the node is not part of an intersection and the corresponding element in the output array will be set to false.

provided graph:
['M', 'D', 'D', 'D', 'D'],
['M', 'D', 'D', 'M', 'D'],
['M', 'M', 'M', 'M', 'M']

expected output:
[false, false, false, false, false],
[false, false, false, false, false],
[true, false, false, false, false]

provided graph:
['M', 'M', 'M', 'M', 'M'],
['M', 'D', 'D', 'M', 'D'],
['M', 'M', 'M', 'M', 'M']

expected output:
[true, false, false, true, false],
[false, false, false, false, false],
[true, false, false, true, false]

provided graph:
['D', 'D', 'M', 'D', 'D'],
['D', 'M', 'M', 'M', 'D'],
['M', 'M', 'M', 'M', 'M']

expected output:
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, true, false, false]

provided graph:
['M', 'M', 'M', 'M', 'M'],
['M', 'M', 'M', 'M', 'M'],
['M', 'M', 'M', 'M', 'M']

expected output:
[true, true, true, true, true],
[true, true, true, true, true],
[true, true, true, true, true]

provided graph:
['M', 'M', 'D', 'D', 'D'],
['M', 'M', 'M', 'M', 'M'],
['M', 'M', 'M', 'M', 'M']

expected output:
[true, true, false, false, false],
[true, true, false, false, false],
[true, true, false, false, false]

function getIntersectionsOptimized2(graph) {
    const rowCount = graph.length;
    const colCount = graph[0].length;
    const intersectionRows = {};
    const intersectionCols = {};
    const intersections = [];
    
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        if (graph[row][col] === 'M') {
          if (intersectionRows[row] === undefined) {
            intersectionRows[row] = 1;
          } else {
            intersectionRows[row]++;
          }
          
          if (intersectionCols[col] === undefined) {
            intersectionCols[col] = 1;
          } else {
            intersectionCols[col]++;
          }
        }
      }
    }
    
    for (let row = 0; row < rowCount; row++) {
      intersections[row] = [];
      
      for (let col = 0; col < colCount; col++) {
        if (graph[row][col] === 'M' && intersectionRows[row] > 1 && intersectionCols[col] > 1) {
          intersections[row][col] = true;
        } else {
          intersections[row][col] = false;
        }
      }
    }
    
    return intersections;
  }
  

  I want to refactor getIntersectionsOptimized3 here are the requirements for how it should work now:

  - the return value should be a nested array in a similar format to what it is now except the boolean will become another array with 3 booleans
  - in other words the return value will change from boolean[][] to [][][]
  - the first element in the array will correspond to the existing functionality indicating an intersection
  - the second element in the array will correspond to a node that has the horizontal row it's in completely filled with 'M's
  - the third element in the array will correspond to a node that has the vertical column completely filled with 'M's

  If a horizontal line is filled with Monks, each Monk in that line will be able to inflict higher damage, 
  and if a vertical line is filled with Monks,
   each Monk in the line will have higher attack speed. Monks positioned at the intersection of both lines will attain harmony,
