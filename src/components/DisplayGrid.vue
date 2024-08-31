<template>
    <div class="w-1/2">
        <h2 class="text-2xl font-bold mb-4">Grille analysée :</h2>

        <div v-if="isLoading && !isResolved">
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

        <table v-else-if="isResolved" class="table">
            <tbody>
                <tr v-for="(row, rowIndex) in grid" :key="row">
                    <td
                        v-for="(letter, letterIndex) in row"
                        :key="letter"
                        class="m-0 p-0"
                    >
                        <input
                            type="text"
                            class="form-control m-0 p-0 bg-zinc-900 text-gray-100"
                            :value="letter"
                            :data-x="rowIndex"
                            :data-y="letterIndex"
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
                        />
                    </td>
                </tr>
            </tbody>
        </table>

        <h2 class="text-2xl font-bold mb-4">Mots à trouver :</h2>

        <div v-if="isLoading && !isResolved">
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

        <div v-else-if="isResolved" class="grid grid-cols-3 gap-2">
            <div v-for="(word, index) in words" :key="word">
                <input type="text" class="form-control m-0 p-0" :value="word" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "DisplayGrid",
    props: {
        imageUrl: {
            type: String,
            required: false,
            default: "",
        },
        output: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    watch: {
        output(newValue) {
            if (newValue) {
                this.handleOutputChange();
            }
        },
    },
    data() {
        return {
            isLoading: true,
            isResolved: false,

            grid: [],
            words: [],
        };
    },
    methods: {
        handleOutputChange() {
            this.processGrid();
        },
        async processGrid() {
            this.isLoading = true;

            const scheduler = Tesseract.createScheduler();

            const worker1 = await Tesseract.createWorker("fra", 1, {
                corePath: "../../node_modules/tesseract.js-core",
                workerPath:
                    "../../node_modules/tesseract.js/dist/worker.min.js",
                // logger: function (m) {
                //     console.log(m);
                // },
            });
            const worker2 = await Tesseract.createWorker("fra", 1, {
                corePath: "../../node_modules/tesseract.js-core",
                workerPath:
                    "../../node_modules/tesseract.js/dist/worker.min.js",
                // logger: function (m) {
                //     console.log(m);
                // },
            });

            await worker1.setParameters({
                tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            });
            await worker2.setParameters({
                tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            });

            // parse output to get rectangles
            let output = this.output;
            let rectangles = [];

            for (let i = 0; i < output.length; i++) {
                const item = output[i];
                rectangles.push({
                    left: item.left,
                    top: item.top,
                    width: item.width,
                    height: item.height,
                    label: item.label,
                });
            }

            scheduler.addWorker(worker1);
            scheduler.addWorker(worker2);

            const results = await Promise.all(
                rectangles.map((rectangle) =>
                    scheduler.addJob("recognize", this.imageUrl, { rectangle })
                )
            );

            this.grid = results[0].data.text
                .split("\n")
                .filter((line) => line.length > 0);

            this.words = results[1].data.text
                .split("\n")
                .join(" ")
                .split(" ")
                .filter((line) => line.length > 0);

            await scheduler.terminate();

            this.isLoading = false;
            this.isResolved = true;

            this.$emit("gridAnalysis", {
                grid: this.grid,
                words: this.words,
            });
        },
    },
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
