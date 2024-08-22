<script setup>
import UploadForm from "./components/UploadForm.vue";
import DisplayImage from "./components/DisplayImage.vue";
import DisplayGrid from "./components/DisplayGrid.vue";
import { ref } from "vue";
</script>

<template>
    <div>
        <UploadForm
            v-show="!imageGridUrl"
            :title="`Importer une photo de la grille`"
            @image-imported="handleImageGridImported"
            @grid-imported="handleGridImported"
        />

        <div
            style="display: flex; justify-content: center; align-items: center"
        >
            <DisplayImage v-show="imageGridUrl" :imageUrl="imageGridUrl" />

            <DisplayGrid v-show="imageGridUrl && grid" :grid="grid" />
        </div>

        <!-- TODO: detecte les mots a trouvé -->
        <!-- <UploadForm
            v-show="!imageWordsUrl"
            :title="`Importer une photo des mots`"
            @image-imported="handleWordsImported"
        /> -->

        <!-- <div style="display: flex; justify-content: center; align-items: center;">
            <DisplayImage v-show="imageWordsUrl" :imageUrl="imageWordsUrl" /> -->

        <!-- <DisplayGrid v-show="grid" :grid="grid" /> -->
        <!-- </div> -->

        <div>
            <!-- resoudre -->
            <button @click="resolve">Résoudre</button>
        </div>
    </div>
</template>

<script>
const imageGridUrl = ref("");
const imageWordsUrl = ref("");
const grid = ref([]);
const words = ref([]);

export default {
    components: {
        UploadForm,
    },
    methods: {
        handleImageGridImported(imageData) {
            console.log("Image Grid imported:", imageData);
            imageGridUrl.value = imageData;
        },
        handleWordsImported(imageData) {
            console.log("Image Words imported:", imageData);
            // imageWordsUrl.value = imageData;
        },
        handleGridImported(gridData) {
            console.log("Grid imported:", gridData);
            grid.value = gridData;
        },
        async resolve() {
            const response = await fetch("/resolve", {
                method: "POST",
                body: JSON.stringify({
                    grid: grid.value,
                    words: words.value,
                }),
                headers: { "Content-Type": "application/json" },
                dataType: "json",
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'importation de l'image.");
            }

            const result = await response.json();

            // TODO: afficher les mots dans le DOM
            const wordsFound = result.wordsResult;

            const wordElement = document.createElement("div");
            wordElement.innerHTML = wordsFound
                .map(
                    (word) =>
                        `<div>${word.word} - ${word.positions.start.row}:${word.positions.start.col} - ${word.positions.end.row}:${word.positions.end.col}</div>`
                )
                .join("");

            document.body.appendChild(wordElement);
        },
    },
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
