<script setup>
import UploadForm from "./components/UploadForm.vue";
import DisplayImage from "./components/DisplayImage.vue";
import DisplayGrid from "./components/DisplayGrid.vue";
import ResolveComponent from "./components/ResolveComponent.vue";
import { ref } from "vue";
</script>

<template>
    <UploadForm
        v-show="!imageGridUrl"
        :title="`Importer une photo de la grille`"
        @image-imported="handleImageGridImported"
        @grid-imported="handleGridImported"
    />

    <div class="flex flex-row gap-4" v-show="!resolved">
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

    <ResolveComponent v-show="grid && grid.length && words.length == 0" :grid="grid" :words="words" @resolved="handleGridResolved" @resetGrid="handleResetGrid" />
</template>

<script>
const imageGridUrl = ref("");
const imageWordsUrl = ref("");
const grid = ref([]);
const words = ref([]);
const resolved = ref(false);

export default {
    components: {
        UploadForm,
    },
    methods: {
        handleImageGridImported(imageData) {
            imageGridUrl.value = imageData;
        },
        handleWordsImported(imageData) {
            console.log("Image Words imported:", imageData);
            // imageWordsUrl.value = imageData;
        },
        handleGridImported(gridData) {
            grid.value = gridData;
        },
        handleGridResolved(bool) {
            resolved.value = bool;
        },
        handleResetGrid() {
            imageGridUrl.value = "";
            grid.value = [];
            words.value = [];
            resolved.value = false;

            console.log("Grid reseted");
        },
    },
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
