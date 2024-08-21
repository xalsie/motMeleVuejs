<template>
    <div>
        <div v-for="row in grid" :key="row">
            <span v-for="letter in row" :key="letter">
                {{ letter }}
            </span>
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
    },
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
