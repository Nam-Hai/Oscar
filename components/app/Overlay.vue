<template>
    <div class="overlay__wrapper" ref="wrapperRef">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 4">
            <path d="M 0 0 C 6 0 8 0 14 0 L 14 4 C 8 4 6 4 0 4 L 0 0" fill="#ff0066" />
            <!-- <path d="m 0 0 c 5 1 9 1 14 0 l 0 4 c -5 2 -9 2 -14 0 l 0 -4" fill="#ff0066" /> -->
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
    // transform: translateY(-100%);

    z-index: 200000;
    pointer-events: none;
    opacity: 0;

    svg {
        position: relative;
        display: block;
        // height: 100vh;
        // width: 100vw;
        // transform: scaleY(2);
    }
}
</style>

