<template>
    <div class="project__wrapper" ref="wrapperRef">
        <Landing />
        <div style="height: 20rem; width: 20rem; background-color: red;"></div>
    </div>
</template>

<script lang="ts" setup>
import { useFlowProvider } from '~/waterflow/FlowProvider';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { defaultFlowOut, defaultFlowIn } from '../default.transition';

// const { client } = usePrismic()
// const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

const route = useFlowProvider().getRouteTo()
const id = route.params.id ? route.params.id[0] : 'viadomo-deco'

const { firstScroll } = useStoreProject()
const wrapperRef = ref() as Ref<HTMLElement>
useResetLenis()

firstScroll.value = false

useLenisScroll((e) => {
    const lenis = useLenis()
    if (!firstScroll.value && e.velocity > 0) {
        lenis.stop()

        firstScroll.value = true
        useDelay(1000, () => {
            lenis.start()
        })
    }
    if (e.direction < 0 && e.animatedScroll <= 0) {
        // lenis.stop();

        firstScroll.value = false
        // useDelay(1000, () => {
        //     lenis.start();
        // })
    }
})


usePageFlow({
    props: {},
    flowOut: defaultFlowOut,
    flowInCrossfade: defaultFlowIn,
    enableCrossfade: 'BOTTOM'
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.project__wrapper {
    font-size: 40rem;
    line-height: 100%;

    min-height: 100vh;
    width: 100vw;

    overflow: hidden;

    .project__landing__wrapper {
        height: 100vh;
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
                    transform: translateY(0);

                    &:nth-child(3) {
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
                transition: transform 1000ms 100ms $easeInOutQuart;
                transform: translateY(3rem);

                &:nth-child(3) {
                    transition: transform 1000ms 125ms $easeInOutQuart;
                    transform: translateY(5rem);
                }
            }

            h1,
            h2 {
                width: calc(100vw - 4.8rem);
                text-align: right;
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
                background-color: rgba(255, 0, 0, 0.189);
                border-radius: 4px;

            }
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
