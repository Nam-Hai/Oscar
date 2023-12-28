
import type { FlowFunction } from "~/waterflow/composables/usePageFlow"
import { defaultFlowOut, type defaultTransitionProps } from "./default.transition"

export type IndexProps = defaultTransitionProps & {
    titleRefs: Ref<HTMLElement[]>
}

export const indexProjectFlowOut: FlowFunction<IndexProps> = (props: IndexProps, resolve, provider) => {

    const { breakpoint } = useStoreView()
    if (breakpoint.value == 'mobile') {
        defaultFlowOut(props, resolve, provider)
        return
    }

    const tl = useTL()
    const canvas = useCanvas()

    canvas.onChange(provider.getRouteTo())
    canvas.resolveOnChange()

    const { currentIndex } = useStoreStepper()


    const titleContainer = props.titleRefs.value[currentIndex.value]
    const spans = N.getAll('.overflow-content', titleContainer)
    const fontFromTo = {
        from: [8.8, -0.088],
        to: [17.7, -0.177]
    }
    tl.from({
        update: ({ progE }) => {
            titleContainer.style.fontSize = N.Lerp(fontFromTo.from[0], fontFromTo.to[0], progE) + "rem"
            titleContainer.style.letterSpacing = N.Lerp(fontFromTo.from[1], fontFromTo.to[1], progE) + "rem"

            titleContainer.style.transform = `translate(0, calc(${N.Lerp(0, 3, progE)}rem))`
        },
        d: 650,
        e: [.47, -0.43, .45, 1.24]
    }).from({
        update: ({ progE }) => {
            titleContainer.style.transform = `translate(0%, calc(${progE * 50}vh + ${3 * (1 - progE)}rem - ${progE * 50}%))`
        },
        d: 600,
        delay: 650,
        e: [.47, -0.43, .45, 1],
    })

    for (let i = 0; i < 7; i++) {
        tl.from({
            update: ({ progE }) => {
                N.T(spans[i] as HTMLElement, 0, 100 * progE)
            },
            d: 400,
            delay: 750 + i * 50,
            e: 'o4'
        })
    }
    tl.from({
        // d: 1450,
        // because of the flowIn duration
        d: 2150,
        update: () => {

        },
        cb: () => {
            resolve()
        }
    })

    tl.play()


}

export const indexFlowOutMap = new Map([
    ['default', defaultFlowOut],
    ['index => project-page-id', indexProjectFlowOut]
])