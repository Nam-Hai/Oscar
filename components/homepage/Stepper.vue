<template>
    <div ref="wrapperRef" class="stepper__wrapper">
        <div class="left d">
            01
        </div>
        <div class="step__wrapper">
            <div class="step" v-for="i in 4"></div>
        </div>
        <div class="right d">
            04
        </div>
    </div>
</template>

<script lang="ts" setup>
// const {propName = fallbackValue} = defineProps<{propName: type}>()
// const emits = defineEmits([])

const store = useStore()

const wrapperRef = ref() as Ref<HTMLElement>

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.stepper__wrapper {
    position: absolute;
    bottom: 2.4rem;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    column-gap: 1.6rem;
    align-items: baseline;

    .d {
        font-size: 1.1rem;
        font-weight: 400;
        line-height: 0;
        /* 136.364% */
    }

    .step__wrapper {
        display: flex;
        column-gap: 0.4rem;

        .step {
            height: 0.8rem;
            width: 1px;
            background-color: $white;

            &.active {
                transform: scaleY(1.2);
            }
        }
    }
}</style>
