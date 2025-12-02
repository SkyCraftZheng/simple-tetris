export type Cell = {
    filled: boolean;
    color: string | null;
};

export type Grid = Cell[][];

export type Tetromino = {
    shape: number[][];
    color: string;
};

export type Position = {
    x: number;
    y: number;
};

export type GameState = {
    grid: Grid;
    isGameOver: boolean;
    currentPiece: Tetromino | null;
    position: Position;
    score: number;
    speed: number;
};

export type GameAction =
    | { type: "START_GAME" }
    | { type: "MOVE_PIECE"; direction: "LEFT" | "RIGHT" | "DOWN" }
    | { type: "SPAWN_PIECE" }
    | { type: "CLEAR_LINES" }
    | { type: "ROTATE_PIECE" };
