export class motMelee {
    constructor(logger) {
        this.letterCount = [];
        this.grid = [];
        this.words = [];
        this.numRows = 0;
        this.numCols = 0;

        this.isLogger = logger || false;
    }

    setGrid(grid) {
        this.grid = grid;
    }

    getGrid() {
        return this.grid;
    }

    setWords(words) {
        this.words = words;
    }

    getWords() {
        return this.words;
    }

    setNumRows(numRows) {
        this.numRows = numRows;
    }

    getNumRows() {
        return this.numRows;
    }

    setNumCols(numCols) {
        this.numCols = numCols;
    }

    getNumCols() {
        return this.numCols;
    }

    async solve() {
        console.time("timerResolveGrid");

        this.calculateGridDimensions();

        const numRows = this.getNumRows();
        const numCols = this.getNumCols();
        const _data = {};

        _data.wordsResult = await this.searchWords(numRows, numCols);
        _data.unusedLetters = await this.displayUnusedLetters();

        console.timeEnd("timerResolveGrid");

        return _data;
    }

    calculateGridDimensions() {
        const grid = this.getGrid();
        const numCols = grid[0].length;
        const cells = numCols * grid.length;
        const numRows = Math.ceil(cells / numCols);

        this.setNumRows(numRows);
        this.setNumCols(numCols);
    }

    async searchWords() {
        const words = this.getWords();
        const numRows = this.getNumRows();
        const numCols = this.getNumCols();
        let result = [];

        words.forEach((word) => {
            const firstLetter = word[0];
            const positions = this.findLetterPositions(firstLetter);
            const wordLength = word.length;

            const directions = [
                { row: -1, col: 0 }, // up
                { row: 1, col: 0 }, // down
                { row: 0, col: -1 }, // left
                { row: 0, col: 1 }, // right
                { row: -1, col: -1 }, // up-left
                { row: -1, col: 1 }, // up-right
                { row: 1, col: -1 }, // down-left
                { row: 1, col: 1 }, // down-right
            ];

            positions.forEach((pos) => {
                directions.forEach((dir) => {
                    if (
                        (dir.row === -1 && pos.row - wordLength < -1) || // up
                        (dir.row === 1 && pos.row + wordLength > numRows) || // down
                        (dir.col === -1 && pos.col - wordLength < -1) || // left
                        (dir.col === 1 && pos.col + wordLength > numCols) || // right
                        (dir.row === -1 &&
                            dir.col === -1 &&
                            (pos.row - wordLength < -1 ||
                                pos.col - wordLength < -1)) || // up-left
                        (dir.row === -1 &&
                            dir.col === 1 &&
                            (pos.row - wordLength < -1 ||
                                pos.col + wordLength > numCols)) || // up-right
                        (dir.row === 1 &&
                            dir.col === -1 &&
                            (pos.row + wordLength > numRows ||
                                pos.col - wordLength < -1)) || // down-left
                        (dir.row === 1 &&
                            dir.col === 1 &&
                            (pos.row + wordLength > numRows ||
                                pos.col + wordLength > numCols)) // down-right
                    ) {
                        return;
                    }

                    const wordPositions = this.checkWordInDirection(
                        word,
                        pos,
                        dir
                    );
                    if (wordPositions) {
                        result.push({
                            word: word,
                            positions: wordPositions,
                        });
                    }
                });
            });
        });

        return result;
    }

    findLetterPositions(letter) {
        const grid = this.getGrid();
        const positions = [];

        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col] === letter) {
                    positions.push({ row, col });
                }
            }
        }

        return positions;
    }

    checkWordInDirection(word, startPos, dir) {
        const grid = this.getGrid();
        const numRows = this.getNumRows();
        const numCols = this.getNumCols();
        let currentRow = startPos.row;
        let currentCol = startPos.col;
        let wordLength = word.length - 1;

        const endRow = currentRow + dir.row * wordLength;
        const endCol = currentCol + dir.col * wordLength;

        if (
            endRow < 0 ||
            endRow >= numRows ||
            endCol < 0 ||
            endCol >= numCols
        ) {
            return null;
        }

        const wordPositions = [{ row: currentRow, col: currentCol }];

        for (let i = 0; i < word.length; i++) {
            if (grid[currentRow][currentCol] !== word[i]) {
                return null;
            }
            currentRow += dir.row;
            currentCol += dir.col;

            wordPositions.push({ row: currentRow, col: currentCol });
        }

        currentRow -= dir.row;
        currentCol -= dir.col;

        this.markLetters(wordPositions);

        return {
            start: { row: startPos.row, col: startPos.col },
            end: { row: currentRow, col: currentCol },
            direction: { row: dir.row, col: dir.col },
        };
    }

    markLetters(wordPositions) {
        const grid = this.getGrid();

        grid.forEach((line, i) => {
            line.split("").forEach((letter, j) => {
                const isWord = wordPositions.some(
                    (pos) => pos.row === i && pos.col === j
                );

                if (this.letterCount[i] === undefined) {
                    this.letterCount[i] = [];
                }

                if (this.letterCount[i][j] === undefined) {
                    this.letterCount[i][j] = {
                        value: letter,
                        count: 0,
                    };
                }

                if (isWord) {
                    this.letterCount[i][j].count += 1;
                }
            });
        });
    }

    async displayUnusedLetters() {
        let unusedLetters = [];

        this.letterCount.forEach((line, i) => {
            line.forEach((cell, j) => {
                if (cell.count === 0) {
                    unusedLetters.push({
                        letter: cell.value,
                        positions: {
                            start: { row: i, col: j },
                            end: { row: i, col: j },
                            direction: { row: 0, col: 0 },
                        },
                    });
                }
            });
        });

        return unusedLetters;
    }
}

export default motMelee;
