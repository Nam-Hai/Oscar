<template>
    <div ref="wrapperRef" class="archive__wrapper">
        <ArchiveMedia v-for="(data, index) in COPY" :index="index" :data="data" :key="`archive-media-${index}`" />

        <div class="archive__number__wrapper">

            <div class="archive__number" ref="numberRef" :class="{ hover: isHover }">
                <span v-for="char in N.ZL(COPY.length)">{{ char }}</span>
                <div class="archive__number__buffer">
                    <span v-for="char in currentIndexDisplay">{{ char }}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="archive__display-image" ref="displayRef">
        <img :src="copy.src" alt="archive__display-image" v-for="(copy, index) in COPY" :key="`archive-display-${index}`"
            :class="{ show: hoverIndex == index, horizontal: copy.imageDirection }">
    </div>

    <div class="archive__mouse-text__wrapper" :style="{ transform: translate }" :class="{ show: isHover }">
        <div>{{ hoverCopy.text.title }}</div>
        <div>{{ hoverCopy.text.category }}</div>
        <div>{{ hoverCopy.text.source }}</div>
    </div>
</template>

<script lang="ts" setup>
import { useStoreArchive } from '~/composables/useStoreArchive';

const { COPY, hoverCopy, isHover, hoverIndex, currentIndexDisplay } = useStoreArchive()

// const { client } = usePrismic()
// const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

useResetLenis()

const wrapperRef = ref() as Ref<HTMLElement>
const numberRef = ref()
const displayRef = ref()

usePin({
    el: numberRef,
    startRem: 2.4,
    eStart: 100,
    start: 100
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

}

.archive__number__wrapper {
    position: absolute;
    top: calc(100vh - 2.4rem - 3.2rem);
    // bottom: 2.4rem;
    right: 2.4rem;
    text-align: right;
    font-size: 3.2rem;
    font-weight: 400;
    line-height: 90%;
    letter-spacing: -.032rem;
    text-transform: uppercase;


    .archive__number {
        position: absolute;
        bottom: 0;
        right: 0;
        overflow: hidden;
        display: flex;

        &.hover {
            .archive__number__buffer {
                span {
                    transform: translateY(0%);

                    &:first-child {
                        transition: transform 400ms 0ms $easeOutQuart;
                    }

                    &:nth-child(2) {
                        transition: transform 400ms 100ms $easeOutQuart;
                    }
                }
            }

            >span {

                transform: translateY(-100%);

                &:first-child {
                    transition: transform 400ms 0ms $easeOutQuart;
                }

                &:nth-child(2) {
                    transition: transform 400ms 100ms $easeOutQuart;
                }
            }
        }

        span {
            display: inline-block;
            position: relative;
        }

        >span {
            transform: translateY(0%);

            &:first-child {
                transition: transform 150ms 0ms $easeOutQuart;
            }

            &:nth-child(2) {
                transition: transform 150ms 50ms $easeOutQuart;
            }
        }

        &__buffer {
            position: absolute;

            span {
                transform: translateY(100%);

                &:first-child {
                    transition: transform 150ms 0ms $easeOutQuart;
                }

                &:nth-child(2) {
                    transition: transform 150ms 50ms $easeOutQuart;
                }
            }
        }
    }
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
    z-index: 3;

    &.show {
        div {
            opacity: 1;

        }
    }

    div {
        opacity: 0;
    }
}

.archive__display-image {
    position: fixed;
    top: 0;
    left: 0;
    margin: 2.4rem;
    height: calc(100vh - 4.8rem);
    width: calc(100vw - 4.8rem);
    pointer-events: none;
    z-index: 1;

    img {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        max-height: 100%;
        max-width: 100%;
        object-fit: cover;
        background-color: $placeholder-grey;


        &.horizontal {
            height: 53.5rem;
            flex-shrink: 0;
        }

        &.show {
            opacity: 1;
        }
    }
}
</style>

