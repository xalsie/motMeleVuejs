<template>
    <div class="image-select-areas" :style="rootStyle">
        <img
            :src="url"
            ref="image"
            :style="imageStyles"
            :width="width"
            :height="height"
            @load="onImageLoaded"
        />
        <div
            ref="overlay"
            class="overlay"
            :style="overlayStyles"
            @mousedown.self="onMouseDown"
            @mousemove.self="onMouseMoveDebounced"
            @mouseup.self="onMouseUp"
        />
        <div
            v-if="isCurrentlyDrawing"
            ref="currentlyDrawing"
            :style="currentlyDrawingStyles"
        />
        <div
            v-for="(area, index) in areas"
            :key="`area-${index}`"
            :class="['area', { selected: currentlySelectedIndex === index }]"
            :style="areaStyles(area)"
            :data-index="index"
        >
            <slot name="toolbar" v-bind="{ area, index }">
                <template v-if="removable">
                    <div class="toolbar">
                        <button
                            class="edit"
                            @click="onEditLabel(index)"
                            title="Edit name"
                        >
                            🏷
                        </button>
                        <button
                            class="delete"
                            @click="onDeleteArea(index)"
                            title="Remove"
                        >
                            🗑
                        </button>
                    </div>
                </template>
            </slot>
            <slot name="default" v-bind="{ area, index }" />
        </div>
    </div>
</template>

<script>
import interact from "interactjs";

// https://stackoverflow.com/a/65081210/1223692
/**
 * @param {function} func
 * @param {number} wait
 * @param {boolean} immediate
 */
