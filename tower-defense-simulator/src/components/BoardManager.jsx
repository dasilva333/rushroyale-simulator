class BoardManager {
    constructor(boardState) {
        this.boardState = boardState;
    }

    getTotalTiersForUnit(unitName) {
        const flattenedBoard = this.boardState.flatMap(row => row);
        console.log('flattenedBoard', flattenedBoard);
        const units = flattenedBoard.filter(unit => unit && unit.name === unitName);
        const totalTiers = units.reduce((total, unit) => total + unit.tier, 0);
        console.log(`${unitName} totalTiers: ${totalTiers}`);
        return totalTiers;
    }    

    checkAndSetEmpowermentForUnit(unitClass) {
        if (unitClass.getEmpowermentCondition(this)) {
            this.boardState.forEach(row => {
                row.forEach((unit, idx) => {
                    if (unit && unit.name === unitClass.name) {
                        row[idx].empowered = true;
                        console.log('setting empowered for', unit.name, idx);
                    }
                });
            });
        }
    }    

    updateAllEmpowermentStatus(unitClasses) {
        unitClasses.forEach(unitClass => {
            this.checkAndSetEmpowermentForUnit(unitClass);
        });
    }
}
export default BoardManager;