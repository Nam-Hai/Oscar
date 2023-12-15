<template>
    <main ref="mainRef" @mousemove="mainMove($event)">
        <div class="index-container" v-for="(data, index) in homeStore" :key="data.title + '_' + index"
            :class="{ current: currentIndex == index }">
            <NuxtLink :to="data.link">
                <h1 v-cursor-hover class="text-anime__wrapper" v-html="data.titleHTML" ref="titleRefs"
                    @mouseenter="hideTrail = true" @mouseleave="hideTrail = false" @mousemove="headerMove($event)"></h1>
            </NuxtLink>

            <div class="flavor">
                <div class="flavor-main overflow">
                    <span class="overflow-content" ref="flavorMainRef">
                        {{ data.flavorMain }}
                    </span>
                </div>
                <div class="flavor-sub" ref="flavorSubRef">
                    <div v-for="text in data.flavorSub" class="overflow">
                        <span class="overflow-content">
                            {{ text }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <Stepper />
    </main>
</template>

<script lang="ts" setup>
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { onFlow, onLeave } from '~/waterflow/composables/onFlow';
import { vCursorHover } from '~/directives/cursorActive';
import { indexFlowIn, indexFlowOutMap } from './index.transition';

let first = false
function headerMove(e: MouseEvent) {
    if (!first) {
        first = true
        e.stopPropagation()
        hideTrail.value = true
    }
}
function mainMove(e: MouseEvent) {
    if (!first) {
        first = true
        e.stopPropagation()
        hideTrail.value = false
    }
}

const mainRef = ref()
const flavorMainRef = ref()
const { homeStore, currentIndex, hideTrail } = useStoreStepper()
const flavorSubRef = ref()

const titleTls = homeStore.map(() => {
    return useTL()
})

onFlow(() => {
    titleAnimations(currentIndex.value, currentIndex.value + 1)
})

watch(currentIndex, (i, old) => {
    titleAnimations(i, old)
})


const titleRefs = ref()

function titleAnimations(i: number, old: number) {
    const tl = titleTls[i]
    tl.reset()
    const title = titleRefs.value[i]
    N.Class.remove(title, "leave")
    const subs = N.getAll(".overflow-content", flavorSubRef.value[i])!
    const spans = [...N.getAll(".overflow-content", title)!, flavorMainRef.value[i], ...subs]
    for (const [index, char] of spans.entries()) {
        tl.from({
            el: char,
            d: 1000,
            delay: 30 * index,
            e: 'o4',
            p: {
                y: [-100, 0]
            }
        })
    }
    tl.play()

    const oldTL = titleTls[old]
    const oldTitle = titleRefs.value[old]

    N.Class.add(oldTitle, "leave")
    oldTL.play({
        d: 1000,
        p: {
            y: { newEnd: 100 }
        },
        delay: 0
    })
}

onLeave(() => {
    const i = currentIndex.value
    const subs = N.getAll(".overflow-content", flavorSubRef.value[i])!
    const spans = [flavorMainRef.value[i], ...subs]
    const tl = titleTls[i]
    // tl.reset()
    for (let i = tl.arr.length - 4; i < tl.arr.length; i++) {
        const motion = tl.arr[i]
        motion.play({
            d: 1000,
            p: {
                y: { newEnd: 100 }
            },
            delay: 0
        })
    }
})

useResetLenis({
    infinite: true,
})

usePageFlow({
    props: {
        titleRefs: titleRefs,
    },
    flowOutMap: indexFlowOutMap,
    flowInCrossfade: indexFlowIn,
    enableCrossfade: 'TOP'
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

.index-container {
    height: 100%;
    width: 100%;
    pointer-events: none;
    top: -3rem;
    position: absolute;

    &.current {
        pointer-events: auto;
    }

    clip-path: inset(0 0 17rem 0);
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
            line-height: 100%;
            // height: 0.9rem;
            top: 0;
        }
    }
}

h1 {
    text-transform: uppercase;
    text-align: center;
    font-weight: 500;
    // line-height: 6rem;
    width: max-content;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 8.8rem;
    letter-spacing: -0.088rem;


    &:hover {
        transition: color 500ms;
        color: $yellow;
    }

    &.leave {
        transition: color 200ms;
        color: $yellow;
    }
}
</style>