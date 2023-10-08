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
}
export default BoardManager;