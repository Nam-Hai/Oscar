import { RafPriority, RafR, type rafEvent } from "../plugins/core/raf";

export const useRaf = (cb: (e: rafEvent) => void, priority: RafPriority = RafPriority.NORMAL) => {

  const { $RafR } = useNuxtApp()
  let raf: RafR = undefined as any as RafR;

  onMounted(() => {
    raf = new $RafR(cb, priority)
    raf.run()
  })

  onBeforeUnmount(() => {
    raf.kill()
  })

  return raf
}
