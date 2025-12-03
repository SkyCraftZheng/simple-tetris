import React, { useReducer } from "react";
import GameGrid from "./GameGrid";
import tetrisReducer from "../reducer/tetrisReducer";
import { useGameLoop } from "../hooks/useGameLoop";
import { extraRows, initialState } from "../constants";
import { getMergedGrid, getVisibleGrid } from "../utils/utils";
import { useKeyboardInputs } from "../hooks/useKeyboardInputs";
import { useBotPlay } from "../hooks/useBotPlay";

/** Main Tetris component.
 */
const Tetris: React.FC = () => {
    const [state, dispatch] = useReducer(tetrisReducer, initialState);

    // The visible grid with the current piece merged in
    const visibleGrid = getVisibleGrid(
        state.currentPiece
            ? getMergedGrid(state.grid, state.currentPiece, state.position)
            : state.grid,
        extraRows
    );

    // Game loop for automatic piece dropping and spawning new pieces
    useGameLoop(state, dispatch);

    // Add event listeners for keyboard inputs
    useKeyboardInputs(state, dispatch);

    useBotPlay(state, dispatch);

    return (
        <section className="flex flex-col items-center gap-4">
            <div className="text-3xl text-amber-100 font-bold underline text-center">
                TETRIS
            </div>

            {state.isGameOver ? (
                <button
                    className="bg-amber-100 text-gray-900 font-bold py-2 px-4 rounded"
                    onClick={() => {
                        dispatch({ type: "SET_BOT_PLAY" , botPlay: false});
                        dispatch({ type: "START_GAME" });
                    }}
                >
                    Start Game
                </button>
            ) : <div className="text-amber-100 text-lg">Score: {state.score}</div>}

            {state.isGameOver ? (
                <button
                    className="bg-amber-100 text-gray-900 font-bold py-2 px-4 rounded"
                    onClick={() => {
                        dispatch({ type: "SET_BOT_PLAY" , botPlay: true});
                        dispatch({ type: "START_GAME" });
                    }}
                >
                    Bot Play
                </button>
            ) : null}

            <div className="flex flex-col items-center bg-white p-3 rounded-md relative">
                <GameGrid grid={visibleGrid} />
            </div>
        </section>
    );
};

export default Tetris;
