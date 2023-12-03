
import type { FlowFunction } from "~/waterflow/composables/usePageFlow"
import { defaultFlowOut } from "./default.transition"
import { TransitionImage } from "~/scene/Components/Project/TransitionImage"
import { useCanvasMainImageProject } from "~/scene/Components/Project/MainImage"

export type IndexProps = {
    titleRefs: Ref<HTMLElement[]>
}

export const indexProjectFlowOut: FlowFunction<IndexProps> = (props: IndexProps, resolve, provider) => {

    const tl = useTL()
    const canvas = useCanvas()
    const { vh, vw, scale } = useStoreView()


    canvas.onChange(provider.getRouteTo())

    const scene = canvas.index!.node

    const route = provider.getRouteTo()

    const id = route.params.id ? route.params.id[0] : 'test'

    const { currentIndex, getTexture } = useStoreStepper()


    const texture = getTexture(currentIndex.value)
    const transitionNode = new TransitionImage(canvas.gl, {
        texture
    })
    transitionNode.node.setParent(scene)
    const mainImage = useCanvasMainImageProject()
    const width = mainImage && mainImage.bounds && mainImage.bounds[0].width || 268 * scale.value
    const height = mainImage && mainImage.bounds && mainImage.bounds[0].height || 240 * scale.value
    const coef = 0.8

    const node = mainImage.node
    const parent = node.parent
    node.setParent(null)

    const DELAY = 1000

    const titleContainer = props.titleRefs.value[currentIndex.value]
    const fontFromTo = {
        from: [8.8, -0.088],
        to: [17.7, -0.177]
    }
    tl.from({
        update: ({ progE }) => {
            titleContainer.style.fontSize = N.Lerp(fontFromTo.from[0], fontFromTo.to[0], progE) + "rem"
            titleContainer.style.letterSpacing = N.Lerp(fontFromTo.from[1], fontFromTo.to[1], progE) + "rem"

            titleContainer.style.transform = `translate(-50%, calc(${- N.Lerp(0, 4, progE)}rem - 50%))`
        },
        d: 650,
        // e: "io2"
        e: [.47, -0.43, .45, 1.24]
    }).from({
        update: ({ progE }) => {
            titleContainer.style.transform = `translate(-50%, calc(${progE * 50}vh - ${4 * (1 - progE)}rem - ${progE * 50}% - 50%))`
        },
        d: 600,
        delay: 650,
        // e: "o2"
        e: [.47, -0.43, .45, 1]

    })

    tl.from({
        d: 500,
        delay: DELAY,
        e: 'o1',
        update: (e) => {
            transitionNode.uSizePixel.value.set(
                N.Lerp(vw.value, width * coef, e.progE),
                N.Lerp(vh.value, height * coef, e.progE)
            )
            transitionNode.computeUniforms()

            transitionNode.node.scale.set(
                canvas.size.value.width * transitionNode.uSizePixel.value.x / vw.value,
                canvas.size.value.height * transitionNode.uSizePixel.value.y / vh.value,
                1
            )
        }
    }).from({
        d: 300,
        delay: 500 + DELAY,
        e: "i3",
        update: (e) => {
            transitionNode.uSizePixel.value.set(
                N.Lerp(width * coef, width, e.progE),
                N.Lerp(height * coef, height, e.progE)
            )
            transitionNode.computeUniforms()

            transitionNode.node.scale.set(
                canvas.size.value.width * transitionNode.uSizePixel.value.x / vw.value,
                canvas.size.value.height * transitionNode.uSizePixel.value.y / vh.value,
                1
            )

        }
    })
        .from({
            d: 400,
            delay: DELAY,
            e: "o2",
            update: (e) => {
                transitionNode.uProgress.value = N.Lerp(0, -1, e.progE)
            }
        })
        .from({
            d: 400,
            e: "io1",
            delay: 400 + DELAY,
            update: (e) => {
                transitionNode.uProgress.value = N.Lerp(-1, 0.6, e.progE)
            }
        })
        .from({
            d: 400,
            e: "o2",
            delay: 800 + DELAY,
            update: (e) => {
                transitionNode.uProgress.value = N.Lerp(0.6, 0, e.progE)
            },
            cb: () => {
                node.setParent(parent)

                transitionNode.destroy()
                resolve()
            }
        })
    tl.play()
    canvas.resolveOnChange()


}

export const indexFlowIn: FlowFunction<IndexProps> = ({ }, resolve,) => {
    resolve()
}


export const indexFlowOutMap = new Map([
    ['default', defaultFlowOut],
    ["index => project-page-id", indexProjectFlowOut]
])