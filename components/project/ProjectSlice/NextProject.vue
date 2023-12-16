<template>
    <div ref="wrapperRef" class="next-project__wrapper">
        <div class="next-project-container">
            <NuxtLink :to="data.link">
                <h1 v-cursor-hover class="text-anime__wrapper" v-html="data.titleHTML" ref="titleRef"></h1>
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
    </div>
</template>

<script lang="ts" setup>
import { onFlow, onLeave } from '~/waterflow/composables/onFlow';

// const {propName = fallbackValue} = defineProps<{propName: type}>()
const { currentIndex, length } = useStoreProject()
const { homeStore, hideTrail } = useStoreStepper()
const data = homeStore[(currentIndex.value + 1) % length]
console.log(data);
// const emits = defineEmits([])

const store = useStore()

const flavorMainRef = ref()
const flavorSubRef = ref()
const wrapperRef = ref() as Ref<HTMLElement>

const titleRef = ref()
const tl = useTL()

onFlow(() => {
    console.log('test');
    titleAnimations()
})

function titleAnimations() {
    tl.reset()
    const title = titleRef.value

    N.Class.remove(title, "leave")
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
    const i = currentIndex.value
    const subs = N.getAll(".overflow-content", flavorSubRef.value[i])!
    const spans = [flavorMainRef.value[i], ...subs]
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
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.next-project__wrapper {
    background-color: white;
    height: 100vh;
    width: 100vw;
    top: 0;
    // background-color: black;
    color: $white;
    position: relative;
}

.next-project-container {
    height: 100%;
    width: 100%;
    // top: -3rem;
    position: absolute;

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

