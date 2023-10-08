import { ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD } from './actions';
import BoardManager from '../components/BoardManager';
import { Engineer } from '../components/UnitComponents/Engineer'; // Import Engineer
import { Monk } from '../components/UnitComponents/Monk'; // Import Monk

export const likeNeighborsMiddleware = store => next => action => {
    const result = next(action); // let the action pass through

    if ([ADD_UNIT, REMOVE_UNIT, UPDATE_UNIT, SET_BOARD].includes(action.type)) {
        const boardState = store.getState().present.board;

        // Create an instance of the BoardManager
        const boardManager = new BoardManager(boardState);

        // A method within BoardManager which returns like neighbors
        const likeNeighborsBoard = boardManager.getLikeNeighborsForAllTiles();

        const flatBoardNames = boardState.flat().flatMap(item => item && item.name ? item.name : []);

        // If there's an Engineer on the board, calculate connections
        if (flatBoardNames.includes(Engineer.name)) {
            const engineerConnections = boardManager.countConnectedNodes(Engineer.name);

            for (let i = 0; i < likeNeighborsBoard.length; i++) {
                for (let j = 0; j < likeNeighborsBoard[i].length; j++) {
                    if (likeNeighborsBoard[i][j] && likeNeighborsBoard[i][j].name === Engineer.name) {
                        likeNeighborsBoard[i][j].connections = engineerConnections[i][j];
                    }
                }
            }
        }

        // If there's a Monk on the board, calculate empowerment
        if (flatBoardNames.includes(Monk.name)) {
            const monkRowColumnRelationship = boardManager.getUnitRowColumnRelationship('Monk');
            // console.log(`monkRowColumnRelationship`, monkRowColumnRelationship);
            for (let i = 0; i < likeNeighborsBoard.length; i++) {
                for (let j = 0; j < likeNeighborsBoard[i].length; j++) {
                    if (likeNeighborsBoard[i][j] && likeNeighborsBoard[i][j].name === 'Monk') {
                        likeNeighborsBoard[i][j].neighbors = monkRowColumnRelationship[i][j];
                    }
                }
            }
        }

        // Dispatch the SET_LIKE_NEIGHBORS action to update the board state.
        store.dispatch({
            type: "SET_LIKE_NEIGHBORS",
            payload: likeNeighborsBoard
        });
    }

    return result;
};
