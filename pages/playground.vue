<template>
    <main ref="wrapperRef">
        <h1>
            playground
            (24)
        </h1>
        <div class="placeholder-container"></div>
    </main>
</template>

<script lang="ts" setup>
import { archiveFlowIn, defaultFlowOut } from '~/pages_transitions/default.transition';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

const { breakpoint } = useStoreView()

useResetLenis()

const wrapperRef = ref() as Ref<HTMLElement>

usePageFlow({
    props: { wrapperRef },
    flowOut: defaultFlowOut,
    flowInCrossfade: archiveFlowIn,
    enableCrossfade: 'TOP'
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
}

.placeholder-container {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    column-gap: 1.6rem;

    &::before,
    &::after {
        content: "";
        width: 25rem;
        height: 10rem;
        background-color: red;
    }

    @include breakpoint(mobile) {
        padding: 0 1.6rem;
        column-gap: .6rem;

        &::after,
        &::before {
            width: 100%;
        }

    }
}
</style>

