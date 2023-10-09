// Redux Reducers 
import {
    ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD,
    UNDO_ACTION, REDO_ACTION,
    SET_LIKE_NEIGHBORS, UPDATE_BUFFS,
    ADD_GLOBAL_UNIT, REMOVE_GLOBAL_UNIT, UPDATE_GLOBAL_UNIT
} from './actions';

import { rehydrateUnit } from '../utils/unitUtilities';

const initialState = {
    past: [],
    present: {
        board: [...Array(3)].map(() => Array(5).fill(null)),
        globalUnits: []
    },
    future: []
};

function rootReducer(state = initialState, action) {
    let updatedGlobalUnits = [...state.present.globalUnits];
    let updatedBoard;

    switch (action.type) {
        case ADD_UNIT:
        case REMOVE_UNIT:
        case UPDATE_UNIT:
        case SET_BOARD:
            // General approach for these actions:
            // 1. Push current state to past.
            // 2. Update the present state based on action.
            // 3. Clear the future.

            // Get updated board first
            // 1. Declare updatedBoard and updatedGlobalUnits
            
            // console.log('state', state);
            if (action.type === ADD_UNIT) {
                const { unit, position } = action.payload;
                const unitInstance = rehydrateUnit(unit, position.x, position.y).class;
                const unitObject = unitInstance.toObject();
                const boardAfterAdd = [...state.present.board];
                const rowToUpdate = [...boardAfterAdd[position.x]];
                rowToUpdate[position.y] = unitObject;
                boardAfterAdd[position.x] = rowToUpdate;
                updatedBoard = boardAfterAdd;
            } else if (action.type === REMOVE_UNIT) {
                const boardAfterRemove = [...state.present.board];
                const rowToClear = [...boardAfterRemove[action.payload.position.x]];
                rowToClear[action.payload.position.y] = null;
                boardAfterRemove[action.payload.position.x] = rowToClear;
                updatedBoard = boardAfterRemove;
            } else if (action.type === UPDATE_UNIT) {
                const boardAfterUpdate = [...state.present.board];
                const rowToUpdateUnit = [...boardAfterUpdate[action.payload.position.x]];
                rowToUpdateUnit[action.payload.position.y] = action.payload.unit;
                boardAfterUpdate[action.payload.position.x] = rowToUpdateUnit;
                updatedBoard = boardAfterUpdate;
            } else if (action.type === SET_BOARD) {
                updatedBoard = action.payload.board;
            }

            // 2. Flatten the board and dedupe the names
            const uniqueNamesOnBoard = Array.from(
                new Set(updatedBoard.flat().filter(Boolean).map(unit => unit.name))
            );

            // 3. Extract names from the globalUnits for easier comparison
            const namesInGlobalUnits = updatedGlobalUnits.filter(Boolean).map(unit => unit.name);

            // console.log(`namesInGlobalUnits: ${namesInGlobalUnits} uniqueNamesOnBoard: ${uniqueNamesOnBoard}`);
            // 4. Check for units in the board that aren't in globalUnits
            for (const name of uniqueNamesOnBoard) {
                if (!namesInGlobalUnits.includes(name)) {
                    // console.log(`found a missing unit ${name}`, updatedBoard.flat());
                    // Get the full unit details from the board
                    const correspondingUnit = updatedBoard.flat().find(unit => unit && unit.name === name);
                    // console.log(correspondingUnit)
                    if (correspondingUnit) {
                        updatedGlobalUnits.push(correspondingUnit);
                    }
                }
            }

            return {
                past: [...state.past, state.present],
                present: { board: updatedBoard, globalUnits: updatedGlobalUnits },
                future: []
            };

        case SET_LIKE_NEIGHBORS:
            return {
                ...state,
                present: {
                    ...state.present,
                    board: action.payload
                }
            };
        // Inside the rootReducer function:
        case ADD_GLOBAL_UNIT:
            return {
                ...state,
                present: {
                    ...state.present,
                    globalUnits: [...state.present.globalUnits, action.payload]
                }
            };

        case UPDATE_GLOBAL_UNIT:
            const newGlobalUnits = [...state.present.globalUnits];
            newGlobalUnits[action.payload.index] = action.payload.unit;
            return {
                ...state,
                present: {
                    ...state.present,
                    globalUnits: newGlobalUnits
                }
            };

            case REMOVE_GLOBAL_UNIT:
                const unitToRemoveName = updatedGlobalUnits[action.payload].name;
            
                // Remove all instances of the unit from the board
                updatedBoard = state.present.board.map(row => 
                    row.map(unit => (unit && unit.name === unitToRemoveName) ? null : unit)
                );
            
                // Remove the unit from globalUnits
                updatedGlobalUnits.splice(action.payload, 1);
            
                return {
                    ...state,
                    present: {
                        board: updatedBoard,
                        globalUnits: updatedGlobalUnits
                    }
                };
            

        case UPDATE_BUFFS:
            return {
                past: [...state.past, state.present],
                present: {
                    board: action.payload,
                    globalUnits: state.present.globalUnits // Preserve the globalUnits
                },
                future: []
            };

        case UNDO_ACTION:
            if (state.past.length === 0) return state; // Can't undo
            const previous = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, state.past.length - 1);
            return {
                past: newPast,
                present: previous,
                future: [state.present, ...state.future]
            };

        case REDO_ACTION:
            if (state.future.length === 0) return state; // Can't redo
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            return {
                past: [...state.past, state.present],
                present: next,
                future: newFuture
            };

        default:
            return state;
    }
}

export default rootReducer;
