import { useEffect } from "react";
import type { GameAction, GameState } from "../types";

/**
 * Custom hook to handle keyboard inputs for controlling the game.
 * @param state - The current game state.
 * @param dispatch - The dispatch function to update the game state.
 */
export const useKeyboardInputs = (
    state: GameState,
    dispatch: React.ActionDispatch<[action: GameAction]>
) => {
    useEffect(() => {
        const handlePress = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    dispatch({ type: "MOVE_PIECE", direction: "LEFT" });
                    break;
                case "ArrowRight":
                    dispatch({ type: "MOVE_PIECE", direction: "RIGHT" });
                    break;
                case "ArrowDown":
                    dispatch({ type: "MOVE_PIECE", direction: "DOWN" });
                    break;
                default:
                    break;
            }
            event.preventDefault();
        };

        if (!state.isGameOver) {
            window.addEventListener("keydown", handlePress);
        }
        return () => {
            window.removeEventListener("keydown", handlePress);
        };
    }, [dispatch, state.isGameOver]);
};
