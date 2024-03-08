<template>
    <h1>
        playground
        ({{ copy.length }})
    </h1>

    <div class="fixed-media__container">
        <div class="close__container" :class="{ show: showFixed }">
            <div>Close</div>
        </div>
        <img class="fixed-media" v-for="( { src, ratio, height, width }, index) in copy" :src="src" :key="index"
            ref="fixedRefs" :style='{ aspectRatio: ratio, height, width }' />

        <div class="modal" @click="hideFixedMedia()" :class="{ hide: !showFixed }">

            <div class="num__wrapper">
                <div class="num">
                    {{ currentIndex }}
                </div>
            </div>
        </div>
    </div>
    <div class="container" ref="containerRef" :class="{ hide: showFixed }">
        <img class="media" v-for="({ src, ratio }, index) in copy" :src="src" ref="mediaRefs"
            :style="{ aspectRatio: ratio }" @click="showFixedMedia(index)" />
    </div>
</template>

<script lang="ts" setup>
const { copy, containerHeight } = useStorePlayground()
const { vh } = useStoreView()
const { menuHide } = useStore()

const containerRef = ref() as Ref<HTMLElement>
const mediaRefs = ref() as Ref<HTMLElement[]>
const fixedRefs = ref() as Ref<HTMLElement[]>
let mediaHeight = 100
const positionEl = copy.map(() => 0)
const offset = copy.map(() => 0)

const showFixed = ref(false)
const currentIndex = ref(0)
function showFixedMedia(i: number) {
    currentIndex.value = i
    showFixed.value = true
    for (const el of fixedRefs.value) {
        N.Class.remove(el, "show")
    }
    const el = fixedRefs.value[i]
    N.Class.add(el, "show")
    menuHide.value = true
}

function hideFixedMedia() {
    menuHide.value = false
    showFixed.value = false
    for (const el of fixedRefs.value) {
        N.Class.remove(el, "show")
    }
}

useRO(({ scale }) => {
    containerRef.value.getBoundingClientRect()

    mediaHeight = containerRef.value.getBoundingClientRect().height + 16 * scale

    for (let index = 0; index < mediaRefs.value.length; index++) {
        const el = mediaRefs.value[index]
        positionEl[index] = el.getBoundingClientRect().top
    }
})
useLenisScroll(e => {
    const s = e.animatedScroll
    for (let index = 0; index < positionEl.length; index++) {
        const posEl = positionEl[index]
        if (posEl - s + offset[index] > vh.value) {
            offset[index] -= mediaHeight
        } else if (posEl - s + offset[index] < -vh.value) {
            offset[index] += mediaHeight
        }
        const el = mediaRefs.value[index]
        el.style.transform = `translateY(${-s + offset[index]}px)`
    }
})
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

h1 {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(calc(-50% - 0.8rem), -50%);
    font-size: 24.3rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: -1rem;
    line-height: 90%;

    @include breakpoint(mobile) {
        font-size: 5.79rem;
        letter-spacing: -0.1rem;
        line-height: 90%;
    }
}

.container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    width: calc(50rem + 1.6rem);
    row-gap: 1.6rem;
    left: 50%;
    transform: translateX(-50%);

    &.hide {
        opacity: 0;
        pointer-events: none;
    }

    .media {
        width: 25rem;
        // height: 20rem;
        // pointer-events: none;
        // background-color: #E5E5E5;

        &:nth-child(2n) {
            align-self: flex-end;
        }

        &:nth-child(2n + 1) {
            align-self: flex-start;
        }
    }

    @include breakpoint(mobile) {
        padding: 0 1.6rem;
        column-gap: .6rem;
        width: 100%;


        .media {
            width: 50%;
        }

    }
}

.fixed-media__container {
    position: fixed;
    margin: 1.6rem;
    height: calc(100% - 3.2rem);
    width: calc(100% - 3.2rem);

    pointer-events: none;

    .close__container {
        pointer-events: none;
        opacity: 0;

        &.show {
            opacity: 1;
            pointer-events: all;
        }

        // height: 1rem;
        width: 100vw;

        background: $bg-white;
        color: $black;
        text-transform: uppercase;
        line-height: 100%;
        font-size: 1.2rem;
    }

    .modal {
        pointer-events: all;
        position: absolute;
        top: -1.6rem;
        left: -1.6rem;
        width: 100vw;
        height: 100vh;
        z-index: 2;

        &.hide {
            // opacity: 0;

            .num__wrapper .num {

                transform: translateY(100%);
            }
        }

        // background: red;
        .num__wrapper {
            position: absolute;
            bottom: calc(1.6rem + env(safe-area-inset-bottom));
            right: 1.6rem;
            line-height: 100%;

            overflow: hidden;

            .num {
                transition: transform 500ms $easeOutQuart;
                transform: translateY(0);
            }
        }
    }
}

.fixed-media {
    position: absolute;
    top: 2.6rem;
    left: 0;
    // background-color: bisque;
    max-height: 100%;
    pointer-events: none;
    opacity: 0;

    &.show {
        z-index: 30;
        pointer-events: all;
        opacity: 1;
    }

    @include breakpoint(mobile) {
        width: 100% !important;
        height: unset !important;
    }
}
</style>
