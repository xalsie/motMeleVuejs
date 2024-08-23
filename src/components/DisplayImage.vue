<template>
    <div class="w-1/2">
        <h2 class="text-2xl font-bold mb-4">Image importée :</h2>
        <img :src="imageUrl" alt="Uploaded Image" class="w-4/5" />
    </div>
</template>

<script>
    export default {
        name: 'DisplayImage',
        props: {
            imageUrl: {
                type: String,
                required: true,
            },
        },
    };
</script>

<style scoped>
</style>
