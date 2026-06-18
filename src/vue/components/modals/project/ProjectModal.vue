<template>
  <Modal
    id="project-modal"
    modalType="modal-xl fade"
    dialogType="modal-dialog-centered"
    :visible="Boolean(props.item)"
    :dismissable="true"
    @close="_onClose">
    <div v-if="item" class="project-modal-content-wrapper">
      <div class="project-modal-left-column">
        <IconView
          class="project-modal-icon-view"
          ref="iconView"
          :img="item?.img"
          :fa-icon="item?.fallbackFaIcon"
          :background-color="item?.fallbackFaIconColor"
          :prioritize-image="true"
          :transparency="!item" />

        <ProjectModalImageCarousel
          :images="imageGallery"
          :fallback-image="item?.img"
          class="project-modal-image-carousel" />
      </div>

      <div class="project-modal-right-column">
        <ProjectModalContent :item="item" />
      </div>
    </div>
  </Modal>
</template>

<script setup>
import Modal from "/src/vue/components/modals/base/Modal.vue";
import IconView from "/src/vue/components/widgets/IconView.vue";
import ProjectModalContent from "/src/vue/components/modals/project/ProjectModalContent.vue";
import ProjectModalImageCarousel from "/src/vue/components/modals/project/ProjectModalImageCarousel.vue";
import { computed } from "vue";

const props = defineProps({
  /** @type {ArticleItem} **/
  item: {
    type: Object,
    required: false,
  },
});

const imageGallery = computed(() => {
  const gallery = props.item?.gallery || [];
  if (!Array.isArray(gallery)) {
    return [];
  }
  return gallery.filter(Boolean);
});

const emit = defineEmits(["close"]);

const _onClose = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

div.project-modal-content-wrapper {
  display: flex;
  width: 100%;

  @include generate-dynamic-styles-with-hash(
    (
      xxxl: (
        flex-direction: row,
        padding: 3.5rem 3.5rem,
      ),
      xxl: (
        flex-direction: row,
        padding: 3rem 3rem,
      ),
      xl: (
        flex-direction: row,
        padding: 2.5rem 2.5rem,
      ),
      lg: (
        flex-direction: column,
        padding: 2.25rem,
        align-items: center,
      ),
      md: (
        padding: 2rem,
      ),
      sm: (
        padding: 1.5rem,
      ),
    )
  );
}

div.project-modal-icon-view {
  border-radius: 25%;
  overflow: hidden;
  user-select: none;
  pointer-events: none;

  --dimension: 250px;
  --margin: 0 1rem 0 0;
  @include media-breakpoint-down(xxl) {
    --dimension: 200px;
  }
  @include media-breakpoint-down(xl) {
    --dimension: 210px;
    --margin: 0 2.5rem 0 0;
  }
  @include media-breakpoint-down(lg) {
    --dimension: min(200px, 35vw);
    --margin: 0 0 1rem 0;
  }
  @include media-breakpoint-down(sm) {
    --dimension: clamp(130px, 37vw, 170px);
  }

  height: var(--dimension);
  width: var(--dimension);
  min-width: var(--dimension);
  font-size: calc(var(--dimension) / 2);
  margin: var(--margin);
}

.project-modal-left-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 1rem;
  margin-right: 1rem;
  min-width: 240px;
  max-width: 280px;
}

.project-modal-image-carousel {
  width: auto;
  max-width: 280px;
  margin: 1rem auto 0;
  overflow: hidden;
  box-sizing: border-box;
}

.project-modal-right-column {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1200px) {
  div.project-modal-content-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .project-modal-left-column,
  .project-modal-right-column {
    width: 100%;
    max-width: none;
  }

  .project-modal-image-carousel {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    width: 100%;
    max-width: 100%;
    aspect-ratio: 16 / 9;
  }
}
</style>
