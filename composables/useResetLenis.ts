import { onFlow } from "~/waterflow/composables/onFlow"

export const useResetLenis = ({ wrapper, content, target, infinite, direction, lerp, duration }: { wrapper?: Window | HTMLElement, content?: HTMLElement, target?: Window | HTMLElement, infinite?: boolean, direction?: "horizontal" | "vertical", lerp?: number, duration?: number } = {}) => {
    const store = useStoreView()

    console.log('resetLenis');
    store.resetLenis({ wrapper, content, target, infinite, direction, lerp, duration })
    onFlow(() => {
        store.lenis.value.scrollTo('top', { immediate: true })
    })
}