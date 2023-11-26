<template>
    <div ref="wrapperRef" class="stepper__wrapper" @mouseenter="stepperIsHovered = true"
        @mouseleave="stepperIsHovered = false" :style="{ width: stepperIsHovered ? (imageBounds.w + 8) * (length ) + 'px' : 'unset'}">
        <div v-cursor-hover class="left d" @click="previousPage()">
            01
        </div>
        <div class="step__wrapper">
            <div class="step" :class="{ active: i - 1 == currentPageIndex }" :key="i" v-for="i in 4"></div>
        </div>
        <div v-cursor-hover class="right d" @click="nextPage()">
            04
        </div>

    </div>
</template>

<script lang="ts" setup>
import { vCursorHover } from '~/directives/cursorActive';
// const {propName = fallbackValue} = defineProps<{propName: type}>()
// const emits = defineEmits([])

const { currentPageIndex, nextPage, previousPage } = useHomeStore()
const { stepperIsHovered, imageBounds, length } = useStoreStepper()

const wrapperRef = ref() as Ref<HTMLElement>

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.stepper__wrapper {
    position: absolute;
    bottom: 5.2rem;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    column-gap: 16px;
    align-items: baseline;
    justify-content: center;
    @include user-select(none);

    padding: 5rem 5rem 3rem;
    margin: -5rem -0rem -3rem;
    transition: opacity 300ms;

    &:hover {
        opacity: 0;
    }

    .d {
        font-size: 11px;
        font-weight: 400;
        line-height: 0;
    }

    .step__wrapper {
        display: flex;
        column-gap: 4px;

        .step {
            height: 8px;
            width: 1px;
            background-color: $white;
            transform-origin: bottom;
            transition: transform 300ms $easeInOutSine;

            &.active {
                transform: scaleY(1.3);
            }
        }
    }
}
</style>
