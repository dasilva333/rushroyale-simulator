import { SET_LIKE_NEIGHBORS, SET_BOARD, UPDATE_BOARD } from './actions';
import BoardManager from '../components/BoardManager';
import { DemonHunter } from '../components/UnitComponents/DemonHunter';
import { Cultist } from '../components/UnitComponents/Cultist';
import { BladeDancer } from '../components/UnitComponents/BladeDancer';
import { Inquisitor } from '../components/UnitComponents/Inquisitor';
import { Pyrotechnic } from '../components/UnitComponents/Pyrotechnic';

export const empowermentMiddleware = store => next => action => {
    const result = next(action); // let the action pass through

    // Only react to SET_LIKE_NEIGHBORS action now, as it ensures the board state has updated like neighbor counts.
    if (action.type === SET_LIKE_NEIGHBORS) {
        const boardState = store.getState().present.board;

        // Create an instance of the BoardManager
        const boardManager = new BoardManager(boardState);

        // Check and set empowerment for units you care about
        const newBoardState = boardManager.updateAllEmpowermentStatus([DemonHunter, Cultist, BladeDancer, Inquisitor, Pyrotechnic]);

        store.dispatch({ type: UPDATE_BOARD, payload: { board: newBoardState } });

    }

    return result;
};
