import { createWorker } from "tesseract.js";

export class motMelee {
    constructor() {
        this.letterCount = [];
        this.filePath = "";
        this.grid = [];
    }

    setFilePath(filePath) {
        this.filePath = filePath;
    }

    getFilePath() {
        return this.filePath;
    }

    async solveAuto() {
        console.log("start solving");

        console.time("TimerTotal");
        console.time("timerRecognizeImage");

        const worker = await this.initializeWorker();

        const grid = await this.recognizeImage(worker, this.getFilePath());
        await worker.terminate();

        console.timeEnd("timerRecognizeImage");
        console.time("timerResolveGrid");

        const { numRows, numCols } = this.calculateGridDimensions(grid);
        console.log(`numRows: ${numRows} numCols: ${numCols}`);
        console.log("Lines:", grid);

        const words = await this.searchWords(grid, numRows, numCols);
        const letters = await this.displayUnusedLetters(grid);

        console.timeEnd("timerResolveGrid");
        console.timeEnd("TimerTotal");
        console.log("end solving");

        return {
            grid: grid,
            words: words,
            letters: letters,
        };
    }

    async solve(grid, words) {
        console.log("start solving");

        console.time("TimerTotal");
        console.time("timerResolveGrid");

        const { numRows, numCols } = this.calculateGridDimensions(grid);
        console.log(`numRows: ${numRows} numCols: ${numCols}`);
        console.log("Lines:", grid);

        const wordsResult = await this.searchWords(grid, numRows, numCols);
        const letters = await this.displayUnusedLetters(grid);

        console.timeEnd("timerResolveGrid");
        console.timeEnd("TimerTotal");
        console.log("end solving");

        return {
            // grid: grid,
            wordsResult: wordsResult,
            letters: letters,
        };
    }

    async getGrid() {
        console.time("timerRecognizeImage");

        const worker = await this.initializeWorker();

        const grid = await this.recognizeImage(worker, this.getFilePath());
        await worker.terminate();

        console.timeEnd("timerRecognizeImage");

        this.grid = grid;

        return {
            grid: this.grid
        };
    }

    async initializeWorker() {
        const worker = await createWorker("fra", 1, {
            // logger: (m) => console.log(m),
        });

        await worker.setParameters({
            tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        });

        return worker;
    }

    async recognizeImage(worker, imagePath) {
        const {
            data: { text },
        } = await worker.recognize(imagePath);

        let grid = text.split("\n").filter((line) => line.length > 0);
        console.log(grid);

        return grid;
    }

    calculateGridDimensions(grid) {
        const numCols = grid[0].length;
        const cells = numCols * grid.length;
        const numRows = Math.ceil(cells / numCols);

        return { numRows, numCols };
    }

    async searchWords(grid, numRows, numCols) {
        let result = [];
        // const words = [ /* Liste des mots */ ];
        const words = [
            // image test 3 : OK : https://www.fortissimots.com/wp-content/uploads/meles_fortissimots_22.pdf
            "ALPES",
            "ANGES",
            "ANTIBES",
            "BAIE",
            "CAGNES",
            "CANNES",
            "CARLTON",
            "CHIC",
            "CLIMAT",
            "CROISETTE",
            "ESTEREL",
            "FESTIVAL",
            "GOLFEJUAN",
            "GRASSE",
            "HIVER",
            "ISOLA",
            "LABOCCA",
            "LERINS",
            "MAJESTIC",
            "MALMAISON",
            "MANDELIEU",
            "MARTINEZ",
            "MENTON",
            "MERCANTOUR",
            "MOUGINS",
            "NICE",
            "NUIT",
            "PLAGE",
            "PROVENCE",
            "RIVIERA",
            "SAINTEMARGUERITE",
            "SAINTHONORAT",
            "SIAGNE",
            "TINEE",
            "VALLAURIS",
            "VENT",
            "VESUBIE",
            "VILLAS",
        ];
    
        words.forEach((word) => {
            const firstLetter = word[0];
            const positions = this.findLetterPositions(grid, firstLetter);
    
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
                    const wordPositions = this.checkWordInDirection(
                        grid,
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
                });
            });
        });
    
        return result;
    }

    findLetterPositions(grid, letter) {
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

    checkWordInDirection(grid, word, startPos, dir, numRows, numCols) {
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
            console.log(
                `Word "${word}" found starting at (${startPos.row}, ${startPos.col}) and ending at (${currentRow}, ${currentCol}) in direction (${dir.row}, ${dir.col})`
            );
            // this.markLetters(grid, wordPositions);

            return {
                start: { row: startPos.row, col: startPos.col },
                end: { row: currentRow, col: currentCol },
                direction: { row: dir.row, col: dir.col },
            }
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

            console.log(row);
        });
    }

    async displayUnusedLetters(grid) {
        let unusedLetters = [];

        this.letterCount.forEach((line, i) => {
            line.forEach((cell, j) => {
                if (cell.count === 0) {
                    // console.log(
                    //     `Letter "${cell.value}" at position (${i}, ${j}) is never used`
                    // );
                    unusedLetters.push(cell.value);
                }
            });
        });

        // const Reset = "\x1b[0m";
        // const FgRed = "\x1b[31m";
        // const BgGray = "\x1b[100m";

        // grid.forEach((line, i) => {
        //     let row = "";
        //     line.split("").forEach((letter, j) => {
        //         const isWord = this.letterCount[i][j].count === 0;
        //         row += isWord ? BgGray + FgRed + letter + Reset : letter;
        //     });
        //     console.log(row);
        // });

        return unusedLetters;
    }
}
