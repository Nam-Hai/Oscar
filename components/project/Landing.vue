<template>
    <div class="project__landing__container" ref="wrapperRef">
        <div class="project__main-image" :data-src="COPY.main_image.src_1"></div>

        <div class="project__landing__wrapper" :class="{ show: firstScroll }">
            <div class="title__wrapper" ref="titleWrapperRef">
                <h1 :style="{ justifyContent: (COPY.title.split(' ').length == 1) ? 'flex-end' : 'space-between' }">
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
                    VIADOMO©DECO boasts an innovative collection of top-tier furniture, reshaping the definition of luxury
                    and sophistication.
                </p>

                <div class="project__main-image__next-placeholder" :data-src="COPY.main_image.src_2">
                </div>
            </div>


        </div>
    </div>
    <div class="pin-margin" style="height: calc(800px + 3 * 0.9 * 17.7rem - 6.65 * 2.4rem); width: 20rem;">
    </div>
</template>

<script lang="ts" setup>
import { useCanvasMainImageProject } from '~/scene/Components/Project/MainImage';
import { useFlowProvider } from '~/waterflow/FlowProvider';
import { onFlow } from '~/waterflow/composables/onFlow';

const { id } = defineProps<{ id: string }>()

const { copy, firstScroll, landingHeaderScale } = useStoreProject()
const COPY = copy[id]

const wrapperRef = ref()

const lowerDesRef = ref() as Ref<HTMLElement>

const titleWrapperRef = ref() as Ref<HTMLElement>
useLenisScroll((e) => {
    const size = 800
    const s = N.Clamp(e.animatedScroll, 0, size);
    const scale = N.Lerp(1, 0.6, s / size)
    landingHeaderScale.value = scale
    titleWrapperRef.value.style.transform = `translateY(${s}px) scale(${scale}) `
    N.T(lowerDesRef.value, 0, e.animatedScroll, 'px');
})

onFlow(() => {
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
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.project__landing__container {
    height: 100vh;
    width: 100%;

    position: relative;

    // overflow: hidden;
}

.project__landing__wrapper {
    height: 100%;
    padding: 2.4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    row-gap: 2.4rem;

    transform: translateY(calc(100vh - 17.7rem * 0.8 - 2.4rem * 2));
    transition: transform 1000ms $easeInOutQuart;

    &.show {
        transform: translateY(0);

        .title__wrapper {
            transform-origin: top right;

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

            >span {
                justify-self: flex-end;
                justify-content: flex-end;
                display: flex;

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
            line-height: 90%;
            letter-spacing: -.177rem;
            font-weight: 500;
            text-transform: uppercase;

            position: relative;

            width: calc(100vw - 2.8rem);
            right: -1rem;

            top: -0.5rem;
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

        p {
            width: 46.4rem;
            font-size: 2.4rem;
            font-weight: 400;
            line-height: 2.7rem;
            letter-spacing: -.024rem;

            // position: fixed;
        }

        .project__main-image__next-placeholder {
            height: 100%;
            width: 54.6rem;
            // background-color: rgba(255, 0, 0, 0.189);
            border-radius: 4px;

        }
    }
}


.project__main-image {
    height: 24rem;
    width: 26.8rem;
    // background-color: rgba(128, 128, 128, 0.224);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
