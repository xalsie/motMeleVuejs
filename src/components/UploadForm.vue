<template>
    <div class="flex flex-col items-center">
        <div class="">
            <h1 class="text-2xl font-bold">{{ title }}</h1>
            <p class="text-sm text-gray-500">Formats acceptés: .jpg, .jpeg, .png</p>
        </div>
        <div class="">
            <form v-if="!isLoading" @submit.prevent="uploadImage">
                <input type="file" @change="onFileChange" />
                <button type="submit">Importer</button>
            </form>
            <div v-else>
                <p><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" rx="1" width="10" height="10"><animate id="spinner_c7A9" begin="0;spinner_23zP.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze"/><animate id="spinner_Acnw" begin="spinner_ZmWi.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze"/><animate id="spinner_iIcm" begin="spinner_zfQN.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze"/><animate id="spinner_WX4U" begin="spinner_rRAc.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze"/></rect><rect x="1" y="13" rx="1" width="10" height="10"><animate id="spinner_YLx7" begin="spinner_c7A9.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze"/><animate id="spinner_vwnJ" begin="spinner_Acnw.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze"/><animate id="spinner_KQuy" begin="spinner_iIcm.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze"/><animate id="spinner_arKy" begin="spinner_WX4U.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze"/></rect><rect x="13" y="13" rx="1" width="10" height="10"><animate id="spinner_ZmWi" begin="spinner_YLx7.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze"/><animate id="spinner_zfQN" begin="spinner_vwnJ.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze"/><animate id="spinner_rRAc" begin="spinner_KQuy.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze"/><animate id="spinner_23zP" begin="spinner_arKy.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze"/></rect></svg></p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "UploadForm",
    props: {
        title: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            selectedFile: null,
            isLoading: false,
        };
    },
    methods: {
        onFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        async uploadImage() {
            if (!this.selectedFile) {
                alert("Veuillez sélectionner un fichier.");
                return;
            }

            const formData = new FormData();
            formData.append("image", this.selectedFile);

            this.isLoading = true;

            try {
                const response = await fetch("/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de l'importation de l'image.");
                }

                const result = await response.json();

                this.$emit("image-imported", result.fileUrl);
                this.$emit("grid-imported", result.grid);

                console.log(result.message, result.fileUrl);
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
