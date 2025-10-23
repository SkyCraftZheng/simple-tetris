# Simple Tetris game
## Design
### The grid
The visible grid is 10 x 20, but under the hood there is an extra 4 rows for the spawning of tetromino pieces as the longest piece, 'I', is 4 rows tall. This way, the pieces can be spawned above the top left corner of the grid as it was shown in the brief.

The grid itself is represented by a 2 dimensional array with the first index, `y`, indicating the row and the second the column, `x`. The origin of the grid is the top left. This means `y` increases from top to bottom and `x` from left to right.

Each cell in the grid also holds whether they are filled or not and if they are filled, with which colour.
### Tetronimo piece handling
One of the main challanges naturally was on handling the moving piece and how to represent it and display it on the screen. It could be stored directly in the grid, however there would still be a need to keep track of its position and its shape for moving it around. Which is why the game state only stores the moving piece and its position, and the grid without the moving piece in it.

This way, all the required information for displaying the grid with the moving piece in it is kept track of, and it simplifies the manipulation of the piece as only its position needs to be changed as opposed to however many cells the piece occupies.
### Game flow
When there is a piece dropping down, it falls at a constant rate of 1 second.

When a piece would move down, but there is a collision, ie. if the piece would be occupying an already filled cell, the piece is locked to that position. This is when the grid stored in the game state is updated with this newly locked piece merged in.

Then any fully filled rows are cleared then a new piece is spawned.
### Rotation
Currently, the rotation is handled by rotating the piece and the new top left corner takes the position that is tracked in the state. This means that there is no consistent axis for rotation for pieces. To implement the regular Tetris version of rotation the position tracking and handling of moving pieces likely needs to be adjusted. Since the pieces will have to rotate around an anchor point unique to each shape, which could change the position of the top left corner of the piece. This means that when rotating a piece it will need to also update the postion of the piece, or it could make more sense to track the position of the anchor point rather than the top left corner of the piece.
### Further Considerations
The webapp currently attaches eventlisteners and intervals to the window, if this project were to be integrated into an existing page as a component, it might be a better idea to mount to the component itself rather than the window.

## Implementation
### Dependencies
The project uses TypeScript, React and Tailwindcss. Tailwind is used for simpler and better styling with less guesswork.
### Components
The main component is `components/Tetris.tsx` which assembles together all of the logic along with containing the title text the 'Start Game' button and `components/GameGrid.tsx` that renders out the grid from the 2d array representation.
### Hooks
`hooks/useGameLoop.ts` contains the logic for automatic dropping of the pieces and when a piece locks in place, dispatching for rows to be cleared and then a new piece to be spawned

`ooks/useKeyboardInputs.ts` attaches eventlisteners and dispatches the moving of pieces based on which key is pressed.
### Reducer
`reducer/tetrisReducer.ts` handles the manipulation of the game state. Starting the game, spawning and moving a piece, and clearing rows.
### Logic
`utils/utils.ts` contains the logic for generating a random piece, merging a piece into a grid and the cropping off of the spawning rows, and collision logic.
### In bigger projects
In bigger projects to keep everything organised, it would be a better idea to seperate the constants, types, and util functions into component specific files, like `tetrisUtils.ts` or `tetrisConstants.ts` for example.

## Running the application
### Install dependencies
(In the project directory)
```bash
npm install
```

### Run the project
```bash
npm run dev
```

This will start a server and the application can be viewed in a browser at the port specified in the console
