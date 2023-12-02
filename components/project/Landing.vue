<template>
    <div class="project__landing__container" ref="wrapperRef">
        <div class="project__main-image" data-src="/Assets/Home1.png"></div>

        <div class="project__landing__wrapper" :class="{ show: firstScroll }">
            <div class="title__wrapper">
                <h1 :style="{ justifyContent: (COPY.title.split(' ').length == 1) ? 'flex-end' : 'space-between' }"><span
                        v-for="  word   in   COPY.title.split(' ')  ">{{ word }}</span></h1>
                <h2>{{ COPY.type }}</h2>
                <h2>{{ COPY.date }}</h2>
            </div>
            <div class="lower-container">
                <p>
                    VIADOMO©DECO boasts an innovative collection of top-tier furniture, reshaping the definition of luxury
                    and sophistication.
                </p>

                <div class="project__main-image__next-placeholder">
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { useCanvasMainImageProject } from '~/scene/Components/Project/MainImage';
import { useFlowProvider } from '~/waterflow/FlowProvider';

const route = useFlowProvider().getRouteTo()
const id = route.params.id ? route.params.id[0] : 'viadomo-deco'

const { copy, firstScroll } = useStoreProject()
const COPY = copy[id]

const wrapperRef = ref()

onMounted(() => {
    const el = N.get('.project__main-image', wrapperRef.value) as HTMLElement
    const next__el = N.get('.project__main-image__next-placeholder', wrapperRef.value) as HTMLElement
    const mainImage = useCanvasMainImageProject()
    mainImage.mountElement(el, next__el)
})
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.project__landing__container {
    height: 100vh;
    width: 100%;

    position: relative;

    overflow: hidden;
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

            span {
                justify-self: ﬂex-end;
            }
        }

        h2 {
            justify-content: flex-end;
        }

        h1,
        h2 {
            display: flex;
            width: calc(100vw - 4.8rem);
            text-align: justify;
            font-size: 17.7rem;
            line-height: 80%;
            letter-spacing: -.177rem;
            font-weight: 500;
            text-transform: uppercase;

            position: relative;
            right: -1rem;
        }

    }

    .lower-container {
        display: flex;
        justify-content: space-between;
        height: 100%;
        max-height: 34.8rem;
        align-items: flex-end;

        transition: transform 1000ms 200ms $easeInOutQuart;
        transform: translateY(7rem);

        p {
            width: 46.4rem;
            font-size: 2.4rem;
            font-weight: 400;
            line-height: 2.7rem;
            letter-spacing: -.024rem;
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
