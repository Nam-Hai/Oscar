import type { ROR } from "~/plugins/core/resize";

export function useRO(callback: (e: { vh: number, vw: number, scale: number, breakpoint: string }) => void, triggerCb?: () => void) {
  const { $ROR } = useNuxtApp()

  let ro: ROR = undefined as any as ROR;
  onMounted(async () => {
    await nextTick()
    ro = new $ROR(callback, triggerCb)
    ro.on()
  });

  onBeforeUnmount(() => {
    ro.off()
  });



  return ro;
}

// TODO use a store ?
export function useCanvasSize(callback?: (size: { width: number, height: number }) => void) {
  const canvas = useCanvas()

  const unWatch = watch(canvas.size, (size) => {
    callback && callback(size)
  }, { immediate: true })

  return { canvasSize: canvas.size, unWatch }
}

export function useBounds(el: Ref<HTMLElement>): Ref<DOMRect> {
  const bounds = ref()
  useRO(() => {
    if (!el.value) return
    bounds.value = el.value.getBoundingClientRect()
  })

  return bounds
}
