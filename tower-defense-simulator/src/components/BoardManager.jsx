class BoardManager {
  constructor(boardState) {
    this.boardState = boardState;
  }

  getUnitsByName(unitName) {
    const flattenedBoard = this.boardState.flatMap(row => row);
    return flattenedBoard.filter(unit => unit && unit.name === unitName);
  }

  getUnitCounts(unitName) {
    return this.getUnitsByName(unitName).length;
  }

  getTotalTiersForUnit(unitName) {
    const units = this.getUnitsByName(unitName);
    return units.reduce((total, unit) => total + unit.tier, 0);
  }

  checkAndSetEmpowermentForUnit(unitClass, boardStateToProcess) {
    return boardStateToProcess.map((row, rowIndex) => {
      return row.map((unit, colIndex) => {
        if (unit && unit.name === unitClass.name) {
          const isEmpowered = unitClass.getEmpowermentCondition(this, unit);
          return { ...unit, empowered: isEmpowered };
        }
        return unit;
      });
    });
  }

  updateAllEmpowermentStatus(unitClasses) {
    let currentBoardState = this.boardState;
    unitClasses.forEach(unitClass => {
      currentBoardState = this.checkAndSetEmpowermentForUnit(unitClass, currentBoardState);
    });
    return currentBoardState;
  }

  getLikeNeighborsForAllTiles() {
    const boardWithLikeNeighbors = this.boardState.map((row, x) => {
      return row.map((tile, y) => {
        if (tile) {
          const adjacentUnits = this.getAdjacentUnitsForTile(x, y);
          const likeNeighborsCount = adjacentUnits.filter(unit => unit.name === tile.name).length;
          return { ...tile, neighbors: likeNeighborsCount };
        }
        return null;
      });
    });
    return boardWithLikeNeighbors;
  }

  static getAdjacentUnitsForTile(boardState, x, y) {
    // Logic to retrieve and return adjacent units for the given tile (x,y) 
    // from this.boardState.
    // This assumes a 2D grid system for the board.

    const adjacentCoords = [
      { dx: -1, dy: 0 }, // Left
      { dx: 1, dy: 0 },  // Right
      { dx: 0, dy: -1 }, // Up
      { dx: 0, dy: 1 }   // Down
    ];

    const adjacentUnits = [];

    for (const coord of adjacentCoords) {
      const newX = x + coord.dx;
      const newY = y + coord.dy;

      // Check for out-of-bound conditions
      if (newX >= 0 && newX < boardState.length &&
        newY >= 0 && newY < boardState[newX].length) {
        const unit = boardState[newX][newY];
        if (unit) {
          // console.log('unit', unit);
          adjacentUnits.push({ ...unit, x: newX, y: newY }); // added x and y to the object
        }
      }
    }

    return adjacentUnits;
  }

  getAdjacentUnitsForTile(x, y) {
    return BoardManager.getAdjacentUnitsForTile(this.boardState, x, y);
  }
  // This function will return a 2D array where each Unit's position 
  // corresponds to its rowColumnRelationship value (0, 1, or 2).
  getUnitRowColumnRelationship(unitName) {
    let rc = this.boardState.length;
    let cc = this.boardState[0].length;

    let rowMemo = new Array(rc);
    let colMemo = new Array(cc);

    rowMemo.fill(true);
    colMemo.fill(true);

    for (let r = 0; r < rc; r++) {
      for (let c = 0; c < cc; c++) {
        // Note: Using this.boardState[r][c].name to check against the unitName
        if (!this.boardState[r][c] || this.boardState[r][c].name !== unitName) {
          rowMemo[r] = false;
          colMemo[c] = false;
        }
      }
    }

    let empowermentGrid = new Array(rc).fill(0).map(_ => new Array(cc).fill(3)); // Default to "nothing"

    for (let r = 0; r < rc; r++) {
      for (let c = 0; c < cc; c++) {
        if (rowMemo[r] && colMemo[c]) {
          empowermentGrid[r][c] = 0; // Harmony
        } else if (rowMemo[r]) {
          empowermentGrid[r][c] = 1; // Horizontal
        } else if (colMemo[c]) {
          empowermentGrid[r][c] = 2; // Vertical
        } else {
          empowermentGrid[r][c] = 3; // Nothing
        }
      }
    }

    return empowermentGrid;
  }

  // Returns a 2D array representing the number of connected nodes for each unit on the board.
  countConnectedNodes(value) {
    const counts = [];
    for (let i = 0; i < this.boardState.length; i++) {
      counts[i] = [];
      for (let j = 0; j < this.boardState[i].length; j++) {
        if (this.boardState[i][j] && this.boardState[i][j].name === value) {
          counts[i][j] = this.countAdjacent(i, j, value);
          this.clearVisited();
        } else {
          counts[i][j] = 0;
        }
      }
    }
    return counts;
  }

  clearVisited() {
    for (let i = 0; i < this.boardState.length; i++) {
      for (let j = 0; j < this.boardState[i].length; j++) {
        if (this.boardState[i][j]) {
          this.boardState[i][j].visited = false;
        }
      }
    }
  }

  countAdjacent(i, j, value) {
    let count = 0;

    // Define a queue for BFS
    let queue = [];

    // Push the initial coordinates to the queue
    queue.push({ x: i, y: j });

    // Loop until the queue is empty
    while (queue.length > 0) {
      const current = queue.shift();
      const x = current.x;
      const y = current.y;

      if (this.boardState[x][y] && !this.boardState[x][y].visited && this.boardState[x][y].name === value) {
        this.boardState[x][y].visited = true;
        count++;

        // Get neighbors
        const neighbors = this.getAdjacentUnitsForTile(x, y);

        // Loop through neighbors and add them to the queue if they match the conditions
        for (let neighbor of neighbors) {
          if (neighbor && !neighbor.visited && neighbor.name === value) {
            queue.push(neighbor);
          }
        }
      }
    }

    return count;
  }

}
export default BoardManager;