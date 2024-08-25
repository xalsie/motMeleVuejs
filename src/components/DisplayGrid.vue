<template>
    <div class="w-1/2">
        <h2 class="text-2xl font-bold mb-4">Grille analysée :</h2>
        <table class="table">
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
        <div class="grid grid-cols-3 gap-2">
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
        grid: {
            type: Array,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        output: {
            type: Object,
            required: false,
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
            grid: [],
            words: [],
        };
    },
    methods: {
        handleOutputChange() {
            this.processGrid();
        },
        async processGrid() {
            const scheduler = Tesseract.createScheduler();

            const worker1 = await Tesseract.createWorker("fra", 1, {
                corePath: "../../node_modules/tesseract.js-core",
                workerPath:
                    "../../node_modules/tesseract.js/dist/worker.min.js",
                logger: function (m) {
                    console.log(m);
                },
            });
            const worker2 = await Tesseract.createWorker("fra", 1, {
                corePath: "../../node_modules/tesseract.js-core",
                workerPath:
                    "../../node_modules/tesseract.js/dist/worker.min.js",
                logger: function (m) {
                    console.log(m);
                },
            });
            await worker1.setParameters({
                tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            });
            await worker2.setParameters({
                tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            });
            // console.log(this.output);

            // parse output to get rectangles
            let test = JSON.parse(this.output);
            let rectangles = [];

            for (let i = 0; i < test.length; i++) {
                const item = test[i];
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

            // console.log(results.map((r) => r.data.text));

            // console.log("Terminating workers...", results);

            this.grid = results[0].data.text
                .split("\n")
                .filter((line) => line.length > 0);

            // console.log("Grid:", this.grid);

            this.words = results[1].data.text
                .split("\n")
                .join(" ")
                .split(" ")
                .filter((line) => line.length > 0);

            // console.log("Words:", this.words);

            await scheduler.terminate();

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
