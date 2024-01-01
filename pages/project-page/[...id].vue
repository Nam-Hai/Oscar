<template>
    <main class="project__wrapper" ref="wrapperRef">

        <Teleport to=".app__wrapper">
            <div class="scroll-display-f" :class="{ dark: pickerDark, show: scrollDisplayShow }" :style="{ transform: translate }"
                v-if="isMobile != true">
                {{ scrollPercent }}
            </div>
        </Teleport>
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
import { onFlow } from '~/waterflow/composables/onFlow';

// const { client } = usePrismic()
// const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

const { pickerDark } = useCursorStore()
const { isMobile } = useStore()
const { mouse, vh } = useStoreView()
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

const scrollPercent = ref('000')
const scrollDisplayShow = ref(false)
const ZL = (n: number) => {
    if (!n) return "000"
    const r = N.Round(n, 0)
    return n == 100 ? "100" : "0" + N.ZL(r)
}
onFlow(() => {
    scrollDisplayShow.value = true
})

useLenisScroll((e) => {
    const lenis = useLenis()
    const mainImage = useCanvasMainImageProject()
    if (!mainImage) return
    const firstScroll = mainImage.firstScroll
    if (firstScroll) {
        scrollPercent.value = ZL(Math.min(e.animatedScroll / (e.dimensions.scrollHeight - 2 * vh.value) * 100, 100))
    }
    if (!firstScroll.value && e.velocity > 0) {
        lenis.stop()

        firstScroll.value = true
        useDelay(1000, () => {
            lenis.start()
        })
    }
    if (e.direction < 0 && e.animatedScroll <= 0) {
        // firstScroll.value = false
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

.scroll-display-f {
    position: fixed;
    top: 0;
    left: 0;
    margin-top: 3rem;
    line-height: 100%;
    font-size: 1.1rem;
    pointer-events: none;
    opacity: 0;
    transition: opacity 300ms, color 350ms;

    z-index: 2000;
    color: white;

    &.show {
        opacity: 1;
    }

    &.dark {
        color: black
    }

    &.yellow {
        color: $yellow !important;
    }
}
</style>
