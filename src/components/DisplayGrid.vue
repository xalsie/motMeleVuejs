<template>
    <div>
        <h2>
            Grille importée :
        </h2>
        <table class="table">
            <tbody>
                <tr v-for="(row, rowIndex) in grid" :key="row">
                    <td v-for="(letter, letterIndex) in row" :key="letter">
                        <input type="text" class="form-control" :value="letter"
                            :data-x="rowIndex"
                            :data-y="letterIndex"
                            style="width: 20px; height: 20px; text-align: center; font-size: 15px; font-weight: bold;"/>
                    </td>
                </tr>
            </tbody>
        </table>
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
