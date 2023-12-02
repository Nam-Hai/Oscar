<template>
    <div ref="wrapperRef">
        allo

    </div>
</template>

<script lang="ts" setup>
import { useFlowProvider } from '~/waterflow/FlowProvider';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { defaultFlowOut, defaultFlowIn } from '../default.transition';

// const { client } = usePrismic()
// const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

const route = useFlowProvider().getRouteTo()
const id = route.params.id ? route.params.id[0] : null

console.log({id});

const wrapperRef = ref() as Ref<HTMLElement>

useResetLenis()

usePageFlow({
    props: {},
    flowOut: defaultFlowOut,
    flowInCrossfade: defaultFlowIn,
    enableCrossfade: 'BOTTOM'
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

div {
    font-size: 40rem;
    line-height: 100%;
}
</style>
