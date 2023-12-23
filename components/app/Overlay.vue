<template>
    <div class="overlay__wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 7.75" ref="wrapperRef" preserveAspectRatio="none">
            <path d="M 0 0 C 6 1 8 1 14 0 L 14 7 C 8 8 6 8 0 7 L 0 0" fill="currentColor" />
        </svg>
    </div>
</template>

<script lang="ts" setup>
import { useFlowProvider } from '~/waterflow/FlowProvider';

const wrapperRef = ref()
const flowProvider = useFlowProvider()
flowProvider.addProps("overlay", wrapperRef)

</script>
<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.overlay__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;

    z-index: 200000;
    pointer-events: none;
    // opacity: 0;
    color: $placeholder-grey;

    svg {
        transform: translateY(-100%);
        // position: relative;
        // display: block;
        height: 140vh;
        width: 100vw;
        // transform: scaleY(2);
    }
}
</style>

