<template>
    <main class="project__wrapper" ref="wrapperRef">
        <Landing :id="id" />
        <component v-for="slice of COPY.slice" :is="slice.keyId" :data="slice.data" />
    </main>
</template>

<script lang="ts" setup>
import { useFlowProvider } from '~/waterflow/FlowProvider';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { defaultFlowOut, defaultFlowIn, indexIdFlowIn } from '../default.transition';

// const { client } = usePrismic()
// const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

const route = useFlowProvider().getRouteTo()
const id = route.params.id ? route.params.id[0] : 'viadomo-deco'


const { firstScroll, currentIndex, idToIndex, copy } = useStoreProject()
const wrapperRef = ref() as Ref<HTMLElement>;

currentIndex.value = idToIndex.get(id) || 0
const COPY = copy[id]


useResetLenis()

firstScroll.value = false

useLenisScroll((e) => {
    const lenis = useLenis()
    if (!firstScroll.value && e.velocity > 0) {
        lenis.stop()

        firstScroll.value = true
        useDelay(1000, () => {
            lenis.start()
        })
    }
    if (e.direction < 0 && e.animatedScroll <= 0) {
        firstScroll.value = false
    }
})

usePageFlow({
    props: {},
    flowOut: defaultFlowOut,
    flowInCrossfade: indexIdFlowIn,
    enableCrossfade: 'BOTTOM'
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.project__wrapper {
    font-size: 40rem;
    line-height: 100%;

    min-height: 100vh;
    height: 100%;
    width: 100vw;

    // overflow: hidden;
}
</style>