const debounce = (func, wait, immediate) => {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export default {
    name: "image-select-areas",

    props: {
        url: {
            type: String,
            required: false,
            default: "",
        },
        width: {
            type: [String, Number],
            default: "100%",
        },
        height: {
            type: [String, Number],
            default: "100%",
        },
        value: {
            type: Array,
            default: () => [],
        },
        removable: {
            type: Boolean,
            default: false,
        },
    },

    data: () => ({
        areas: [],
        currentlySelectedIndex: null,
        isCurrentlyDrawing: false,
        currentlyDrawing: {},
    }),

    watch: {
        areas(newAreas) {
            this.$emit("input", newAreas);
        },
        value(newAreas, oldAreas) {
            if (JSON.stringify(newAreas) === JSON.stringify(oldAreas)) {
                return;
            }

            this.areas = newAreas.map((area) =>
                this.computeExistingAreaSizes(area, this.$refs.image)
            );
        },
    },

    computed: {
        rootStyle() {
            return {
                position: "relative",
                display: "inline-block",
            };
        },
        styles() {
            return {
                width: this.width,
                height: this.height,
            };
        },
        imageStyles() {
            return {
                width: this.width,
                height: this.height,
            };
        },
        overlayStyles() {
            return {
                ...this.styles,
                position: "absolute",
                top: 0,
                left: 0,
                cursor: "crosshair",
                zIndex: this.isCurrentlyDrawing ? 5 : 2,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
            };
        },
        currentlyDrawingStyles() {
            return {
                ...this.areaStyles(this.currentlyDrawing),
                backgroundColor: "blue",
            };
        },
    },

    created() {
        this.resetCurrentlyDrawing();
        this.onMouseMoveDebounced = debounce(this.onMouseMove, 10);
    },

    methods: {
        onImageLoaded(event) {
            this.areas = this.value.map((area) =>
                this.computeExistingAreaSizes(area, this.$refs.image)
            );
            this.bindInteractionEvents();
        },
        bindInteractionEvents() {
            const interaction = interact(".area");

            const restrictToParent = interact.modifiers.restrict({
                restriction: "parent",
                elementRect: { left: 0, right: 1, top: 0, bottom: 1 },
            });
            interaction.draggable({
                modifiers: [restrictToParent],
                listeners: {
                    start: (event) => {},
                    move: (event) => {
                        const image = this.$refs.image;
                        const areaIndex =
                            event.target.getAttribute("data-index");
                        const area = this.areas[areaIndex];
                        area.top += event.dy;
                        area.left += event.dx;

                        area.relativeWidth = event.rect.width / image.width;
                        area.relativeHeight = event.rect.height / image.height;
                        area.relativeX = area.left / image.width;
                        area.relativeY = area.top / image.height;
                    },
                },
            });
            interaction.resizable({
                edges: { top: true, left: true, bottom: true, right: true },
                modifiers: [interact.modifiers.restrictSize({ max: "parent" })],
                listeners: {
                    move: (event) => {
                        const image = this.$refs.image;
                        const imageBounding = image.getBoundingClientRect();
                        const areaIndex =
                            event.target.getAttribute("data-index");
                        const area = this.areas[areaIndex];

                        // X and Y positions relative to the parent (the image)
                        const relX = event.rect.left - imageBounding.left;
                        const relY = event.rect.top - imageBounding.top;

                        area.width = event.rect.width;
                        area.height = event.rect.height;
                        area.top = relY;
                        area.left = relX;
                        area.relativeWidth = event.rect.width / image.width;
                        area.relativeHeight = event.rect.height / image.height;
                        area.relativeX = relX / image.width;
                        area.relativeY = relY / image.height;
                    },
                },
            });
        },
        areaStyles(area) {
            return {
                position: "absolute",
                top: `${area.top}px`,
                left: `${area.left}px`,
                border: "1px dashed gray",
                backgroundColor: "green",
                zIndex: 3,
                width: `${area.width}px`,
                height: `${area.height}px`,
                opacity: 0.5,
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
            };
        },
        computeExistingAreaSizes(area, image) {
            const newArea = {
                width: image.width * area.relativeWidth,
                height: image.height * area.relativeHeight,
                left: image.width * area.relativeX,
                top: image.height * area.relativeY,
            };

            // return area;
            return {
                ...area,
                ...newArea,
            };
        },
        resetCurrentlyDrawing() {
            this.currentlyDrawing = {
                left: null,
                top: null,
                startX: null,
                startY: null,
                width: null,
                height: null,
                relativeWidth: null,
                relativeHeight: null,
                relativeX: null,
                relativeY: null,
            };
        },

        /**
         * AREA DRAWING
         */
        onMouseDown(event) {
            const bounding = event.target.getBoundingClientRect();
            const x = event.clientX - bounding.left;
            const y = event.clientY - bounding.top;

            // If we're already drawing it could be a sign that the mouse has gone outside the overlay. In that case we can
            // just endit when we return and click again.
            if (this.isCurrentlyDrawing) {
                this.isCurrentlyDrawing = false;
                return;
            }

            this.currentlyDrawing.left = this.currentlyDrawing.startX = x;
            this.currentlyDrawing.top = this.currentlyDrawing.startY = y;

            this.isCurrentlyDrawing = true;
        },
        onMouseUp(event) {
            // Don't trigger on other mouse buttons than left
            if (event.button !== 0) {
                return;
            }

            // si il y a deja 2 zone alors on ne peut plus en ajouter
            // if (this.areas.length === 2) {
            //     // delete
            //     alert("You can't add more than 2 areas");
            //     return;
            // }

            const image = this.$refs.image;
            const overlayBounding = this.$refs.overlay.getBoundingClientRect();
            const bounding =
                this.$refs.currentlyDrawing.getBoundingClientRect();
            const x = bounding.left - overlayBounding.left;
            const y = bounding.top - overlayBounding.top;

            this.currentlyDrawing.relativeWidth =
                this.currentlyDrawing.width / image.width;
            this.currentlyDrawing.relativeHeight =
                this.currentlyDrawing.height / image.height;
            this.currentlyDrawing.relativeX = x / image.width;
            this.currentlyDrawing.relativeY = y / image.height;

            delete this.currentlyDrawing.startX;
            delete this.currentlyDrawing.startY;

            this.isCurrentlyDrawing = false;
            this.areas.push(this.currentlyDrawing);
            this.$emit("added", this.currentlyDrawing);
            this.resetCurrentlyDrawing();
        },
        onMouseMove(event) {
            if (!this.isCurrentlyDrawing) {
                return;
            }

            const bounding = event.target.getBoundingClientRect();
            const imageX = event.clientX - bounding.left;
            const imageY = event.clientY - bounding.top;
            const padding = 3;

            // Width of current selection, when regular left to right
            const width = imageX - this.currentlyDrawing.startX;
            const height = imageY - this.currentlyDrawing.startY;

            this.currentlyDrawing.width = width - padding;
            this.currentlyDrawing.height = height - padding;

            if (imageY < this.currentlyDrawing.startY) {
                this.currentlyDrawing.top = imageY + padding;
                this.currentlyDrawing.height =
                    this.currentlyDrawing.startY - imageY;
            }

            if (imageX < this.currentlyDrawing.startX) {
                this.currentlyDrawing.left = imageX + padding;
                this.currentlyDrawing.width =
                    this.currentlyDrawing.startX - imageX;
            }
        },

        onDeleteArea(index) {
            this.areas.splice(index, 1);
        },
        onEditLabel(index) {
            const area = this.areas[index];
            const label = prompt("Label", area?.label || "");
            this.areas.splice(index, 1, {
                ...area,
                label,
            });
        },
    },
};
</script>

<style scoped>
.area.selected {
    border: 2px dashed black !important;
    cursor: pointer;
}
.area {
    position: relative;
}
.area .toolbar {
    position: absolute;
    top: 5px;
    right: 5px;
}
.area .toolbar button {
    border-radius: 3px;
    padding: 3px;
}
.area .toolbar .delete {
    background-color: gray;
}
</style>
