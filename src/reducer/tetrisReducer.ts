import { emptyGrid, extraRows, spawnPosition } from "../constants";
import type { GameState, GameAction } from "../types";
import {
    checkCollision,
    getRandomTetromino,
    getMergedGrid,
    getRotatedTetronimo,
} from "../utils/utils";

/**
 * Reducer function to manage game state.
 * @param state - The current game state.
 * @param action - The action to perform.
 * @returns The new game state.
 */
const tetrisReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case "START_GAME":
            return {
                ...state,
                grid: emptyGrid,
                isGameOver: false,
            };
        case "SPAWN_PIECE": {
            if (state.isGameOver) return state;

            const newPiece = getRandomTetromino();

            return {
                ...state,
                currentPiece: newPiece,
                position: {
                    ...spawnPosition,
                    y: spawnPosition.y + extraRows - newPiece.shape.length,
                },
            };
        }
        case "ROTATE_PIECE": {
            if (state.isGameOver || !state.currentPiece) return state;
            const rotatedPiece = getRotatedTetronimo(state.currentPiece);

            if (checkCollision(state.grid, rotatedPiece, state.position)) {
                return state;
            }
            
            return {...state, currentPiece: rotatedPiece}
        }
        case "MOVE_PIECE": {
            if (state.isGameOver || !state.currentPiece) return state;

            let { x, y } = state.position;

            // Update position based on direction
            switch (action.direction) {
                case "LEFT":
                    x = x - 1;
                    break;
                case "RIGHT":
                    x = x + 1;
                    break;
                case "DOWN":
                    y = y + 1;
                    break;
            }

            // Check for collisions
            if (checkCollision(state.grid, state.currentPiece, { x, y })) {
                // If there is a collision when moving down, lock the piece
                if (action.direction === "DOWN") {
                    // If the piece locks above the visible grid: game over
                    if (y < extraRows) {
                        return { ...state, isGameOver: true };
                    }

                    const lockedGrid = getMergedGrid(
                        state.grid,
                        state.currentPiece,
                        state.position
                    );

                    return {
                        ...state,
                        grid: lockedGrid,
                        currentPiece: null,
                        position: spawnPosition,
                    };
                }

                // Ignore invalid moves
                return state;
            }

            // Submit valid move that doesn't cause collision
            return { ...state, position: { x, y } };
        }
        case "CLEAR_LINES": {
            if (state.isGameOver) return state;

            // Remove filled lines and add empty lines at the top
            const newGrid = state.grid.filter((row) =>
                row.some((cell) => !cell.filled)
            );
            const linesCleared = state.grid.length - newGrid.length;
            const updatedGrid = [
                ...Array.from({ length: linesCleared }, () => emptyGrid[0]),
                ...newGrid,
            ];

            return { ...state, grid: updatedGrid };
        }
        default:
            return state;
    }
};

export default tetrisReducer;
