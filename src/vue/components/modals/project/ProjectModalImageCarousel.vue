<template>
  <div class="project-modal-carousel" v-if="slides.length">
    <div class="project-modal-carousel-media">
      <ImageView
        :src="slides[currentIndex]"
        alt="Project preview image"
        imageClass="carousel-image"
        spinnerEnabled
        @click="openPreview"
        role="button"
        tabindex="0" />

      <button
        type="button"
        class="carousel-button prev"
        :disabled="isFirst"
        @click.stop="previousSlide"
        aria-label="Previous image">
        <i class="fa-solid fa-chevron-left" />
      </button>

      <button
        type="button"
        class="carousel-button next"
        :disabled="isLast"
        @click.stop="nextSlide"
        aria-label="Next image">
        <i class="fa-solid fa-chevron-right" />
      </button>
    </div>

    <div class="project-modal-carousel-pagination" v-if="slides.length > 1">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        type="button"
        :class="['carousel-dot', { active: index === currentIndex }]"
        @click="goTo(index)"
        :aria-label="`Go to image ${index + 1}`" />
    </div>

    <div
      v-if="isPreviewOpen"
      class="gallery-preview-overlay"
      @click.self="closePreview">
      <div class="gallery-preview-content">
        <button
          type="button"
          class="gallery-preview-close"
          @click="closePreview"
          aria-label="Close preview">
          <i class="fa-solid fa-xmark" />
        </button>
        <ImageView
          :src="slides[currentIndex]"
          alt="Expanded preview"
          imageClass="gallery-preview-image"
          spinnerEnabled />
        <div class="gallery-preview-controls">
          <button
            type="button"
            class="preview-button"
            :disabled="isFirst"
            @click="previousSlide">
            <i class="fa-solid fa-chevron-left" />
          </button>
          <button
            type="button"
            class="preview-button"
            :disabled="isLast"
            @click="nextSlide">
            <i class="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import ImageView from "/src/vue/components/widgets/ImageView.vue";

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
  fallbackImage: String,
});

const currentIndex = ref(0);

const slides = computed(() => {
  const sourceImages = Array.isArray(props.images)
    ? props.images.filter(Boolean)
    : [];
  if (sourceImages.length) {
    return sourceImages;
  }
  return props.fallbackImage ? [props.fallbackImage] : [];
});

const isFirst = computed(() => currentIndex.value === 0);
const isLast = computed(() => currentIndex.value === slides.value.length - 1);
const isPreviewOpen = ref(false);

const previousSlide = () => {
  if (!isFirst.value) {
    currentIndex.value--;
  }
};

const nextSlide = () => {
  if (!isLast.value) {
    currentIndex.value++;
  }
};

const goTo = (index) => {
  if (index >= 0 && index < slides.value.length) {
    currentIndex.value = index;
  }
};

const openPreview = () => {
  isPreviewOpen.value = true;
};

const closePreview = () => {
  isPreviewOpen.value = false;
};

watch(slides, () => {
  currentIndex.value = 0;
});
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.project-modal-carousel {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.project-modal-carousel-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  background-color: $default-section-background;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.45);
  color: $white;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
  z-index: 1;
}

.carousel-button:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.65);
}

.carousel-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.carousel-button.prev {
  left: 1rem;
}

.carousel-button.next {
  right: 1rem;
}

.project-modal-carousel-pagination {
  display: flex;
  justify-content: center;
  gap: 0.65rem;
  margin-top: 1rem;
}

.carousel-dot {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.carousel-dot.active {
  background: $white;
  transform: scale(1.15);
}

@media (max-width: 900px) {
  .project-modal-carousel-media {
    min-height: 200px;
  }

  .carousel-button {
    width: 2rem;
    height: 2rem;
  }
}

.gallery-preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 1050;
}

.gallery-preview-content {
  position: relative;
  width: min(95vw, 900px);
  aspect-ratio: 16 / 9;
  background: $default-section-background;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}

.gallery-preview-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: $white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

.gallery-preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background-color: black;
}

.gallery-preview-controls {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  pointer-events: none;
}

.preview-button {
  pointer-events: auto;
  border: none;
  background: rgba(0, 0, 0, 0.35);
  color: $white;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.preview-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
