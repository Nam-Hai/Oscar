import { DefaultTransition } from "~/scene/Components/DefaultTransition"
import type { FlowFunction } from "~/waterflow/composables/usePageFlow"

export type TemplateTransitionProps = {
}

export const defaultFlowOut: FlowFunction<TemplateTransitionProps> = (props: {}, resolve, provider) => {

    const tl = useTL()
    const canvas = useCanvas()

    // const scene = canvas.currentPage!.node
    const scene = canvas.scene
    const overlay = provider.props.overlay
    console.log({ overlay });

    canvas.onChange(provider.getRouteTo())
    canvas.resolveOnChange()
    const svg = N.get("path", overlay.value)
    resolve()
    tl.from({
        d: 1000,
        e: 'io2',
        update: ({ progE }) => {
            overlay.value.style.transform = `translateY(calc(${progE * 200}vh - 100%))`
        },
        cb: () => {
            // resolve()
        }
        // }).from({
        //     d: 500,
        //     el: svg,
        //     e: 'o2',
        //     svg: {
        //         type: 'd',
        //         start: "M 0 0 C 6 0 8 0 14 0 L 14 4 C 8 4 6 4 0 4 L 0 0",
        //         // end: "M 0 0 C 6 1 8 1 14 0 L 14 4 C 8 5 6 5 0 4 L 0 0",
        //         end:   "M 0 0 C 5 1 9 1 14 0 L 14 4 C 9 6 5 6 0 4 L 0 0"
        //     }
        // }).from({
        //     d: 500,
        //     el: svg,
        //     delay: 500,
        //     e: 'i2',
        //     svg: {
        //         type: 'd',
        //         start: "M 0 0 C 5 1 9 1 14 0 L 14 4 C 9 6 5 6 0 4 L 0 0",
        //         // start: "M 0 0 C 6 1 8 1 14 0 L 14 4 C 8 5 6 5 0 4 L 0 0",
        //         end:   "M 0 0 C 6 0 8 0 14 0 L 14 4 C 8 4 6 4 0 4 L 0 0"
        //     }
    }).play()

    // const defaultNode = new DefaultTransition(canvas.gl)
    // defaultNode.node.setParent(scene)

    // tl.from({
    //     d: 1000,
    //     e: 'io2',
    //     update: ({ progE }) => {
    //         defaultNode.animate(progE)
    //     },
    //     cb: () => {
    //         defaultNode.destroy()
    //         resolve()
    //     }
    // }).from({
    //     d: 500,
    //     e: "i2",
    //     update: ({ progE }) => {
    //         defaultNode.uVelo.value = -progE * 100
    //     },
    //     cb: () => {
    //         canvas.onChange(provider.getRouteTo())
    //         canvas.resolveOnChange()
    //     }
    // }).from({
    //     d: 500,
    //     delay: 500,
    //     e: "o2",
    //     update: ({ progE }) => {
    //         defaultNode.uVelo.value = -(1 - progE) * 100
    //     }
    // }).play()

}

export const defaultFlowIn: FlowFunction<TemplateTransitionProps> = ({ }, resolve,) => {
    resolve()
}

export const indexIdFlowIn: FlowFunction<TemplateTransitionProps> = ({ }, resolve,) => {
    resolve()
}

export const flowOutMap = new Map([
    ['default', defaultFlowOut],
])