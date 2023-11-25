<template>
    <div :style="{ transform: translate }" :class="{ hover: cursorState == 'hover' }" class="cursor__wrapper"
        ref="wrapperRef">

    </div>
</template>

<script lang="ts" setup>

const { mouse } = useStoreView()
const { cursorState } = useCursorStore()
const translate = computed(() => {
    return `translate(${mouse.x}px, ${mouse.y}px)`
})

const wrapperRef = ref() as Ref<HTMLElement>

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.cursor__wrapper {
    pointer-events: none;
    @include user-select(none);

    position: absolute;
    z-index: 200;
    color: $white;
    transition: color 350ms;

    &.hover {
        color: red;

        &::after {
            width: .4rem;
            height: .4rem;
            min-width: 4px;
            min-height: 4px;
            opacity: 0.1;
        }

        &::before {
            min-width: 4px;
            min-height: 4px;
        }
    }

    &::after {
        content: '';
        position: absolute;
        width: 1.6rem;
        height: 1.6rem;
        min-width: 32px;
        min-height: 32px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background-color: currentColor;
        opacity: 0.1;

        transition-property: min-width, min-height;
        transition-duration: 350ms;
        transition-timing-function: $easeOutQuad;
    }

    &::before {
        content: '';
        position: absolute;
        width: 0.2rem;
        height: 0.2rem;
        transform: translate(-50%, -50%);
        min-width: 4px;
        min-height: 4px;
        border-radius: 50%;
        background-color: currentColor;

        transition-property: min-width, min-height;
        transition-duration: 350ms;
        transition-timing-function: $easeOutQuad;
    }
}
</style>

