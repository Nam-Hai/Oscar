<template>
  <div ref="wrapperRef" class="preloader__wrapper" v-if="!killPreloader">
    <div class="left overflow">
      <div class="overflow-content">
        Oscar Pico
      </div>
    </div>
    <div class="preloader__placeholder" ref="placeholderRef">

    </div>
    <div class="right overflow">
      <span class="overflow-content">
        Digital designer
      </span>
    </div>

    <div class="counter overflow">
      <!--<span class="overflow-content">
        {{ counter }}
      </span>
    -->
    </div>
  </div>
  <slot v-if="preloaderComplete" />
</template>

<script lang="ts" setup>
import { useFlowProvider } from '~/waterflow/FlowProvider';


const { setBounds } = usePreloaderStore()
const flowProvider = useFlowProvider()
const wrapperRef = ref()
const counter = ref('00')

const { preloaderComplete, fromPreloader, menuHide, menuInit } = useStore()
const killPreloader = ref(false)
const percentageRef = ref(0)
const route = useRoute()

const canvas = useCanvas()

const placeholderRef = ref()
setBounds(placeholderRef)

// is set to True in preloader at the end of its animation
watch(preloaderComplete, async () => {


  const to = flowProvider.getRouteTo()
  canvas.onChange(to)
  canvas.resolveOnChange()
  await nextTick()
  fromPreloader.value = false
  menuInit.value = true


  killPreloader.value = true
})


onMounted(() => {
  const manifest = useManifest()

  manifest.init()

  const right = N.get(".right .overflow-content", wrapperRef.value)!
  const left = N.get(".left .overflow-content", wrapperRef.value)!
  const counterEl = N.get(".counter .overflow-content", wrapperRef.value)
  N.T(right as HTMLElement, 0, 110)
  N.T(left as HTMLElement, 0, 110)

  useTL().from({
    el: [right, left],
    p: {
      y: [100, 0]
    },
    e: 'io3',
    d: 500,
    delay: 800

  }).play()

  const percentage = manifest.percentage
  watch(percentage, (next, old) => {
    percentageRef.value = next
    counter.value = N.ZL(Math.floor(next * 100))
  })


  const routeName = useRoute().name
  const minDuration = new Promise<void>(res => {
    useDelay(routeName === "index" ? 800 : 2000, () => {
      res()
    })
  })
  const manifestPromise = manifest.loadManifest()
  Promise.all([minDuration, manifestPromise]).then(() => {
    endLoading()
  })
})


function endLoading() {
  canvas.preloader()

  const counter = N.get('.counter .overflow-content')
  if (counter) {
    N.Class.add(counter, 'hide')
  }


  useDelay(3700, () => {
    if (wrapperRef.value) N.Class.add(wrapperRef.value, 'hide')
  })
}

</script>

<style scoped lang="scss">
@use "@/styles/shared.scss" as *;

.preloader__wrapper {
  pointer-events: none;
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  line-height: 100%;
  height: 100%;
  width: 100%;

  color: $black;
  z-index: 200;

  .overflow-content {
    transform: translateY(115%);
  }

  &.hide {

    .overflow-content {
      transform: translateY(115%) !important;
      transition: transform 1200ms $easeOutQuart;
    }
  }

  .preloader__placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 26.8rem;
    height: 24rem;
    // border-radius: 0.4rem;
  }

  .left {
    position: absolute;
    left: 2.4rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.3rem;
    font-weight: 500;
    line-height: 1.5rem;

    @include breakpoint(mobile) {
      left: 50%;
      top: calc(2.4rem + env(safe-area-inset-top));
      transform: translateX(-50%);
    }
  }

  .right {
    text-align: right;

    font-size: 1.3rem;
    font-weight: 500;
    line-height: 1.5rem;
    /* 115.385% */
    position: absolute;
    right: 2.4rem;
    top: 50%;
    transform: translateY(-50%);

    @include breakpoint(mobile) {
      left: 50%;
      top: unset;
      right: unset;
      bottom: calc(2.4rem + env(safe-area-inset-bottom));
      transform: translateX(-50%);
    }
  }

  .overflow-content {
    text-transform: uppercase;
    transform: translateY(0%);
  }
}

.counter {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 4rem;
  font-size: 1.4rem;
  line-height: 110%;
  opacity: 0.25;

  @include breakpoint(mobile) {
    bottom: 5rem;
  }
}
</style>
