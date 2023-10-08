import { ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD } from './actions';
import BoardManager from '../components/BoardManager';
import { DemonHunter } from '../components/UnitComponents/DemonHunter';

export const empowermentMiddleware = store => next => action => {
    const result = next(action); // let the action pass through

    if ([ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD].includes(action.type)) {
        const boardState = store.getState().present.board;

        // Create an instance of the BoardManager
        const boardManager = new BoardManager(boardState);

        // Check and set empowerment for units you care about
        boardManager.updateAllEmpowermentStatus([DemonHunter /*, AnotherUnit, YetAnotherUnit */]);

        // You can dispatch another action here to update the board if necessary.
        // This would require a new Redux action to handle the updated board state.
    }

    return result;
};
