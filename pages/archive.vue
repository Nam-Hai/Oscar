<template>
    <main ref="wrapperRef">
        <ArchiveDesktop />
    </main>
</template>

<script lang="ts" setup>
import { defaultFlowIn, defaultFlowOut } from '~/pages_transitions/default.transition';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';


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

