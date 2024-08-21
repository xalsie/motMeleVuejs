<template>
    <div>
        <h1>Importer une photo de la grille</h1>
        <form @submit.prevent="uploadImage">
            <input type="file" @change="onFileChange" />
            <button type="submit">Importer</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedFile: null,
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
            }
        },
    },
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
