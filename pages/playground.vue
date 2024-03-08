<template>
    <main ref="wrapperRef">
        <PlaygroundDesktop v-if="!isMobile" />
        <PlaygroundMobile v-else />
    </main>
</template>

<script lang="ts" setup>
import { archiveFlowIn, defaultFlowOut } from '~/pages_transitions/default.transition';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

const { isMobile } = useStore()

useResetLenis({ infinite: true, duration: 1 })

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
</style>