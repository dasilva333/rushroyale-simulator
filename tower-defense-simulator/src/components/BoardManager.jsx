class BoardManager {
    constructor(boardState) {
        this.boardState = boardState;
    }

    getTotalTiersForUnit(unitName) {
        const flattenedBoard = this.boardState.flatMap(row => row);
        const units = flattenedBoard.filter(unit => unit && unit.name === unitName);
        const totalTiers = units.reduce((total, unit) => total + unit.tier, 0);
        return totalTiers;
    }

    checkAndSetEmpowermentForUnit(unitClass) {
        this.boardState.forEach((row, rowIndex) => {
            row.forEach((unit, colIndex) => {
                if (unit && unit.name === unitClass.name) {
                    const isEmpowered = unitClass.getEmpowermentCondition(this, unit);
                    unit.empowered = isEmpowered;
                }
            });
        });
    }    

    updateAllEmpowermentStatus(unitClasses) {
        unitClasses.forEach(unitClass => {
            this.checkAndSetEmpowermentForUnit(unitClass);
        });
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

    getAdjacentUnitsForTile(x, y) {
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
            if (newX >= 0 && newX < this.boardState.length &&
                newY >= 0 && newY < this.boardState[0].length) {
                const unit = this.boardState[newX][newY];
                if (unit) {
                    adjacentUnits.push(unit);
                }
            }
        }

        return adjacentUnits;
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
    if (!this.boardState[i][j].visited && this.boardState[i][j].name === value) {
      this.boardState[i][j].visited = true;
      count++;
      
      const neighbors = this.getAdjacentUnitsForTile(i, j);
      for (let neighbor of neighbors) {
        if (neighbor.name === value && !neighbor.visited) {
          count += this.countAdjacent(neighbor.x, neighbor.y, value);
        }
      }
    }
    return count;
  }
}
export default BoardManager;