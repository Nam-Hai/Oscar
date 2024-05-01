<template>
  <main class="project__wrapper" ref="wrapperRef">
    <Teleport to=".app__wrapper" v-if="isMobile != true">
      <div class="scroll-display-f__wrapper" :style="{ clipPath: `inset(0 0 ${clipPercentage * 100}% 0)` }">
        <div class="scroll-display-f" :class="{ dark: pickerDark, show: scrollDisplayShow }"
          :style="{ transform: translate }">
          {{ scrollPercent }}
        </div>
      </div>
    </Teleport>

    <Landing :id="id" />
    <component v-for="(slice, index) of COPY.slice" :is="slice.keyId" :data="slice" :key="'project-slice-' + index" />
  </main>
</template>

<script lang="ts" setup>
import { useFlowProvider } from '~/waterflow/FlowProvider';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { projectFlowInMap, projectFlowOutMap } from '~/pages_transitions/project.transition';
import { useCanvasMainImageProject } from '~/scene/Components/Project/MainImage';
import { onFlow, onLeave } from '~/waterflow/composables/onFlow';

const { pickerDark } = useCursorStore()
const { isMobile } = useStore()
const { mouseLag, vh } = useStoreView()
const translate = computed(() => {
  return `translate(calc(${mouseLag.value.x}px - 50%), ${mouseLag.value.y}px)`
})

const route = useFlowProvider().getRouteTo()
const id = route.params.id ? route.params.id[0] : 'viadomo-deco'

const wrapperRef = ref() as Ref<HTMLElement>;

const { currentIndex, idToIndex, copy, atEnd } = useStoreProject()
currentIndex.value = idToIndex.get(id) || 0
const COPY = copy[id]


useResetLenis()

const scrollPercent = ref('000')
const scrollDisplayShow = ref(false)
const ZL = (n: number) => {
  if (!n) return "000"
  const r = N.Round(n, 0)
  return r == 100 ? "100" : "0" + N.ZL(r)
}
onFlow(() => {
  scrollDisplayShow.value = true
})
onLeave(() => {
  useDelay(1000, () => atEnd.value = false)
})

const clipPercentage = ref(0)
useLenisScroll((e) => {
  const lenis = useLenis()
  const mainImage = useCanvasMainImageProject()
  if (!mainImage) return
  const firstScroll = mainImage.firstScroll
  if (firstScroll) {
    scrollPercent.value = ZL(Math.min(e.animatedScroll / (e.dimensions.scrollHeight - 2 * vh.value) * 100, 100))

    atEnd.value = Math.min(e.animatedScroll / (e.dimensions.scrollHeight - vh.value * 1.1), 1) === 1

    const h = e.dimensions.scrollHeight
    clipPercentage.value = N.iLerp(e.animatedScroll, h - 2 * vh.value, h - vh.value)
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
  position: relative;
  font-size: 40rem;
  line-height: 100%;

  min-height: 100vh;

  width: 100vw;
  color: $black;

  // overflow: hidden;
}

.scroll-display-f__wrapper {
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  z-index: 200;
  pointer-events: none;
}

.scroll-display-f {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: calc(16px + 0.6rem);
  line-height: 100%;
  font-size: 1.1rem;
  opacity: 0;
  transition: opacity 300ms, color 350ms;
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
