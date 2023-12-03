<template>
    <div ref="wrapperRef" class="stepper__wrapper" @mouseenter="stepperIsHovered = true"
        @mouseleave="stepperIsHovered = false"
        :style="{ width: stepperIsHovered ? (imageBounds.w + 8) * (length) + 'px' : 'unset' }">
        <div class="left d">
            {{ N.ZL(currentIndex + 1) }}
        </div>
        <div class="step__wrapper">
            <div class="step" :class="{ active: i - 1 == currentIndex }" :key="i" v-for="i in length">
                <div class="left"></div>
                <div class="bot"></div>
                <div class="right"></div>
            </div>
        </div>
        <div class="right d">
            {{ N.ZL(length) }}
        </div>

    </div>
</template>

<script lang="ts" setup>
import { onLeave } from '~/waterflow/composables/onFlow';

// const {propName = fallbackValue} = defineProps<{propName: type}>()
// const emits = defineEmits([])

const { stepperIsHovered, imageBounds, currentIndex, length } = useStoreStepper()

const wrapperRef = ref() as Ref<HTMLElement>

onLeave(() => {
    N.Class.add(wrapperRef.value, 'hide')
})
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

    &.hide {
        transition: opacity 500ms;
        opacity: 0;
    }
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
            border: 1px solid $white;
            border-left-width: 0px;
            width: 0px;
            // background-color: $white;
            transform-origin: bottom;
            // transition: transform 300ms $easeInOutSine;

            &.active {
                // transform: scaleY(1.3);
                width: 12px;
                border: 1px solid $yellow;
            }

        }
    }
}
</style>
