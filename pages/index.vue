<template>
  <main ref="mainRef" @mousemove="mainMove($event)">
    <div class="index-container" v-for="(data, index) in homeStore" :key="data.title + '_' + index"
      :class="{ current: currentIndex == index }">
      <NuxtLink :to="data.link">
        <div class="shadow">
        </div>
        <h1 ref="titleRefs" @mouseenter="hideTrail = true; homeHover(true)"
          @mouseleave="hideTrail = false; homeHover(false)" @mousemove="headerMove($event)">
          <span v-for="(word, index) in data.title.split(' ')" class="overflow" v-if="breakpoint == 'desktop'">
            <span v-for="char in word.split('')" class="overflow-content">
              {{ char }}
            </span>
          </span>
          <span v-for="(word, index) in data.titleMobile.split(' ')" class="overflow" v-else>
            <span v-for="char in word.split('')" class="overflow-content">
              {{ char }}
            </span>
          </span>
        </h1>
      </NuxtLink>

      <div class="flavor">
        <div class="flavor-main" ref="flavorMainRef">
          <span class="overflow" v-for="word in data.flavorMain.split(' ')">
            <span class="overflow-content">
              {{ word }}&nbsp;
            </span>
          </span>
        </div>
        <div class="flavor-sub" ref="flavorSubRef">
          <div v-for="(text, index) in data.flavorSub" class="overflow">
            <span class="overflow-content">{{ data.flavorTitle[index] }}.</span>
            <span class="overflow-content">
              {{ text }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <Stepper v-if="!isMobile" />
    <StepperMobile v-else />
  </main>
</template>

<script lang="ts" setup>
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { onFlow, onLeave } from '~/waterflow/composables/onFlow';
import { vCursorHover } from '~/directives/cursorActive';
import { indexFlowOutMap } from '~/pages_transitions/index.transition';
import { defaultFlowIn } from '~/pages_transitions/default.transition';
// import { indexFlowIn} from "~/pages"

const { homeHover } = useCursorStore()

const { fromPreloader } = useStore()
const _fromPreloader = fromPreloader.value
useResetLenis({
  infinite: true,
})

let first = false
function headerMove(e: MouseEvent) {
  if (!first) {
    first = true
    e.stopPropagation()
    hideTrail.value = true
  }
}
function mainMove(e: MouseEvent) {
  if (!first) {
    first = true
    e.stopPropagation()
    useDelay(_fromPreloader ? 0 : 1000, () => {
      hideTrail.value = false
    })
  }
}

const mainRef = ref()
const { breakpoint } = useStoreView()
const { homeStore, currentIndex, hideTrail } = useStoreStepper()
currentIndex.value = 0
onMounted(() => {
  first = false
  hideTrail.value = true
})
const { isMobile } = useStore()
const flavorMainRef = ref()
const flavorSubRef = ref()

const titleTls = homeStore.map(() => {
  return useTL()
})

onFlow(() => {
  titleAnimations(currentIndex.value, (currentIndex.value + 1) % homeStore.length)

  useDelay(70, () => {
    const shadows = N.getAll(".shadow", mainRef.value)
    for (const el of shadows) {
      N.Class.add(el, "show")
    }
  })
})

watch(currentIndex, (i, old) => {
  titleAnimations(i, old)
})


const titleRefs = ref()

watch(breakpoint, async (b) => {
  await nextTick()
  const i = currentIndex.value
  const title = titleRefs.value[i]

  const spans = N.getAll(".overflow-content", title)!

  const tl = titleTls[i]

  for (const [index, char] of spans.entries()) {
    const motion = tl.arr[index];
    motion.v.el = [char];
    // (char as HTMLElement).style.transform = "translateY(0)"
  }
  tl.play({
    d: 1000,
    p: {
      y: { newEnd: 0 }
    },
    delay: 0
  })
})
function titleAnimations(i: number, old: number) {
  const tl = titleTls[i]
  tl.reset()
  const title = titleRefs.value[i]
  N.Class.remove(title, "leave")
  const subs = N.getAll(".overflow-content", flavorSubRef.value[i])!
  const spans = [...N.getAll(".overflow-content", title)!, ...N.getAll(".overflow-content", flavorMainRef.value[i]), ...subs]
  for (const [index, char] of spans.entries()) {
    tl.from({
      el: char,
      d: 1000,
      delay: 50 * index,
      e: 'o4',
      p: {
        y: [-100, 0]
      }
    })
  }
  tl.play()

  const oldTL = titleTls[old]
  const oldTitle = titleRefs.value[old]

  N.Class.add(oldTitle, "leave")
  oldTL.play({
    d: 1000,
    p: {
      y: { newEnd: 105 }
    },
    delay: 0
  })
}

onLeave(() => {
  const i = currentIndex.value
  const tl = titleTls[i]

  const title = titleRefs.value[i]
  const span = N.getAll(".overflow-content", title)
  // tl.reset()
  let a = 0
  for (let i = span.length; i < tl.arr.length; i++) {

    const motion = tl.arr[i]
    motion.play({
      d: 750,
      p: {
        y: { newEnd: 100 }
      },
      delay: a * 10
    })
    a++;
  }
})


usePageFlow({
  props: {
    wrapperRef: mainRef,
    titleRefs: titleRefs,
  },
  flowOutMap: indexFlowOutMap,
  flowInCrossfade: defaultFlowIn,
  enableCrossfade: 'TOP'
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

main {
  height: var(--100vh);
  width: 100vw;
  top: 0;
  // background-color: black;
  color: $white;
}

.index-container {
  pointer-events: none;

  &.current {
    pointer-events: auto;

    .shadow.show {
      opacity: 1;
      background-color: #0000004c;
    }
  }

  clip-path: inset(0 0 17rem 0);

  height: 100%;
  width: 100%;
  // top: -3rem;
  position: absolute;

  clip-path: inset(0 0 17rem 0);

  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 1.4rem;
  justify-content: center;
}

.flavor {
  font-size: 1.4rem;
  // font-size: 11px;
  padding-left: 50vw;
  width: 100%;

  @include breakpoint(mobile) {
    padding-left: calc(50vw - 3rem);
  }

  .flavor-main {
    margin-bottom: 3.6rem;
    width: 26rem;
    line-height: 1.8rem;

    span.overflow {
      display: inline-block;
    }

    @include breakpoint(mobile) {
      span.overflow {
        margin-bottom: -1rem;
      }

      width: 20.3rem;
      line-height: 2rem;
      margin-bottom: 2.8rem;
    }
  }

  .flavor-sub {

    font-size: 1.2rem;
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
    position: relative;
    top: 0.45rem;

    >div {
      line-height: 100%;
      // height: 0.9rem;
      top: 0;

      >span:first-child {
        width: 5rem;
      }
    }
  }
}

a {
  margin-top: 3rem;
}

.shadow {
  content: "";
  position: absolute;
  inset: 0rem -2rem -1rem -2rem;
  background-color: #00000000;
  filter: blur(30px);
  z-index: -1;
  opacity: 0;
  transition: opacity 1000ms, background-color 1000ms;
}

h1 {
  text-transform: uppercase;
  text-align: center;
  font-weight: 500;
  // line-height: 6rem;
  position: relative;
  width: max-content;
  font-size: 8.8rem;
  letter-spacing: -0.088rem;

  display: flex;
  justify-content: center;
  column-gap: 2.7rem;

  background-color: unset;
  color: $white;


  @include breakpoint(mobile) {
    width: 100vw;
    padding: 0 1.6rem;
    font-size: 6.8rem;
    line-height: 90%;
    letter-spacing: -0.068rem;
    flex-direction: column;
  }

  &:hover {
    transition: color 500ms;
    color: $yellow;
  }

  &.leave {
    transition: color 200ms;
    color: $yellow;
  }
}

span.overflow {
  display: flex;
  justify-content: center;
}
</style>
