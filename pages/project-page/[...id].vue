<template>
    <main class="project__wrapper" ref="wrapperRef">
        <Landing :id="id" />
        <component v-for="slice of COPY.slice" :is="slice.keyId" :data="slice.data" :key="slice.keyId" />
    </main>
</template>

<script lang="ts" setup>
import { useFlowProvider } from '~/waterflow/FlowProvider';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { projectFlowInMap, projectFlowOutMap } from '~/pages_transitions/project.transition';
import { useCanvasMainImageProject } from '~/scene/Components/Project/MainImage';

// const { client } = usePrismic()
// const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

const route = useFlowProvider().getRouteTo()
const id = route.params.id ? route.params.id[0] : 'viadomo-deco'

const wrapperRef = ref() as Ref<HTMLElement>;

const { currentIndex, idToIndex, copy } = useStoreProject()
currentIndex.value = idToIndex.get(id) || 0
const COPY = copy[id]


useResetLenis()


useLenisScroll((e) => {
    const lenis = useLenis()
    const mainImage = useCanvasMainImageProject()
    if (!mainImage) return
    const firstScroll = mainImage.firstScroll
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
    props: { wrapperRef },
    // flowOut: defaultFlowOut,
    flowOutMap: projectFlowOutMap,
    flowInCrossfadeMap: projectFlowInMap,
    enableCrossfade: 'TOP'
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
