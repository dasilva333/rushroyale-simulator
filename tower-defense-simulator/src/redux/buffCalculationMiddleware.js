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

    for (let i = 0; i < hydratedBoard.length; i++) {
        for (let j = 0; j < hydratedBoard[i].length; j++) {
            const unit = hydratedBoard[i][j];
            if (unit) {
                const neighbors = BoardManager.getAdjacentUnitsForTile(hydratedBoard, i, j);
                unit.class.buffs = []; // Reset buffs
                for (const neighbor of neighbors) {
                    if (neighbor.class.name === "Banner") {
                        unit.class.buffs.push({ type: "speed", value: neighbor.unitClass.getSpeedBuff(neighbor.class) });
                    }
                    // Handle other buff types here...
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
