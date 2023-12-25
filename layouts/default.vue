<template>
  <div class="app__wrapper">
    <WebGLScene />
    <Menu />
    <Cursor v-if="!isMobile"/>
    <!-- <Stat /> -->
    <Overlay />
    <div class="page__wrapper">
      <Preloader>
        <BufferPage />
      </Preloader>
    </div>
    <div class="over-webGL">
    </div>
  </div>
</template>

<script setup lang="ts">
import { RafPriority } from "~/plugins/core/raf";
import { useFlowProvider } from "~/waterflow/FlowProvider";
import BufferPage from "~/waterflow/components/BufferPage.vue";

const flowProvider = useFlowProvider();

const lenis = useStoreView().lenis;
const { isMobile } = useStore()

useRaf(
  (e) => {
    // !flowProvider.flowIsHijacked.value && 
    lenis.value.raf(e.elapsed);
  },
  RafPriority.FIRST
);

flowProvider.registerScrollInterface({
  resume: () => {
    lenis.value.start();
  },
  stop: () => {
    lenis.value.stop();
  },
  scrollToTop: () => {
    lenis.value.scrollTo("top", { immediate: true, force: true });
  },
});
// flowProvider.scrollFlow.scrollToTop = () => lenis.value.scrollTo("top", { immediate: true })
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.over-webGL {
  position: relative;
  z-index: 12;
}
</style>
