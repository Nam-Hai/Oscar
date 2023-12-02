<template>
    <div :style="{ transform: translate }" :class="{ hover: cursorState == 'hover', hold: isHolding, dark: pickerDark }"
        class="cursor__wrapper" ref="wrapperRef">

        <div class="hold-border">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.1 -1.1 2.2 2.2">
                <path d="M 0 1 A 1 1 0 0 0 0 -1 A 1 1 0 0 0 0 1" stroke="currentColor" stroke-width="0.05" fill="none" />
            </svg>
        </div>
    </div>
</template>

<script lang="ts" setup>

const { mouse } = useStoreView()
const { cursorState, isHolding, pickerDark } = useCursorStore()

const translate = computed(() => {
    return `translate(${mouse.value.x}px, ${mouse.value.y}px)`
})

const wrapperRef = ref() as Ref<HTMLElement>
onMounted(() => {
    const p = N.get('path', wrapperRef.value)! as HTMLElement
    const l = N.Svg.getLength(p)

    p.style.strokeDasharray = l + "px"
    p.style.strokeDashoffset = l + "px"
})



</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.cursor__wrapper {
    pointer-events: none;
    @include user-select(none);

    position: fixed;
    z-index: 200;
    color: $white;
    transition: color 350ms;

    &.dark {
        color: $black;
    }

    &.hover {
        &::after {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.1;
        }

        &::before {
            min-width: 4px;
            min-height: 4px;
        }

        .hold-border svg {
            transform: scale(0);
        }
    }

    .hold-border {
        width: 1.6rem;
        height: 1.6rem;
        min-width: 34px;
        min-height: 34px;
        border-radius: 50%;
        // border: 1px solid $white;
        position: absolute;
        left: 0;
        right: 0;
        transform: translate(-50%, -50%);

        svg {
            height: 100%;
            width: 100%;

            transform: scale(1);
            transition: transform 350ms;
            transition-timing-function: $easeOutQuad;

            path {
                transition: stroke-dashoffset 150ms;
            }
        }
    }

    &.hold {
        svg path {
            stroke-dashoffset: 0px !important;
            transition: stroke-dashoffset 1000ms;
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

        transition-property: transform;
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
        // transition-property: transform;
        transition-duration: 350ms;
        transition-timing-function: $easeOutQuad;
    }
}
</style>

