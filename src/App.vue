<script setup>
import UploadForm from "./components/UploadForm.vue";
import DisplayImage from "./components/DisplayImage.vue";
import DisplayGrid from "./components/DisplayGrid.vue";
import { ref } from "vue";
</script>

<template>
    <div>
        <UploadForm
            v-show="!imageUrl"
            @image-imported="handleImageImported"
            @grid-imported="handleGridImported"
        />

        <DisplayImage v-show="imageUrl" :imageUrl="imageUrl" />

        <DisplayGrid v-show="grid" :grid="grid" />
    </div>
</template>

<script>
const imageUrl = ref("");
const grid = ref([]);

export default {
    components: {
        UploadForm,
    },
    methods: {
        handleImageImported(imageData) {
            console.log("Image imported:", imageData);
            imageUrl.value = imageData;
        },
        handleGridImported(gridData) {
            console.log("Grid imported:", gridData);
            grid.value = gridData;
        },
    },
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
