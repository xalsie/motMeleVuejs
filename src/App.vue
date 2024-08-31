<script setup>
import UploadForm from "./components/UploadForm.vue";
import DisplayImage from "./components/DisplayImage.vue";
import DisplayGrid from "./components/DisplayGrid.vue";
import ResolveComponent from "./components/ResolveComponent.vue";
import ImageSelectAreas from "./components/ImageSelectAreas.vue";
import { ref } from "vue";
</script>

<template>
    <UploadForm
        v-show="!imageGridUrl"
        :title="`Importer une photo de la grille`"
        @image-imported="handleImageGridImported"
        @grid-imported="handleGridImported"
    />

    <div
        class="image flex flex-col items-center"
        v-show="imageGridUrl && !output.length > 0"
    >
        <div class="">
            <h1 class="text-2xl font-bold">
                Sélectionnez la grille et les mots
            </h1>
            <p class="text-sm text-gray-500">
                Cliquez et faites glisser pour sélectionner une zone
            </p>
        </div>

        <image-select-areas
            :url="imageGridUrl"
            @added="onAdded"
            v-model="areas"
        >
            <template #default="{ area }">
                <div>
                    <div>{{ area.label ?? "Default slot" }}</div>
                    <div>Position: {{ area.left }} / {{ area.top }}</div>
                    <div>
                        Size: {{ Math.round(area.width) }}x{{
                            Math.round(area.height)
                        }}px
                    </div>
                </div>
            </template>
        </image-select-areas>

        <div class="toolbar" v-show="imageGridUrl">
            <button class="clear" @click="handleResetGrid">Reset</button>
            <button class="save" @click="valideAreas">Validé les zones</button>
        </div>
    </div>

    <div class="flex flex-row gap-4" v-show="!resolved && output.length > 0">
        <DisplayImage v-show="imageGridUrl" :imageUrl="imageGridUrl" />

        <DisplayGrid
            v-show="imageGridUrl && grid"
            :imageUrl="imageGridUrl"
            :output="output"
            @gridAnalysis="handleGridAnalysis"
        />
    </div>

    <ResolveComponent
        v-show="grid && grid.length && words && words.length"
        :grid="grid"
        :words="words"
        @resolved="handleGridResolved"
        @resetGrid="handleResetGrid"
    />
</template>

<script>
const imageGridUrl = ref("");
const grid = ref([]);
const words = ref([]);
const resolved = ref(false);

const areas = ref([]);
const output = ref([]);

export default {
    components: {
        UploadForm,
        DisplayImage,
        DisplayGrid,
        ResolveComponent,
        ImageSelectAreas,
    },
    methods: {
        onAdded(newArea) {
            if (areas.value.length === 0) {
                newArea.label = "Grid";
            } else {
                newArea.label = "Words";
            }

            areas.value.push(newArea);
        },
        clearAreas() {
            areas.value = [];
        },
        valideAreas() {
            // output.value = JSON.stringify(areas.value, undefined, 2);
            output.value = areas.value;

            this.$emit("grid-imported", areas.value);
        },
        handleGridAnalysis(gridData) {
            grid.value = gridData.grid;
            words.value = gridData.words;
        },
        handleImageGridImported(imageData) {
            imageGridUrl.value = imageData;
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

            areas.value = [];
            output.value = [];
        },
    },
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
