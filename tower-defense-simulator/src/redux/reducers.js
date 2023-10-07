// Redux Reducers 
import { ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD } from './actions';
import { rehydrateUnit } from '../utils/unitUtilities';

const initialState = {
    board: Array(5).fill(Array(3).fill(null))  // 5x3 board initialized with null
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_UNIT:
            const unitConfig = action.payload.unit;
            const unitInstance = rehydrateUnit(unitConfig);
            const unitObject = unitInstance.toObject();
            const boardAfterAdd = [...state.board];
            const rowToUpdate = [...boardAfterAdd[action.payload.position.x]];
            rowToUpdate[action.payload.position.y] = unitObject;
            boardAfterAdd[action.payload.position.x] = rowToUpdate;
            return { ...state, board: boardAfterAdd };
        

        case REMOVE_UNIT:
            const boardAfterRemove = [...state.board];
            const rowToClear = [...boardAfterRemove[action.payload.position.x]];
            rowToClear[action.payload.position.y] = null;
            boardAfterRemove[action.payload.position.x] = rowToClear;
            return { ...state, board: boardAfterRemove };

        case UPDATE_UNIT:
            const boardAfterUpdate = [...state.board];
            const rowToUpdateUnit = [...boardAfterUpdate[action.payload.position.x]];
            rowToUpdateUnit[action.payload.position.y] = action.payload.unit;
            boardAfterUpdate[action.payload.position.x] = rowToUpdateUnit;
            return { ...state, board: boardAfterUpdate };


        case SET_BOARD:
            return { ...state, board: action.payload.board };

        // Add other action handlers as necessary

        default:
            return state;
    }
}

export default rootReducer;
