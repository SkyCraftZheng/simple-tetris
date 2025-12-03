import { useEffect, useRef } from "react";
import type { GameAction, GameState } from "../types";
import { getNextBestState } from "../utils/solver";

export const useBotPlay = (
    state: GameState,
    dispatch: React.Dispatch<GameAction>
) => {
    const intervalRef = useRef<number | null>(null);
    
    useEffect(() => {
        const startBotPlay = () => {
            intervalRef.current = window.setInterval(() => {
                dispatch({ type: "UPDATE_STATE", newState: getNextBestState(state)});
            }, 100);
        }

        const stopBotPlay = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        if (state.botPlay && !state.isGameOver && state.currentPiece) {
            startBotPlay();
        }

        return () => {
            stopBotPlay();
        }

    }, [dispatch, state.isGameOver, state.botPlay, state.currentPiece]);
};