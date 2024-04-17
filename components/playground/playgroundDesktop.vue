<template>
    <Teleport to="#cursorTeleport">
        <div class="archive-display-f" :style="{ transform: translate }" v-if="isMobile != true"
            :class="{ dark: pickerDark, show: showMore !== -1 }">
            {{ showMore !== -1 ? showMore : '' }}
        </div>
    </Teleport>

    <h1 :class="{ hide: menuHide }">
        playground
        ({{ copy.length }})
    </h1>
    <div class="placeholder__fixed-media__container">
        <div class="placeholder__fixed-media" v-for="( { src, ratio, height, width }, index) in copy" :data-src="src"
            :key="index" :style='{ aspectRatio: ratio, width: ratio > 1 ? "80rem" : "", height: ratio < 1 ? "100%" : ratio == 1 ? "70vh" : ""  }' ref="placeholderFixedRefs">
        </div>
    </div>
    <div class="placeholder-container" ref="placeholderContainerRef">
        <div class="placeholder" v-for="{ src, ratio } in copy" :data-src="src" :style="{ aspectRatio: ratio }"
            ref="placeholderRefs">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { usePlaygroundCanvas } from '~/scene/Pages/PlaygroundCanvas';

const { copy, containerHeight } = useStorePlayground()

const { mouseLag, vh } = useStoreView()
const { isMobile, menuHide } = useStore()
const { pickerDark } = useCursorStore()
const { showMore } = useStorePlayground()

const translate = computed(() => {
    return `translate(calc(${mouseLag.value.x}px - 50%), ${mouseLag.value.y}px)`
})


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

    transition: opacity 150ms;

    &.hide {
        opacity: 0;
    }

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
        pointer-events: none;

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
    margin: 1.6rem 1.6rem;
    height: calc(100% - 3.2rem);
    width: calc(100% - 3.2rem);

    pointer-events: none;
}

.placeholder__fixed-media {
    position: absolute;
    top: 0;
    left: 0;
    max-height: 100%;
    pointer-events: none;

    max-width: 100%;
    // min-height: 50%;

    @include breakpoint(mobile) {
        width: 100% !important;
        height: unset !important;
    }
}

.archive-display-f {
    position: fixed;
    z-index: 200;
    top: 0;
    left: 0;
    margin-top: calc(16px + 0.6rem);
    line-height: 100%;
    font-size: 1.1rem;
    opacity: 0;
    transition: opacity 300ms, color 350ms;
    color: white;

    &.show {
        opacity: 1;
    }

    &.dark {
        color: black
    }
}
</style>
