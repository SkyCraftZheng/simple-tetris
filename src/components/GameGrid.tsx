import type { Grid } from "../types";

type GridProps = {
    grid: Grid;
};

/**
 * GameGrid component to display the Tetris game grid.
 * @param grid - The game grid to display.
 */
const GameGrid: React.FC<GridProps> = ({ grid }) => {
    return (
        <div className="grid grid-cols-10 gap-0 border border-gray-400">
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className="w-5 h-5 relative overflow-hidden border border-gray-300"
                        style={{
                            backgroundColor: cell.filled
                                ? cell.color || "gray"
                                : "white",
                        }}
                    />
                ))
            )}
            
        </div>
    );
};

export default GameGrid;
