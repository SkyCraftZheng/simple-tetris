import { gridHeight, gridWidth, TETROMINOS } from "../constants";
import type { Grid, Position, Tetromino } from "../types";

/**
 * Get a random Tetromino.
 * @returns a random Tetromino from TETROMINOS.
 */
export const getRandomTetromino = () => {
    const tetrominos = Object.values(TETROMINOS);
    const randomIndex = Math.floor(Math.random() * tetrominos.length);
    return tetrominos[randomIndex];
};

/**
 * Merge a Tetromino piece into the grid.
 * @param grid - The game grid.
 * @param piece - The Tetromino piece to merge.
 * @param position - The position of the Tetromino piece.
 * @returns The game grid with the Tetromino piece merged in.
 */
export const getMergedGrid = (
    grid: Grid,
    piece: Tetromino,
    position: Position
) => {
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const gridY = position.y + y;
                const gridX = position.x + x;

                // Only merge within grid bounds
                if (
                    gridY >= 0 &&
                    gridY < gridHeight &&
                    gridX >= 0 &&
                    gridX < gridWidth
                ) {
                    newGrid[gridY][gridX] = {
                        filled: true,
                        color: piece.color,
                    };
                }
            }
        });
    });

    return newGrid;
};

export const getVisibleGrid = (grid: Grid, extraRows: number) => {
    return grid.slice(extraRows);
};

/**
 * Check for collision of a Tetromino piece with the grid boundaries or filled cells.
 * @param grid - The game grid.
 * @param piece - The Tetromino piece to check.
 * @param position - The position of the Tetromino piece.
 * @returns True if there is a collision, false otherwise.
 */
export const checkCollision = (
    grid: Grid,
    piece: Tetromino,
    position: Position
): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const gridY = position.y + y;
                const gridX = position.x + x;

                if (
                    gridY < 0 ||
                    gridY >= gridHeight ||
                    gridX < 0 ||
                    gridX >= gridWidth ||
                    grid[gridY][gridX].filled
                ) {
                    return true;
                }
            }
        }
    }
    return false;
};

export const getRotatedTetronimo = (piece: Tetromino) => {
    const pieceHeight = piece.shape.length;
    const pieceWidth = piece.shape[0].length; //b_y + 1

    const resultShape = Array.from({ length: pieceWidth }, () =>
        Array.from({ length: pieceHeight }, () => 0)
    );

    for (let y = 0; y < pieceHeight; y++) {
        for (let x = 0; x < pieceWidth; x++) {
            resultShape[x][pieceHeight - 1 - y] = piece.shape[y][x];
        }
    }

    return {shape: resultShape, color: piece.color} as Tetromino;
};
