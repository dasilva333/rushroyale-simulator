import { ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD } from './actions';
import BoardManager from '../components/BoardManager';
import { rehydrateUnit } from '../utils/unitUtilities';
import { updateBuffs } from './actions';

function calculateBuffs(boardState) {
    let hydratedBoard = boardState.map(row => 
        row.map(unitObj => {
            if (unitObj) {
                return rehydrateUnit(unitObj, unitObj.x, unitObj.y);
            }
            return null;
        })
    );
    const buffKeys = ["speed", "damage", "armor-damage", "crit-chance", "crit-damage"];

    for (let i = 0; i < hydratedBoard.length; i++) {
        for (let j = 0; j < hydratedBoard[i].length; j++) {
            const unit = hydratedBoard[i][j];
            if (unit) {
                const neighbors = BoardManager.getAdjacentUnitsForTile(hydratedBoard, i, j);
                unit.class.buffs = []; // Reset buffs
                for (const neighbor of neighbors) {
                    for (const buffType of buffKeys) {
                        const buffValue = neighbor.unitClass.getUnitBuffs(buffType, neighbor.class);
                        if (buffValue !== 0) {
                            unit.class.buffs.push({ type: buffType, value: buffValue });
                        }
                    }
                }
            }
        }
    }

    // Convert the hydrated board back to the format expected by the state
    return hydratedBoard.map(row => 
        row.map(unit => {
            if (unit) {
                return unit.class.toObject(); // Assuming there's a method that returns the plain object
            }
            return null;
        })
    );
}


export const buffCalculationMiddleware = store => next => action => {
    const result = next(action);
    if ([ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD].includes(action.type)) {
        const currentBoardState = store.getState().present.board;
        const newBoardState = calculateBuffs(currentBoardState);
        store.dispatch(updateBuffs(newBoardState));
    }
    return result;
};
