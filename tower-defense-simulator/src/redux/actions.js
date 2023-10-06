// Action Types
export const ADD_UNIT = 'ADD_UNIT';
export const REMOVE_UNIT = 'REMOVE_UNIT';
export const UPDATE_UNIT = 'UPDATE_UNIT';
export const SET_BOARD = 'SET_BOARD';
// Feel free to add more action types as needed.

// Action Creators

/**
 * Adds a unit to the board.
 * @param {object} unit - The unit to add.
 * @param {number} x - The x-coordinate where the unit is placed.
 * @param {number} y - The y-coordinate where the unit is placed.
 */
export function addUnit(unit, x, y) {
    return {
        type: ADD_UNIT,
        payload: {
            unit,
            position: { x, y }
        }
    };
}

/**
 * Removes a unit from the board.
 * @param {number} x - The x-coordinate of the unit.
 * @param {number} y - The y-coordinate of the unit.
 */
export function removeUnit(x, y) {
    return {
        type: REMOVE_UNIT,
        payload: {
            position: { x, y }
        }
    };
}

/**
 * Updates a unit's details.
 * @param {object} unit - The updated unit details.
 * @param {number} x - The x-coordinate of the unit.
 * @param {number} y - The y-coordinate of the unit.
 */
export function updateUnit(unit, x, y) {
    return {
        type: UPDATE_UNIT,
        payload: {
            unit,
            position: { x, y }
        }
    };
}

/**
 * Sets the entire board state.
 * @param {array} board - The new board state.
 */
export function setBoard(board) {
    return {
        type: SET_BOARD,
        payload: {
            board
        }
    };
}

// You can add more action creators as needed, for instance, for handling game mechanics, saving/loading states, etc.
