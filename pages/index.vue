<template>
    <main ref="mainRef">
        <div class="index-container" v-for="(data, index) in homeStore" :key="data.title + '_' + index">
            <h1 class="text-anime__wrapper" v-html="data.titleHTML" ref="titleRefs"></h1>

            <div class="flavor">
                <div class="flavor-main">
                    {{ data.flavorMain }}
                </div>
                <div class="flavor-sub">
                    <div v-for="text in data.flavorSub">{{ text }}</div>
                </div>
            </div>
        </div>

        <Stepper />
    </main>
</template>

<script lang="ts" setup>
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { defaultFlowIn, defaultFlowOut } from './default.transition';

const mainRef = ref()
const { homeStore, currentIndex } = useStoreStepper()

const tls = homeStore.map(() => {
    return useTL()
})

onMounted(() => {
    const i = currentIndex.value
    const tl = tls[i]
    tl.reset()
    const title = titleRefs.value[i]
    const spans = N.getAll(".overflow-content", title)!
    for (const [index, char] of spans.entries()) {
        tl.from({
            el: char,
            d: 700,
            delay: 30 * index,
            e: 'o4',
            p: {
                y: [-100, 0]
            }
        })
    }
    tl.play()
})

watch(currentIndex, (i, old) => {
    const tl = tls[i]
    tl.reset()
    const title = titleRefs.value[i]
    const spans = N.getAll(".overflow-content", title)!
    for (const [index, char] of spans.entries()) {
        tl.from({
            el: char,
            d: 700,
            delay: 30 * index,
            e: 'o4',
            p: {
                y: [-100, 0]
            }
        })
    }
    tl.play()

    const oldTL = tls[old]
    oldTL.play({
        d: 700,
        p: {
            y: { newEnd: 100 }
        },
        delay: 0
    })
})


const titleRefs = ref()

usePageFlow({
    props: {},
    flowOut: defaultFlowOut,
    flowInCrossfade: defaultFlowIn,
    enableCrossfade: 'BOTTOM'
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

main {
    height: 100vh;
    width: 100vw;
    top: 0;
    // background-color: black;
    color: $white;
}

.flavor {
    position: absolute;
    top: calc(50% + 3rem + 2.4rem);
    left: calc(50% + 2rem);
    font-size: 1.3rem;

    .flavor-main {
        margin-bottom: 3.6rem;
        width: 35rem;
        line-height: 1.6rem;
    }

    .flavor-sub {
        display: flex;
        flex-direction: column;
        row-gap: 0.8rem;
        position: relative;
        top: 0.45rem;

        >div {
            line-height: 0;
            height: 0.9rem;
            top: 0;
        }
    }
}

h1 {
    text-transform: uppercase;
    text-align: center;
    font-size: 8.8rem;
    font-weight: 500;
    // line-height: 6rem;
    width: max-content;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    letter-spacing: -0.088rem;

}
</style>