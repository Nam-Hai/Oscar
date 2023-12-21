import type { FlowFunction } from "~/waterflow/composables/usePageFlow"

export type defaultTransitionProps = {
    wrapperRef: Ref<HTMLElement>
}

export const defaultFlowOut: FlowFunction<defaultTransitionProps> = (props: {}, resolve, provider) => {
    const tl = useTL()
    const canvas = useCanvas()

    // const scene = canvas.currentPage!.node
    const scene = canvas.scene
    const overlay = provider.props.overlay
    // 
    canvas.onChange(provider.getRouteTo())
    canvas.nextPage!.node.setParent(null)
    const svg = N.get("path", overlay.value)

    const pFrom = "M 0 0 C 6 0 8 0 14 0 L 14 7 C 8 7 6 7 0 7 L 0 0"
    const pTo = "M 0 0 C 6 1 8 1 14 0 L 14 7 C 8 8 6 8 0 7 L 0 0"

    tl.from({
        d: 500,
        e: 'i2',
        update: ({ progE }) => {
            overlay.value.style.transform = `scale(1.2) translateY(${progE * 100 - 100}%)`
        },
        cb: () => {
            resolve()
            console.log(parent);
            canvas.nextPage!.node.setParent(scene)
            canvas.resolveOnChange()
        }
    }).from({
        d: 500,
        delay: 500,
        e: 'o2',
        update: ({ progE }) => {
            overlay.value.style.transform = `scale(1.2) translateY(${progE * 100}%)`
        },
        cb: () => {
            overlay.value.style.transform = `translateY(-100vh )`
        }
    }).from({
        d: 500,
        el: svg,
        e: 'o1',
        svg: {
            type: 'd',
            start: pFrom,
            end: pTo
        }
    }).from({
        d: 500,
        el: svg,
        delay: 550,
        e: 'o1',
        svg: {
            type: 'd',
            start: pTo,
            end: pFrom
        }
    })
    useDelay(100, () => {
        tl.play()
    })

}

export const defaultFlowIn: FlowFunction<defaultTransitionProps> = ({ wrapperRef }, resolve,) => {
    N.O(wrapperRef.value, 0)
    useDelay(600, () => {
        N.O(wrapperRef.value, 1)
        resolve()
    })
}

export const indexIdFlowIn: FlowFunction<defaultTransitionProps> = ({ }, resolve,) => {
    resolve()
}

export const flowOutMap = new Map([
    ['default', defaultFlowOut],
])