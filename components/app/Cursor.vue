<template>
    <div :style="{ transform: translate }" :class="{ hover: cursorState == 'hover', hold: isHolding, dark: pickerDark, hide: !firstMove }"
        class="cursor__wrapper" ref="wrapperRef">

        <div class="point" :style="{ transform: `translate(calc(${diff.x}px - 50%), calc(${diff.y}px - 50%) )` }">

        </div>
        <div class="hold-border">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.1 -1.1 2.2 2.2">
                <path d="M 0 1 A 1 1 0 0 0 0 -1 A 1 1 0 0 0 0 1" stroke="currentColor" stroke-width="0.05" fill="none" />
            </svg>
        </div>
    </div>
</template>

<script lang="ts" setup>

const { mouse, firstMove } = useStoreView()
const { overhide, target, cursorState, progress, isHolding, pickerDark } = useCursorStore()

watch(firstMove, ()=>{
    trailingMouse.value = mouse.value
})

const mouseLag = ref({ x: 0, y: 0 })
const diff = ref({ x: 0, y: 0 })
const trailingMouse = ref({ x: 0, y: 0 })
const translate = computed(() => {
    return `translate(${trailingMouse.value.x - diff.value.x}px, ${trailingMouse.value.y - diff.value.y}px)`
})

const wrapperRef = ref() as Ref<HTMLElement>

watch(progress, prog => {
    const p = N.get('path', wrapperRef.value)! as HTMLElement
    const l = N.Svg.getLength(p) * (1 - prog)
    p.style.strokeDashoffset = l + "px"
})
onMounted(() => {
    const p = N.get('path', wrapperRef.value)! as HTMLElement
    const l = N.Svg.getLength(p)

    p.style.strokeDasharray = l + "px"
    p.style.strokeDashoffset = l + "px"
})

useRaf(() => {
    if (!overhide.value) {
        trailingMouse.value = {
            x: N.Lerp(trailingMouse.value.x, mouse.value.x, 0.2),
            y: N.Lerp(trailingMouse.value.y, mouse.value.y, 0.2),
        }
    } else {
        trailingMouse.value = {
            x: N.Lerp(trailingMouse.value.x, target.value.x, 0.2),
            y: N.Lerp(trailingMouse.value.y, target.value.y, 0.2),
        }
    }
    mouseLag.value = {
        x: N.Clamp(N.Lerp(mouseLag.value.x, trailingMouse.value.x, 0.5), trailingMouse.value.x - 6, trailingMouse.value.x + 6),
        y: N.Clamp(N.Lerp(mouseLag.value.y, trailingMouse.value.y, 0.5), trailingMouse.value.y - 6, trailingMouse.value.y + 6),
    }

    diff.value = {
        x: trailingMouse.value.x - mouseLag.value.x,
        y: trailingMouse.value.y - mouseLag.value.y
    }
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
    transition: color 350ms, opacity 250ms;

    &.dark {
        color: $black;
    }
    &.hide {
        opacity: 0;
    }

    &.hover {
        // color: $yellow;

        &::after {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.1;
        }

        .point {
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

    .point {
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

