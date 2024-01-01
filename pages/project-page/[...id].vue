<template>
    <main class="project__wrapper" ref="wrapperRef">
        <div class="scroll-display" :class="{ dark: pickerDark }" :style="{ transform: translate }" v-if="isMobile != true">
            100
        </div>
        <Landing :id="id" />
        <component v-for="(slice, index) of COPY.slice" :is="slice.keyId" :data="slice.data"
            :key="'project-slice-' + index" />
    </main>
</template>

<script lang="ts" setup>
import { useFlowProvider } from '~/waterflow/FlowProvider';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { projectFlowInMap, projectFlowOutMap } from '~/pages_transitions/project.transition';
import { useCanvasMainImageProject } from '~/scene/Components/Project/MainImage';

// const { client } = usePrismic()
// const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

const { pickerDark } = useCursorStore()
const { isMobile } = useStore()
const { mouse } = useStoreView()
const translate = computed(() => {
    return `translate(calc(${mouse.value.x}px - 50%), ${mouse.value.y}px)`
})

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

.scroll-display {
    position: fixed;
    top: 0;
    left: 0;
    margin-top: 3rem;
    line-height: 100%;
    font-size: 1.1rem;
    pointer-events: none;
    // opacity: 0;
    transition: opacity 300ms, color 350ms;

    &.dark {
        color: black
    }

    &.yellow {
        color: $yellow !important;
    }
}
</style>
