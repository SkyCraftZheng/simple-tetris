import { useEffect, useRef } from "react";
import type { GameAction, GameState } from "../types";

/**
 * Custom hook to manage the game loop for Tetris.
 * @param state - The current game state.
 * @param dispatch - The dispatch function to update the game state.
 */
export const useGameLoop = (
    state: GameState,
    dispatch: React.Dispatch<GameAction>
) => {
    const intervalRef = useRef<number | null>(null);

    // Handle when piece is placed. Spawn a new piece and clear lines if needed.
    useEffect(() => {
        if (!state.currentPiece && !state.isGameOver) {
            dispatch({ type: "CLEAR_LINES" });
            dispatch({ type: "SPAWN_PIECE" });
        }
    }, [state.currentPiece, state.isGameOver, dispatch]);

    // Handle automatic piece dropping
    useEffect(() => {
        const startDropping = () => {
            intervalRef.current = window.setInterval(() => {
                dispatch({ type: "MOVE_PIECE", direction: "DOWN" });
            }, state.speed);
        };

        const stopDropping = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        if (!state.isGameOver) {
            startDropping();
        }

        return () => {
            stopDropping();
        };
    }, [state.speed, state.isGameOver, dispatch]);
};
