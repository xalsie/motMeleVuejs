<template>
    <div class="flex flex-col items-center">
        <div class="">
            <h1 class="text-2xl font-bold">{{ title }}</h1>
            <p class="text-sm text-gray-500">
                Formats acceptés: .jpg, .jpeg, .png
            </p>
        </div>
        <div class="">
            <input type="file" @change="onFileChange" />
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

            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.$emit("image-imported", e.target.result);
                };
                reader.readAsDataURL(file);
            }
        },
    },
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
