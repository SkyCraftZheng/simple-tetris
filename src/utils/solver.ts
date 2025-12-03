import { bumpinessWeight, extraRows, gridHeight, gridWidth, holesWeight, pileHeightWeight } from "../constants";
import tetrisReducer from "../reducer/tetrisReducer";
import type { evaluatedState, GameState } from "../types";

export const getNextBestState = (
    state: GameState,
) => {
    const possibleStates = getPossibleGameStates(state);   

    const bestState = possibleStates.reduce((best, current) => {
        return current.value > best.value ? current : best;
    }, possibleStates[0]);

    return bestState.state;
}

const getPossibleGameStates = (
    state: GameState,
): evaluatedState[] => {

    const evaluatedStates: evaluatedState[] = [];
    let simulatedState: GameState = { ...state };

    for (let x = 0; x < gridWidth; x++) {
        for (let rotation = 0; rotation < 4; rotation++) {
            simulatedState = tetrisReducer(simulatedState, { type: "UPDATE_STATE", newState: state });

            for (let r = 0; r < rotation; r++) {
                simulatedState = tetrisReducer(simulatedState, { type: "ROTATE_PIECE" });
            }

            for (let move = 0; move < x; move++) {
                simulatedState = tetrisReducer(simulatedState, {
                    type: "MOVE_PIECE",
                    direction: "RIGHT",
                });
            }

            while (simulatedState.currentPiece) {
                simulatedState = tetrisReducer(simulatedState, { type: "MOVE_PIECE", direction: "DOWN" });
            }

            simulatedState = tetrisReducer(simulatedState, { type: "CLEAR_LINES" });
            evaluatedStates.push({ state: { ...simulatedState }, value: evaluateGameState(simulatedState) });
        }
    }
    return evaluatedStates;
}

const evaluateGameState = (state: GameState): number => {
    if (state.isGameOver) return -Infinity;

    const pileHeight = gridHeight - state.grid.reduce((height, row, index) => {
        const isRowFilled = row.some(cell => cell.filled);
        return isRowFilled ? index + 1 : height;
    }, 0);

    const holes = state.grid.reduce((holeCount, row, y) => {
        return holeCount + row.reduce((rowHoles, cell, x) => {
            if (!cell.filled) {
                const isHole = state.grid.slice(0, y).some(upperRow => upperRow[x].filled);
                return rowHoles + (isHole ? 1 : 0);
            }
            return rowHoles;
        }, 0);
    }, 0);

    const bumpiness = state.grid[0].reduce((totalBumpiness, _, x) => {
        const colHeights = state.grid.map((row) => row[x]).reduce((height, cell, _) => {
            return height + (cell.filled ? 1 : 0);
        }, 0);
        const nextColHeights = x < gridWidth - 1 ? state.grid.map((row) => row[x + 1]).reduce((height, cell, _) => {
            return height + (cell.filled ? 1 : 0);
        }, 0) : colHeights;
        return totalBumpiness + Math.abs(colHeights - nextColHeights);
    }, 0);

    const score = pileHeightWeight * pileHeight + holesWeight * holes + bumpinessWeight * bumpiness;
    return score;
}