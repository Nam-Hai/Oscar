import { onFlow, onSwap } from "~/waterflow/composables/onFlow"

export const useResetLenis = ({ wrapper, content, target, infinite, direction, lerp, duration }: { wrapper?: Window | HTMLElement, content?: HTMLElement, target?: Window | HTMLElement, infinite?: boolean, direction?: "horizontal" | "vertical", lerp?: number, duration?: number } = {}) => {
    const store = useStoreView()

    store.resetLenis({ wrapper, content, target, infinite, direction, lerp, duration })
    onFlow(() => {
        store.lenis.value.scrollTo('top', { immediate: true })
    })

    onSwap(()=>{
        store.lenis.value.start()
    })
}
