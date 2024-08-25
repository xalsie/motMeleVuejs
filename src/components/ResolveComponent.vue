<template>
    <div
        v-show="grid && grid.length && words && words.length"
        class="flex flex-col items-center justify-center mt-4"
    >
        <button v-if="!isLoading && !isResolved" @click="resolve">
            Résoudre
        </button>

        <div v-else-if="isLoading && !isResolved">
            <p>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect x="1" y="1" rx="1" width="10" height="10">
                        <animate
                            id="spinner_c7A9"
                            begin="0;spinner_23zP.end"
                            attributeName="x"
                            dur="0.2s"
                            values="1;13"
                            fill="freeze"
                        />
                        <animate
                            id="spinner_Acnw"
                            begin="spinner_ZmWi.end"
                            attributeName="y"
                            dur="0.2s"
                            values="1;13"
                            fill="freeze"
                        />
                        <animate
                            id="spinner_iIcm"
                            begin="spinner_zfQN.end"
                            attributeName="x"
                            dur="0.2s"
                            values="13;1"
                            fill="freeze"
                        />
                        <animate
                            id="spinner_WX4U"
                            begin="spinner_rRAc.end"
                            attributeName="y"
                            dur="0.2s"
                            values="13;1"
                            fill="freeze"
                        />
                    </rect>
                    <rect x="1" y="13" rx="1" width="10" height="10">
                        <animate
                            id="spinner_YLx7"
                            begin="spinner_c7A9.end"
                            attributeName="y"
                            dur="0.2s"
                            values="13;1"
                            fill="freeze"
                        />
                        <animate
                            id="spinner_vwnJ"
                            begin="spinner_Acnw.end"
                            attributeName="x"
                            dur="0.2s"
                            values="1;13"
                            fill="freeze"
                        />
                        <animate
                            id="spinner_KQuy"
                            begin="spinner_iIcm.end"
                            attributeName="y"
                            dur="0.2s"
                            values="1;13"
                            fill="freeze"
                        />
                        <animate
                            id="spinner_arKy"
                            begin="spinner_WX4U.end"
                            attributeName="x"
                            dur="0.2s"
                            values="13;1"
                            fill="freeze"
                        />
                    </rect>
                    <rect x="13" y="13" rx="1" width="10" height="10">
                        <animate
                            id="spinner_ZmWi"
                            begin="spinner_YLx7.end"
                            attributeName="x"
                            dur="0.2s"
                            values="13;1"
                            fill="freeze"
                        />
                        <animate
                            id="spinner_zfQN"
                            begin="spinner_vwnJ.end"
                            attributeName="y"
                            dur="0.2s"
                            values="13;1"
                            fill="freeze"
                        />
                        <animate
                            id="spinner_rRAc"
                            begin="spinner_KQuy.end"
                            attributeName="x"
                            dur="0.2s"
                            values="1;13"
                            fill="freeze"
                        />
                        <animate
                            id="spinner_23zP"
                            begin="spinner_arKy.end"
                            attributeName="y"
                            dur="0.2s"
                            values="1;13"
                            fill="freeze"
                        />
                    </rect>
                </svg>
            </p>
        </div>

        <div v-else-if="isResolved">
            <p>Grille résolue:</p>
            <table class="table" id="tableResolve">
                <tbody>
                    <tr v-for="(row, rowIndex) in grid" :key="row">
                        <td
                            v-for="(letter, letterIndex) in row"
                            :key="letter"
                            class="m-0 p-0"
                        >
                            <span
                                class="form-control m-0 p-0 w-1 h-1 bg-zinc-900 text-gray-100"
                                :value="letter"
                                :data-x="rowIndex"
                                :data-y="letterIndex"
                                :class="{
                                    highlight: isHighlighted(
                                        rowIndex,
                                        letterIndex
                                    ),
                                }"
                                style="
                                    width: 30px;
                                    height: 30px;
                                    text-align: center;
                                    font-size: 15px;
                                    font-weight: bold;
                                    padding: 1px;
                                    display: inline-block;
                                    white-space: nowrap;
                                "
                                >{{ letter }}</span
                            >
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="isResolved">
            <div class="grid grid-cols-3 gap-2">
                <div
                    v-for="(word, index) in wordsFound"
                    :key="word.word"
                    @mouseover="highlightWord(word)"
                    @mouseleave="clearHighlight"
                    @click="highlightWord(word)"
                >
                    <div>{{ word.word }}</div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="isResolved" class="flex items-center justify-end mt-4 mr-4">
        <button
            @click="clearImageGrid"
            class="bg-red-500 font-bold hover:bg-red-700 mb-4 mt-4 py-2 rounded text-white"
        >
            Reset grid
        </button>
    </div>
</template>

<script>
import motMelee from "../motMelee.js";

export default {
    name: "ResolveComponent",
    props: {
        grid: {
            type: Array,
            required: true,
        },
        words: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            isLoading: false,
            isResolved: false,
            wordsFound: [],
            highlightedWord: null,
        };
    },
    methods: {
        async resolve() {
            this.isLoading = true;

            const handleMotMeler = new motMelee();

            handleMotMeler.setGrid(this.grid);
            handleMotMeler.setWords(this.words);

            const result = await handleMotMeler.solve();

            this.isLoading = false;
            this.isResolved = true;

            this.$emit("resolved", true);

            this.wordsFound = result.wordsResult;
            this.unusedLetters = result.unusedLetters;
        },
        highlightWord(word) {
            this.highlightedWord = word;
            console.log("highlightedWord:", this.highlightedWord);
        },
        clearHighlight() {
            this.highlightedWord = null;
        },
        clearImageGrid() {
            this.isResolved = false;
            this.wordsFound = [];
            this.highlightedWord = null;

            this.$emit("resetGrid", true);
        },
    },
    computed: {
        isHighlighted() {
            return (x, y) => {
                if (!this.highlightedWord) return false;
                const { start, direction } = this.highlightedWord.positions;
                let currentRow = start.row;
                let currentCol = start.col;
                while (
                    currentRow !== this.highlightedWord.positions.end.row ||
                    currentCol !== this.highlightedWord.positions.end.col
                ) {
                    if (currentRow === x && currentCol === y) return true;
                    currentRow += direction.row;
                    currentCol += direction.col;
                }
                return currentRow === x && currentCol === y;
            };
        },
    },
};
</script>

<style scoped>
.highlight {
    color: #ffffff;
    font-weight: bold;
    border: 1px solid #f87171;
}
</style>
