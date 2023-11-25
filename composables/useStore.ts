const useStore = createStore(() => {

  const isMobile = ref(false);

  const pageLoaded = ref(false);

  const preventScroll = ref(false);

  const fromPreloader = ref(true)

  const manifestLoaded = ref(false);

  const preloaderComplete = ref(false);
  return { isMobile, pageLoaded, preventScroll, fromPreloader, manifestLoaded, preloaderComplete }
})
export default useStore

export type CursorState = "hover" | "default"
const useCursorStore = createStore(() => {
  const cursorState : Ref<CursorState> = ref("default")


  function toggleHover(hover: boolean) {
    cursorState.value = hover ? "hover" : "default"
  }
  return { cursorState, toggleHover }
})

export { useCursorStore }

export const useHomeStore = createStore(() => {
  const currentPageIndex = ref(0)
  const pagesStore = [{}, {}, {}, {}]

  function nextPage() {
    currentPageIndex.value = N.mod(currentPageIndex.value + 1, pagesStore.length)
  }
  function previousPage() {
    currentPageIndex.value = N.mod(currentPageIndex.value - 1, pagesStore.length)
  }
  return { currentPageIndex, nextPage, previousPage}
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