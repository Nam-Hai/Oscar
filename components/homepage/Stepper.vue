<template>
    <div ref="wrapperRef" class="stepper__wrapper hide" @mouseenter="stepperIsHovered = true"
        @mouseleave="stepperIsHovered = false"
        :style="{ width: stepperIsHovered ? (imageBounds.w + 8) * (length) + 'px' : 'unset' }">
        <div class="left d">
            {{ N.ZL(currentIndex + 1) }}
        </div>
        <div class="step__wrapper">
            <div class="step" :class="{ active: i - 1 == currentIndex }" :key="i" v-for="i in length">
            </div>
        </div>
        <div class="right d">
            {{ N.ZL(length) }}
        </div>

    </div>
</template>

<script lang="ts" setup>
import { onFlow, onLeave } from '~/waterflow/composables/onFlow';


const { stepperIsHovered, imageBounds, currentIndex, length } = useStoreStepper()

const wrapperRef = ref() as Ref<HTMLElement>

let on = true
onFlow(() => {
    N.Class.remove(wrapperRef.value, 'hide')
})

onLeave(() => {
  N.Class.add(wrapperRef.value, 'hide')
})
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.stepper__wrapper {
  position: absolute;
  bottom: min(5.2rem, 52px);
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
    // font-size: 11px;
    font-size: 1.3rem;
    font-weight: 400;
    line-height: 0;
  }

  .step__wrapper {
    display: flex;
    column-gap: .4rem;

    .step {
      height: .8rem;
      border: 1px solid $white;
      border-left-width: 0px;
      width: 0px;
      transform-origin: bottom;
      transition: width 500ms $easeOutQuart, border-left-width 100ms 400ms $easeInQuart;

      &.active {
        transition: width 500ms $easeOutQuart, border-left-width 300ms 0ms $easeInQuart;
        width: 12px;
        border: 1px solid $yellow;
      }

    }
  }
}
</style>
