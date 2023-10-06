// Redux Reducers 
import { ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD } from './actions';

const initialState = {
    board: Array(5).fill(Array(3).fill(null))  // 5x3 board initialized with null
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_UNIT:
            const boardAfterAdd = [...state.board];
            boardAfterAdd[action.payload.position.x][action.payload.position.y] = action.payload.unit;
            return { ...state, board: boardAfterAdd };

        case REMOVE_UNIT:
            const boardAfterRemove = [...state.board];
            boardAfterRemove[action.payload.position.x][action.payload.position.y] = null;
            return { ...state, board: boardAfterRemove };

        case UPDATE_UNIT:
            const boardAfterUpdate = [...state.board];
            boardAfterUpdate[action.payload.position.x][action.payload.position.y] = action.payload.unit;
            return { ...state, board: boardAfterUpdate };

        case SET_BOARD:
            return { ...state, board: action.payload.board };

        // Add other action handlers as necessary

        default:
            return state;
    }
}

export default rootReducer;
