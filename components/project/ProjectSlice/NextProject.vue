<template>
    <Teleport to=".over-webGL">
        <div ref="wrapperRef" class="next-project__wrapper" :data-src="dataSrc">
            <div class="next-project-container">
                <NuxtLink :to="data.link">
                    <h1 v-cursor-hover ref="titleRef">
                        <span v-for="(word, index) in words" class="overflow">
                            <span v-for="char in word.split('')" class="overflow-content">
                                {{ char }}
                            </span>
                        </span>
                    </h1>
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

            <div class="next" :class="{ isTouchable: isMobile }">Next Project</div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import { useProjectCanvas } from '~/scene/Pages/ProjectCanvas';
import { onLeave, onSwap } from '~/waterflow/composables/onFlow';
import { vCursorHover } from '~/directives/cursorActive';

const { } = defineProps<{ data: {} }>()
const { currentIndex, length, nextPageTitleRef } = useStoreProject()
const nextIndex = (currentIndex.value + 1) % length
const dataSrc = Object.keys(useManifest().textures.home)[nextIndex]
const { homeStore } = useStoreStepper()
const { isMobile } = useStore()
const data = homeStore[nextIndex]
const words = data.title.split(" ")
// const emits = defineEmits([])

const flavorMainRef = ref()
const flavorSubRef = ref()
const wrapperRef = ref() as Ref<HTMLElement>

const titleRef = ref()
const tl = useTL()
onMounted(() => {
    nextPageTitleRef.value = titleRef.value
})

const projectCanvas = useProjectCanvas()
onSwap(async () => {
    projectCanvas.addNextPageMedia(wrapperRef.value)
})

onEnter({
    el: wrapperRef,
    eStart: 66,
    enterCb: () => {
        titleAnimations()
    },
    leaveCb: () => {
        for (let i = 0; i < tl.arr.length; i++) {
            const motion = tl.arr[i]
            motion.play({
                d: 1000,
                p: {
                    y: { newEnd: 100 }
                },
                delay: 0
            })
        }
    }
})

function titleAnimations() {
    tl.reset()
    const title = titleRef.value

    const subs = N.getAll(".overflow-content", flavorSubRef.value)!
    const spans = [...N.getAll(".overflow-content", title)!, flavorMainRef.value, ...subs]

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
}

onLeave(() => {
    for (let i = tl.arr.length - 4; i < tl.arr.length; i++) {
        const motion = tl.arr[i]
        if (!motion) return
        motion.play({
            d: 1000,
            p: {
                y: { newEnd: 100 }
            },
            delay: 0
        })
    }
})
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.next-project__wrapper {
    // teleport to .over-webGL with position: relative
    position: absolute;
    top: 0;
    // background-color: white;
    height: 100vh;
    width: 100vw;
    top: 0;
    color: $white;
}

.next-project-container {
    height: 100%;
    width: 100%;
    // top: -3rem;
    position: absolute;

    clip-path: inset(0 0 17rem 0);

    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 2.4rem;
    justify-content: center;
}

.flavor {
    font-size: 1.3rem;
    padding-left: 50vw;
    width: 100%;

    @include breakpoint(mobile) {
        padding-left: calc(50vw - 3rem);
    }

    .flavor-main {
        margin-bottom: 3.6rem;
        width: 35rem;
        line-height: 1.6rem;

        @include breakpoint(mobile) {
            width: 20.3rem;
            line-height: 1.5rem;
            margin-bottom: 2.8rem;
        }
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

a {
    margin-top: 4rem;
}

h1 {
    text-transform: uppercase;
    text-align: center;
    font-weight: 500;
    // line-height: 6rem;
    position: relative;
    width: max-content;
    font-size: 8.8rem;
    letter-spacing: -0.088rem;

    display: flex;
    justify-content: center;
    column-gap: 2.7rem;

    @include breakpoint(mobile) {
        width: 100vw;
        padding: 0 1.6rem;
        font-size: 6.8rem;
        line-height: 90%;
        letter-spacing: -0.068rem;
        flex-direction: column;
    }


    &:hover {
        transition: color 500ms;
        color: $yellow;
    }

}

.next {

    &.isTouchable {
        position: absolute;
        bottom: 3.2rem;
        color: $yellow;
        font-size: 1.3rem;
        font-weight: 500;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>

