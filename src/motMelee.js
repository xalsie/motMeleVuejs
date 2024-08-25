export class motMelee {
    constructor(logger) {
        this.letterCount = [];
        this.grid = [];
        this.words = [];

        this.isLogger = logger || false;
    }

    setGrid(grid) {
        this.grid = grid;
    }

    setWords(words) {
        this.words = words;
    }

    getGrid() {
        return this.grid;
    }

    getWords() {
        return this.words;
    }

    logger(...message) {
        if (this.isLogger) {
            console.log(...message);
        }
    }

    async solve() {
        this.logger("start solving");

        if (this.isLogger) console.time("timerResolveGrid");

        const { numRows, numCols } = this.calculateGridDimensions();
        this.logger(`numRows: ${numRows} numCols: ${numCols}`);

        const wordsResult = await this.searchWords(numRows, numCols);
        const unusedLetters = await this.displayUnusedLetters();

        if (this.isLogger) console.timeEnd("timerResolveGrid");
        this.logger("end solving");

        return {
            wordsResult: wordsResult,
            unusedLetters: unusedLetters,
        };
    }

    calculateGridDimensions() {
        const grid = this.getGrid();
        const numCols = grid[0].length;
        const cells = numCols * grid.length;
        const numRows = Math.ceil(cells / numCols);

        return { numRows, numCols };
    }

    async searchWords(numRows, numCols) {
        const words = this.getWords();

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
                        !(pos.row === 0 && dir.row === -1) ||
                        !(pos.row === numRows - 1 && dir.row === 1) ||
                        !(pos.col === 0 && dir.col === -1) ||
                        !(pos.col === numCols - 1 && dir.col === 1)
                    ) {
                        const wordPositions = this.checkWordInDirection(
                            word,
                            pos,
                            dir,
                            numRows,
                            numCols
                        );
                        if (wordPositions) {
                            result.push({
                                word: word,
                                positions: wordPositions,
                            });
                        }
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

    checkWordInDirection(word, startPos, dir, numRows, numCols) {
        const grid = this.getGrid();
        let found = true;
        let wordsResult = [];
        let currentRow = startPos.row;
        let currentCol = startPos.col;

        const wordPositions = [{ row: currentRow, col: currentCol }];

        for (let i = 1; i < word.length; i++) {
            currentRow += dir.row;
            currentCol += dir.col;

            if (
                currentRow < 0 ||
                currentRow >= numRows ||
                currentCol < 0 ||
                currentCol >= numCols ||
                grid[currentRow][currentCol] !== word[i]
            ) {
                found = false;
                break;
            }

            wordPositions.push({ row: currentRow, col: currentCol });
        }

        if (found) {
            this.logger(
                `Word "${word}" found starting at (${startPos.row}, ${startPos.col}) and ending at (${currentRow}, ${currentCol}) in direction (${dir.row}, ${dir.col})`
            );

            return {
                start: { row: startPos.row, col: startPos.col },
                end: { row: currentRow, col: currentCol },
                direction: { row: dir.row, col: dir.col },
            };
        }
    }

    markLetters(grid, wordPositions) {
        const Reset = "\x1b[0m";
        const FgRed = "\x1b[31m";
        const BgGray = "\x1b[100m";

        grid.forEach((line, i) => {
            let row = "";
            line.split("").forEach((letter, j) => {
                const isWord = wordPositions.some(
                    (pos) => pos.row === i && pos.col === j
                );
                row += isWord ? BgGray + FgRed + letter + Reset : letter;

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

            this.logger(row);
        });
    }

    async displayUnusedLetters() {
        let unusedLetters = [];

        this.letterCount.forEach((line, i) => {
            line.forEach((cell, j) => {
                if (cell.count === 0) {
                    unusedLetters.push(cell.value);
                }
            });
        });

        return unusedLetters;
    }
}

export default motMelee;
