<template>
    <div class="project__landing__container" ref="wrapperRef">
        <div class="project__main-image" :data-src="COPY.main_image.src_1"></div>

        <div class="project__landing__wrapper" :class="{ show: fs }">
            <div class="title__wrapper" ref="titleWrapperRef">
                <h1
                    :style="{ justifyContent: (COPY.title.split(' ').length == 1) ? 'flex-end' : 'space-between', width: titleWidth }">
                    <span v-for="word in COPY.title.split(' ')" class="overflow">
                        <span v-for="char in word.split('')" class="overflow-content">
                            {{ char }}
                        </span>
                    </span>
                </h1>
                <h2>{{ COPY.type }}</h2>
                <h2>{{ COPY.date }}</h2>
            </div>
            <div class="lower-container">
                <p ref="lowerDesRef">
                    {{ COPY.description }}
                </p>

                <div class="project__main-image__next-placeholder" :data-src="COPY.main_image.src_2">
                </div>
            </div>
        </div>
    </div>
    <div class="pin-margin">
    </div>
</template>

<script lang="ts" setup>
import { useCanvasMainImageProject } from '~/scene/Components/Project/MainImage';
import { onFlow, onLeave } from '~/waterflow/composables/onFlow';
import { secondScrollEase } from "~/scene/Components/Project/MainImage"

const { id } = defineProps<{ id: string }>()

const { copy, landingHeaderScale } = useStoreProject()
const { isMobile } = useStore()
const { breakpoint, vw } = useStoreView()

const fs = useCanvasMainImageProject().firstScroll

let leave = false
onLeave(() => {
    leave = true
    N.Class.add(lowerDesRef.value, "leave")
})
const COPY = copy[id]

const wrapperRef = ref()

const lowerDesRef = ref() as Ref<HTMLElement>

const titleWrapperRef = ref() as Ref<HTMLElement>
let scale = 1

useLenisScroll((e) => {
    const size = 800
    const s = N.Clamp(e.animatedScroll, 0, size);

    const ease = secondScrollEase(s / size)
    scale = N.Lerp(1, 0.6, ease)

    if (breakpoint.value === "desktop") {
        titleWidth.value = `calc(100vw - 2.8rem - ${neutralGap * ease / 10}rem)`
        N.T(lowerDesRef.value, 0, e.animatedScroll, 'px');
    }
    landingHeaderScale.value = scale

    titleWrapperRef.value.style.transform = `translate3d(0px, ${e.animatedScroll}px, 0px) scale(${scale})`
})

onMounted(() => {
    // await nextTick()
    const el = N.get('.project__main-image', wrapperRef.value) as HTMLElement
    const next__el = N.get('.project__main-image__next-placeholder', wrapperRef.value) as HTMLElement
    const mainImage = useCanvasMainImageProject()
    mainImage.mountElement(el, next__el)
})

const tl = useTL()
onFlow(() => {
    const spans = N.getAll('h1 > span > span', wrapperRef.value)
    for (let i = 0; i < spans.length; i++) {
        const span = spans[i]
        tl.from({
            el: span,
            p: {
                y: [-100, 0]
            },
            e: 'o4',
            delay: i * 35,
            d: 500,
        })
    }
    tl.play()
})

onBeforeUnmount(() => {
    tl.pause()
})

const titleWidth = ref("calc(100vw - 2.8rem)")
let neutralGap = 1
useRO(({ scale: s }) => {
    const spans = N.getAll(".title__wrapper .overflow", wrapperRef.value)
    if (spans.length === 2) {
        const w = spans[1].getBoundingClientRect().width + spans[0].getBoundingClientRect().width + 40
        neutralGap = (vw.value - 28 * s - w / scale)
    }
})
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.project__landing__container {
    height: 100vh;
    width: 100%;

    position: relative;

    @include breakpoint(mobile) {
        height: unset;
    }

    // overflow: hidden;
}

