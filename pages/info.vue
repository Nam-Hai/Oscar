<template>
    <main>
        <InfoDesktop v-if="breakpoint == 'desktop'"/>
    </main>
</template>

<script lang="ts" setup>
import { defaultFlowIn, defaultFlowOut } from '~/pages_transitions/default.transition';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

const { breakpoint } = useStoreView()

useResetLenis()

const wrapperRef = ref() as Ref<HTMLElement>

usePageFlow({
    props: { wrapperRef },
    flowOut: defaultFlowOut,
    flowInCrossfade: defaultFlowIn,
    enableCrossfade: 'TOP'
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;
</style>

