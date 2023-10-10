import {
    ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD,
    ADD_GLOBAL_UNIT, REMOVE_GLOBAL_UNIT, UPDATE_GLOBAL_UNIT
} from './actions';
import BoardManager from '../components/BoardManager';
import { rehydrateUnit } from '../utils/unitUtilities';
import { updateBuffs } from './actions';
import { Sword } from '../components/UnitComponents/Sword';

function calculateBuffs(boardState, globalUnits = []) {
    let hydratedBoard = boardState.map(row =>
        row.map(unitObj => {
            if (unitObj) {
                return rehydrateUnit(unitObj, unitObj.x, unitObj.y);
            }
            return null;
        })
    );
    const buffKeys = ["speed", "damage", "armor-damage", "crit-chance", "crit-damage"];

    // Step 1: Calculate the global buffs
    let globalBuffs = [];
    for (const globalUnit of globalUnits) {
        const hydratedGlobalUnit = rehydrateUnit(globalUnit, null, null);
        if (hydratedGlobalUnit && hydratedGlobalUnit.unitClass && hydratedGlobalUnit.unitClass.getGlobalBuffs) {
            for (const buffType of buffKeys) {
                const buffValue = hydratedGlobalUnit.unitClass.getGlobalBuffs(buffType, globalUnit);
                console.log(`buffType ${buffType} buffValue ${buffValue}`);
                if (buffValue !== 0) {
                    globalBuffs.push({ type: buffType, value: buffValue });
                }
            }
        }
    }

    // console.log('globalBuffs', globalBuffs);

    for (let i = 0; i < hydratedBoard.length; i++) {
        for (let j = 0; j < hydratedBoard[i].length; j++) {
            const unit = hydratedBoard[i][j];
            if (unit) {
                const neighbors = BoardManager.getAdjacentUnitsForTile(hydratedBoard, i, j);
                unit.class.buffs = [...globalBuffs]; // Initialize with global buffs using spread operator
                for (const neighbor of neighbors) {
                    for (const buffType of buffKeys) {
                        // console.log('neighbor', neighbor);
                        if (neighbor && neighbor.unitClass && neighbor.unitClass.getUnitBuffs) {
                            // const buffFunction = neighbor.unitClass.getUnitBuffs;
                            const buffValue = neighbor.unitClass.getUnitBuffs(buffType, neighbor.class);
                            if (buffValue !== 0) {
                                unit.class.buffs.push({ type: buffType, value: buffValue });
                            }
                        }
                    }
                }
            }
        }
    }

    const swordIndex = globalUnits.findIndex(unit => unit.name === "Sword");
    console.log('calculateBuffs swordIndex', swordIndex);
    if (swordIndex !== -1) {
        const swordLevel = globalUnits[swordIndex].level;
        const hasKnightStatue = globalUnits.findIndex(unit => unit.name === "Knight_Statue") !== -1;
        console.log('calculateBuffs swordLevel', swordLevel);
        for (let i = 0; i < hydratedBoard.length; i++) {
            for (let j = 0; j < hydratedBoard[i].length; j++) {
                const unit = hydratedBoard[i][j]
                console.log('unit', unit);
                if (unit && unit.class && unit.class.swordStacks) {
                    console.log('unit.swordStacks', unit.class.swordStacks);
                    const swordBuffs = Sword.getSwordBuffs(swordLevel, unit.class.swordStacks, hasKnightStatue);
                    unit.class.buffs = [...unit.class.buffs, ...swordBuffs];
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
    if ([ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD, ADD_GLOBAL_UNIT, REMOVE_GLOBAL_UNIT, UPDATE_GLOBAL_UNIT].includes(action.type)) {
        const currentBoardState = store.getState().present.board;
        const globalUnits = store.getState().present.globalUnits;
        const newBoardState = calculateBuffs(currentBoardState, globalUnits);
        // console.log(newBoardState);
        store.dispatch(updateBuffs(newBoardState));
    }
    return result;
};