.project__landing__wrapper {
    height: 100%;
    padding: 2.4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    row-gap: 2.4rem;

    transform: translateY(calc(var(--100vh) - 17.7rem * 0.8 - 2.4rem * 2));
    transition: transform 1000ms $easeInOutQuart;

    @include breakpoint(mobile) {
        padding: 1.6rem;
        transform: translateY(calc(var(--100vh) - 10.7rem * 0.8 - 1.6rem * 3));
        height: calc(100% - 1.6rem);
    }

    &.show {
        transform: translateY(0);

        @include breakpoint(mobile) {
            transform: translateY(2.4rem);
        }

        .title__wrapper {
            position: relative;
            transform-origin: top right;

            @include breakpoint(mobile) {
                transform: translate(0) !important;
            }

            h2 {
                transition: transform 1000ms 100ms $easeInOutQuart;
                transform: translateY(0);

                &:nth-child(3) {
                    transition: transform 1000ms 125ms $easeInOutQuart;
                    transform: translateY(0);
                }
            }
        }

        .lower-container {
            transform: translateY(0);
        }
    }

    .title__wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        @include breakpoint(mobile) {
            align-items: center;
        }

        h2 {
            transition: transform 1000ms 50ms $easeInOutQuart;
            transform: translateY(3rem);

            &:nth-child(3) {
                transition: transform 1000ms 0ms $easeInOutQuart;
                transform: translateY(5rem);
            }
        }

        h1 {
            justify-content: space-between;
            width: 100%;
            line-height: 85%;

            will-change: width;

            @include breakpoint(mobile) {
                flex-direction: column;
                padding-bottom: calc(0rem + env(safe-area-inset-bottom));
            }

            >span {
                justify-self: flex-end;
                justify-content: flex-end;
                display: flex;

                @include breakpoint(mobile) {
                    justify-content: center;
                    flex-wrap: wrap;
                }

                >span {
                    letter-spacing: -.177rem;
                }
            }

        }

        h2 {
            justify-content: flex-end;
        }

        h1,
        h2 {
            display: flex;
            text-align: justify;
            font-size: 17.7rem;
            line-height: 85%;
            letter-spacing: -.177rem;
            font-weight: 500;
            text-transform: uppercase;

            position: relative;

            width: calc(100vw - 2.8rem);
            right: -1rem;

            top: -0.5rem;

            @include breakpoint(mobile) {
                right: 0rem;
                justify-content: center !important;
                font-size: 6.2rem;
                font-weight: 500;
                line-height: 90%;
                letter-spacing: -0.068rem;
            }
        }

    }

    .lower-container {
        display: flex;
        justify-content: space-between;
        height: 100%;
        // max-height: 34.8rem;
        height: 100%;
        align-items: flex-end;

        transition: transform 1000ms 200ms $easeInOutQuart;
        transform: translateY(7rem);

        @include breakpoint(mobile) {
            flex-direction: column;
            justify-content: unset;
            row-gap: 3.2rem;
            height: unset;
            text-align: center;
        }

        p {
            width: 46.4rem;
            font-size: 2.4rem;
            // font-weight: 400;
            line-height: 2.7rem;
            letter-spacing: -.024rem;
            position: relative;

            @include breakpoint(mobile) {
                width: 100%;
                // prevent pin
                font-size: 2.2rem;
                line-height: 115%;
                transform: translate3d(0) !important;
            }

            &.leave {
                opacity: 0;
                transition: opacity 250ms;
            }
        }

        .project__main-image__next-placeholder {
            height: 100%;
            width: 54.6rem;
            border-radius: 4px;

            @include breakpoint(mobile) {
                width: 100%;
                // height: 32.8rem;
                height: calc(var(--100vh) - 40rem);
            }

        }
    }
}


.project__main-image {
    height: 24rem;
    width: 26.8rem;

    @include breakpoint(mobile) {
        height: 15rem;
        width: 16rem;
    }

    // min-height: 240px;
    // min-width: 268px;
    // max-width: 300px;

    position: absolute;
    top: calc(50vh - 5rem);
    left: 50%;
    transform: translate(-50%, -50%);
}

.pin-margin {
    // height: calc(800px + 3 * 0.9 * 17.7rem - 6.65 * 2.4rem + 122rem - 100vh);
    height: calc(800px + 3 * 0.9 * 17.7rem - 4.65 * 2.4rem + 122rem - var(--100vh));
    width: 20rem;

    @include breakpoint(mobile) {
        // height: calc(800px + 3 * 0.9 * 17.7rem - 4.65 * 2.4rem + 0 * 122rem - var(--100vh));
        display: none;
    }
}
</style>
