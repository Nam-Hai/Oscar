const useStore = createStore(() => {

  const isMobile: Ref<boolean | undefined>= ref(undefined);

  const pageLoaded = ref(false);

  const preventScroll = ref(false);

  const fromPreloader = ref(true)

  const manifestLoaded = ref(false);

  const preloaderComplete = ref(false);
  const flowIsHijacked = ref(false)
  const firstRedirect = ref(false)
  const menuHide = ref(false)
  const menuInit = ref(false)

  return { isMobile, pageLoaded, preventScroll, fromPreloader, manifestLoaded, preloaderComplete, flowIsHijacked, firstRedirect, menuHide, menuInit }
})
export default useStore

export type CursorState = "hover" | "hold" | "default"
const useCursorStore = createStore(() => {
  const cursorState: Ref<CursorState> = ref("default")
  const isHolding = ref(false)
  const isHold = ref(false)
  const pickerDark = ref(false)

  const overhide = ref(false)
  const target = ref({ x: 0, y: 0 })

  const progress = ref(0)

  function toggleHover(hover: boolean) {
    cursorState.value = hover ? "hover" : "default"
  }

  function onHold(el: Ref<HTMLElement>, callback: () => void) {

    const { $Delay } = useNuxtApp()
    const delay = new $Delay(() => {
      isHold.value = true
      callback()
    }, 1000)
    const delayQuick = new $Delay(() => {
      isHolding.value = true
      callback()
    }, 200)

    function onMouseDown() {
      delayQuick.run()
      delay.run()
    }
    function onMouseUp() {
      isHolding.value = false
      isHold.value = false
      delay.stop()
      delayQuick.stop()
    }

    useEventListeneer(el, 'mousedown', onMouseDown)
    useEventListeneer(el, 'mouseup', onMouseUp)
  }

  return { target, overhide, cursorState, toggleHover, onHold, isHolding, isHold, pickerDark, progress }
})

export { useCursorStore }



export const usePreloaderStore = createStore(() => {
  // const preloaderBound = {
  //   w: 268,
  //   h: 240
  // }
  let preloaderBounds: Ref<DOMRect>;
  function setBounds(el: Ref<HTMLElement>) {
    preloaderBounds = useBounds(el)
  }
  function getBounds() {
    return preloaderBounds
  }
  return { getBounds, setBounds }
})
// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const name = ref('Eduardo')
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }

//   return { count, name, doubleCount, increment }
// })