<template>
    <div class="w-1/2">
        <h2 class="text-2xl font-bold mb-4">
            Grille analysée :
        </h2>
        <table class="table">
            <tbody>
                <tr v-for="(row, rowIndex) in grid" :key="row">
                    <td v-for="(letter, letterIndex) in row" :key="letter" class="m-0 p-0">
                        <input type="text" class="form-control m-0 p-0 bg-zinc-900 text-gray-100" :value="letter"
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
                            "/>
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
