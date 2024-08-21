<script setup>
import UploadForm from './components/UploadForm.vue';
import DisplayImage from './components/DisplayImage.vue';
import { ref } from 'vue';

const imageUrl = ref('');

function handleImageUpload(url) {
    imageUrl.value = url;
}
</script>

<template>
    <div>
        <!-- masque le composant UploadForm si une image a été importée -->
        <UploadForm v-show="!imageUrl" @image-uploaded="handleImageUpload" />
        <!-- affiche le composant DisplayImage si une image a été importée -->
        <DisplayImage v-show="imageUrl" :imageUrl="imageUrl" />
    </div>
</template>

<style scoped>
/* Ajoutez vos styles ici */
</style>
