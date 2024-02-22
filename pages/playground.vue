<template>
    <main ref="wrapperRef">
        <h1>
            playground
            (24)
        </h1>
    </main>
</template>

<script lang="ts" setup>
import { archiveFlowIn, defaultFlowIn, defaultFlowOut } from '~/pages_transitions/default.transition';
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
</style>

