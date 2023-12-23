import type { FlowFunction } from "~/waterflow/composables/usePageFlow"

export type defaultTransitionProps = {
    wrapperRef: Ref<HTMLElement>
}

const DURATION = 1400
export const defaultFlowOut: FlowFunction<defaultTransitionProps> = (props: {}, resolve, provider) => {
    const tl = useTL()
    const canvas = useCanvas()

    // const scene = canvas.currentPage!.node
    const scene = canvas.scene
    const overlay = provider.props.overlay
    // 
    canvas.onChange(provider.getRouteTo())
    canvas.nextPage!.node.setParent(null)
    const path = N.get("path", overlay.value)

    const pFrom = "M 0 0 C 6 0 8 0 14 0 L 14 7 C 8 7 6 7 0 7 L 0 0"
    const pTo = "M 0 0 C 6 1 8 1 14 0 L 14 7 C 8 8 6 8 0 7 L 0 0"

    tl.from({
        d: DURATION / 2,
        e: 'i2',
        update: ({ progE }) => {
            overlay.value.style.transform = `translateY(${N.Lerp(-100, -19, progE)}%)`
        },
        cb: () => {
            resolve()
            canvas.nextPage!.node.setParent(scene)
            canvas.resolveOnChange()
        }
    }).from({
        d: DURATION / 2,
        delay: DURATION / 2,
        e: 'o2',
        update: ({ progE }) => {
            // overlay.value.style.transform = `translateY(${progE * 100}%)`
            overlay.value.style.transform = `translateY(${N.Lerp(-19, 75, progE)}%)`
        },
        cb: () => {
            overlay.value.style.transform = `translateY(-100%)`
        }
    }).from({
        d: DURATION / 2,
        el: path,
        e: 'o1',
        svg: {
            type: 'd',
            start: pFrom,
            end: pTo
        }
    }).from({
        d: DURATION / 2,
        el: path,
        delay: DURATION / 2,
        e: 'o1',
        svg: {
            type: 'd',
            start: pTo,
            end: pFrom
        }
    })
    tl.play()

}

export const defaultFlowIn: FlowFunction<defaultTransitionProps> = ({ wrapperRef }, resolve,) => {
    N.O(wrapperRef.value, 0)
    useDelay(DURATION / 2 + 50, () => {
        console.log('test fllw in');
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