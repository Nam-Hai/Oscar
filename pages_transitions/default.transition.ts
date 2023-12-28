import type { FlowFunction } from "~/waterflow/composables/usePageFlow"

export type defaultTransitionProps = {
    wrapperRef: Ref<HTMLElement>
}

export const DURATION = 1400
export const defaultFlowOut: FlowFunction<defaultTransitionProps> = (props, resolve, provider, options: { translate: boolean } = { translate: true }) => {
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
    //  "M 0 0 C 6 1 8 1 14 0 L 14 7 C 8 8 6 8 0 7 L 0 0" :
    const { breakpoint } = useStoreView()
    const pTo = breakpoint.value == 'desktop' ? "M 0 0 C 6 1 8 1 14 0 L 14 7 C 8 8 6 8 0 7 L 0 0" :
        "M 0 0 C 6 0.2 8 0.2 14 0 L 14 7 C 8 7.3 6 7.3 0 7 L 0 0";

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
    })

    if (options.translate) {
        console.error('transalte');
        tl.from({
            d: DURATION / 2,
            e: 'i2',
            el: props.wrapperRef.value,
            p: {
                y: [0, 30, 'rem']
            }
        })
    }

    tl.from({
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
    N.T(wrapperRef.value, 0, -20, 'rem')
    useTL().from({
        el: wrapperRef.value,
        d: DURATION / 2,
        delay: DURATION / 2,
        e: "o2",
        p: {
            y: [-20, 0, 'rem']
        },
        cb: () => {
            wrapperRef.value.style.transform = 'unset'
        }
    }).play()
    useDelay(DURATION / 2, () => {
        N.O(wrapperRef.value, 1)
        resolve()
    })
}
export const archiveFlowIn: FlowFunction<defaultTransitionProps> = ({ wrapperRef }, resolve, provider) => {
    const { breakpoint } = useStoreView()
    if (breakpoint.value == 'mobile') {
        defaultFlowIn({ wrapperRef }, resolve, provider)
        return
    }
    N.O(wrapperRef.value, 0)
    useDelay(DURATION / 2, () => {
        N.O(wrapperRef.value, 1)
        resolve()
    })
}

export const flowOutMap = new Map([
    ['default', defaultFlowOut],
])