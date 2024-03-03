<template>
    <main ref="wrapperRef">
        <h1>
            playground
            (24)
        </h1>
        <div class="placeholder__fixed-media__container">
            <div class="placeholder__fixed-media" v-for="( { src, ratio, height, width }, index) in copy" :data-src="src"
                :key="index" :style='{ aspectRatio: ratio, height, width }' ref="placeholderFixedRefs">
            </div>
        </div>
        <div class="placeholder-container" ref="placeholderContainerRef">
            <div class="placeholder" v-for="  { src, ratio }   in   copy  " :data-src="src" :style="{ aspectRatio: ratio }"
                ref="placeholderRefs">
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { archiveFlowIn, defaultFlowOut } from '~/pages_transitions/default.transition';
import { usePlaygroundCanvas } from '~/scene/Pages/PlaygroundCanvas';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

const { breakpoint } = useStoreView()
const { copy, containerHeight } = useStorePlayground()

useResetLenis({ infinite: true, duration: 1 })

const playgroundCanvas = usePlaygroundCanvas()
const placeholderRefs = ref() as Ref<HTMLElement[]>
const placeholderFixedRefs = ref() as Ref<HTMLElement[]>
const placeholderContainerRef = ref() as Ref<HTMLElement>
onMounted(() => {
    for (let index = 0; index < placeholderRefs.value.length; index++) {
        const el = placeholderRefs.value[index]
        const fixed = placeholderFixedRefs.value[index]
        playgroundCanvas.addMedia(el, fixed)
    }
})

useRO(({ scale }) => {
    containerHeight.value = placeholderContainerRef.value.getBoundingClientRect().height + 16 * scale
})

const wrapperRef = ref() as Ref<HTMLElement>

usePageFlow({
    props: { wrapperRef },
    flowOut: defaultFlowOut,
    flowInCrossfade: archiveFlowIn,
    enableCrossfade: 'TOP'
})


</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

h1 {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(calc(-50% - 0.8rem), -50%);
    font-size: 24.3rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: -1rem;
    line-height: 90%;

    @include breakpoint(mobile) {
        font-size: 5.79rem;
        letter-spacing: -0.1rem;
        line-height: 90%;
    }
}

.placeholder-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    width: calc(50rem + 1.6rem);
    row-gap: 1.6rem;
    left: 50%;
    transform: translateX(-50%);

    .placeholder {
        width: 25rem;
        // height: 20rem;
        pointer-events: none;
        // background-color: #E5E5E5;

        &:nth-child(2n) {
            align-self: flex-end;
        }

        &:nth-child(2n + 1) {
            align-self: flex-start;
        }
    }

    @include breakpoint(mobile) {
        padding: 0 1.6rem;
        column-gap: .6rem;
        width: 100%;


        .placeholder {
            width: 50%;
        }

    }
}

.placeholder__fixed-media__container {
    position: fixed;
    margin: 1.6rem;
    height: calc(100% - 3.2rem);
    width: calc(100% - 3.2rem);

    pointer-events: none;
}

.placeholder__fixed-media {
    position: absolute;
    top: 0;
    left: 0;
    // background-color: bisque;
    max-height: 100%;
    pointer-events: none;

    @include breakpoint(mobile){
        width: 100%!important;
        height: unset!important;
    }
}
</style>

