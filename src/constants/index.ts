import type { Cell, Tetromino } from "../types";

export const spawnPosition = { x: 0, y: 0 };

export const gridWidth = 10;
export const extraRows = 4; // Rows above visible grid for spawning pieces
export const gridHeight = 20 + extraRows;
export const dropSpeed = 1000; // milliseconds

export const TETROMINOS: Record<string, Tetromino> = {
    O: {
        shape: [
            [1, 1],
            [1, 1],
        ],
        color: "yellow",
    },
    I: { shape: [[1], [1], [1], [1]], color: "cyan" },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
        ],
        color: "green",
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
        ],
        color: "red",
    },
    J: {
        shape: [
            [0, 1],
            [0, 1],
            [1, 1],
        ],
        color: "blue",
    },
    L: {
        shape: [
            [1, 0],
            [1, 0],
            [1, 1],
        ],
        color: "orange",
    },
    T: {
        shape: [
            [1, 1, 1],
            [0, 1, 0],
        ],
        color: "purple",
    },
};

export const emptyCell = { filled: false, color: null } as Cell;
export const emptyGrid = Array.from({ length: gridHeight }, () =>
    Array.from({ length: gridWidth }, () => emptyCell)
);

export const initialState = {
    grid: emptyGrid,
    isGameOver: true,
    currentPiece: null,
    position: spawnPosition,
    score: 0,
    speed: dropSpeed,
};
