import { SET_LIKE_NEIGHBORS } from './actions';
import BoardManager from '../components/BoardManager';
import { DemonHunter } from '../components/UnitComponents/DemonHunter';
import { Cultist } from '../components/UnitComponents/Cultist';
import { BladeDancer } from '../components/UnitComponents/BladeDancer';

export const empowermentMiddleware = store => next => action => {
    const result = next(action); // let the action pass through

    // Only react to SET_LIKE_NEIGHBORS action now, as it ensures the board state has updated like neighbor counts.
    if (action.type === SET_LIKE_NEIGHBORS) {
        const boardState = store.getState().present.board;

        // Create an instance of the BoardManager
        const boardManager = new BoardManager(boardState);

        // Check and set empowerment for units you care about
        boardManager.updateAllEmpowermentStatus([DemonHunter, Cultist, BladeDancer]);
    }

    return result;
};
