import { gridHeight, gridWidth, holesWeight, linesClearedWeight, landingHeightWeight, rowWeight, colWeight, wellWeight } from "../constants";
import tetrisReducer from "../reducer/tetrisReducer";
import type { evaluatedState, GameState, Position } from "../types";

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
    let position = { ...state.position };

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
                position = simulatedState.position;
                simulatedState = tetrisReducer(simulatedState, { type: "MOVE_PIECE", direction: "DOWN" });
            }

            let linesCleared = simulatedState.grid.reduce((lines, row) => {
                return row.every(cell => cell.filled) ? lines + 1 : lines;
            }, 0);
            simulatedState = tetrisReducer(simulatedState, { type: "CLEAR_LINES" });
            evaluatedStates.push({ state: { ...simulatedState }, value: evaluateGameState(simulatedState, position, linesCleared) });
        }
    }
    return evaluatedStates;
}

const evaluateGameState = (
    state: GameState,
    position: Position,
    linesCleared: number
): number => {
    if (state.isGameOver) return -Infinity;

    const landingHeight = gridHeight - position.y;

    const holes = state.grid.reduce((holeCount, row, y) => {
        return holeCount + row.reduce((rowHoles, cell, x) => {
            if (!cell.filled) {
                const isHole = state.grid.slice(0, y).some(upperRow => upperRow[x].filled);
                return rowHoles + (isHole ? 1 : 0);
            }
            return rowHoles;
        }, 0);
    }, 0);

    const rowTransitions = state.grid.reduce((totalTransitions, row) => {
        let transitions = 0;
        for (let x = 0; x < row.length - 1; x++) {
            if (row[x].filled !== row[x + 1].filled) {
                transitions++;
            }
        }
        if (row[0].filled) transitions++;
        return totalTransitions + transitions;
    }, 0);

    const colTransitions = state.grid[0].reduce((totalTransitions, _, x) => {
        let transitions = 0;
        for (let y = 0; y < state.grid.length - 1; y++) {
            if (state.grid[y][x].filled !== state.grid[y + 1][x].filled) {
                transitions++;
            }
        }
        if (state.grid[0][x].filled) transitions++;
        return totalTransitions + transitions;
    }, 0);

    const wellSum = state.grid[0].reduce((totalWells, _, x) => {
        let wellDepth = 0;
        for (let y = 0; y < state.grid.length; y++) {
            const leftFilled = x === 0 || state.grid[y][x - 1].filled;
            const rightFilled = x === gridWidth - 1 || state.grid[y][x + 1].filled;
            if (state.grid[y][x].filled === false && leftFilled && rightFilled) {
                wellDepth++;
                totalWells += wellDepth;
            } else {
                wellDepth = 0;
            }
        }
        return totalWells;
    }, 0);

    console.log(`Landing Height: ${landingHeight}, Holes: ${holes}, Row Transitions: ${rowTransitions}, Col Transitions: ${colTransitions}, Lines Cleared: ${linesCleared}`);

    const score = landingHeightWeight * landingHeight + holesWeight * holes
        + linesClearedWeight * linesCleared * gridWidth
        + rowWeight * rowTransitions + colWeight * colTransitions
        + wellWeight * wellSum;
    return score;
}