<template>
    <div>
        <h2>Image importée :</h2>
        <img :src="imageUrl" alt="Uploaded Image" />
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
    img {
        max-height: 426px;
        height: auto;
    }
</style>
