// Redux Reducers 
import { ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD, UNDO_ACTION, REDO_ACTION, SET_LIKE_NEIGHBORS, UPDATE_BUFFS } from './actions';
import { rehydrateUnit } from '../utils/unitUtilities';

const initialState = {
    past: [],
    present: {
        board: [...Array(3)].map(() => Array(5).fill(null))
    },
    future: []
};

function rootReducer(state = initialState, action) {
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
            let updatedBoard;
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

            return {
                past: [...state.past, state.present],
                present: { board: updatedBoard },
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

        case UPDATE_BUFFS:
            return {
                past: [...state.past, state.present],
                present: { board: action.payload },
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
