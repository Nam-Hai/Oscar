<template>
    <div ref="wrapperRef" class="archive__wrapper">
        <ArchiveMedia v-for="data in COPY" :data="data" />

        <div class="archive__number">12</div>
    </div>

    <div class="archive__display-image" :class="{ show: isHover }">
        <img :src="hoverCopy.src" alt="archive__display-image">
    </div>

    <div class="archive__mouse-text__wrapper" :style="{ transform: translate }" :class="{ show: isHover }">
        <div>{{ hoverCopy.text.title }}</div>
        <div>{{ hoverCopy.text.category }}</div>
        <div>{{ hoverCopy.text.source }}</div>
    </div>
</template>

<script lang="ts" setup>
import { useStoreArchive } from '~/composables/useStoreArchive';
import { defaultFlowIn, defaultFlowOut } from '~/pages_transitions/default.transition';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

const { COPY, hoverCopy, isHover } = useStoreArchive()

// const { client } = usePrismic()
// const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

useResetLenis()

const wrapperRef = ref() as Ref<HTMLElement>

usePageFlow({
    props: { wrapperRef },
    flowOut: defaultFlowOut,
    flowInCrossfade: defaultFlowIn,
    enableCrossfade: 'TOP'
})

const { mouse } = useStoreView()

const translate = computed(() => {
    return `translate(${mouse.value.x}px, ${mouse.value.y}px)`
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.archive__wrapper {

    min-height: 100vh;
    width: 100vw;
    color: $black;

    padding-top: 18rem;
    padding-bottom: 18rem;

    .archive-media {}
}

.archive__number {
    position: fixed;
    bottom: 2.4rem;
    right: 2.4rem;
    text-align: right;
    font-size: 3.2rem;
    font-weight: 400;
    line-height: 90%;
    letter-spacing: -.032rem;
    text-transform: uppercase;
}

.archive__mouse-text__wrapper {

    padding-top: 28px;
    margin-left: -14px;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    row-gap: 0.6rem;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1rem;

    pointer-events: none;

    &.show {
        div {
            opacity: 1;

        }
    }

    div {
        opacity: 0;
        // transition: opacity 500ms;

        &:nth-child(2) {
            // transition-delay: 20ms;
        }

        &:nth-child(3) {
            // transition-delay: 40ms;
        }
    }
}

.archive__display-image {
    position: fixed;
    top: 0;
    left: 0;
    padding: 2.4rem;
    height: 100vh;
    width: 100vw;
    pointer-events: none;
    opacity: 0;

    &.show {
        opacity: 1;
    }

    img {
        height: 100%;
        min-height: 100%;
        object-fit: cover;
        background-color: $placeholder-grey;
    }
}
</style>

