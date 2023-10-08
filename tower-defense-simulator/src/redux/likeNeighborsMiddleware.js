import { ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD } from './actions';
import BoardManager from '../components/BoardManager';

export const likeNeighborsMiddleware = store => next => action => {
    const result = next(action); // let the action pass through

    if ([ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD].includes(action.type)) {
        const boardState = store.getState().present.board;

        // Create an instance of the BoardManager
        const boardManager = new BoardManager(boardState);

        // A method within BoardManager which returns like neighbors
        const likeNeighborsBoard = boardManager.getLikeNeighborsForAllTiles();

        // Dispatch the SET_LIKE_NEIGHBORS action to update the board state and also to signal to the next middleware.
        store.dispatch({
            type: "SET_LIKE_NEIGHBORS",
            payload: likeNeighborsBoard
        });
    }

    return result;
};
