import type { FlowFunction } from "~/waterflow/composables/usePageFlow"
import { defaultFlowIn, defaultFlowOut } from "./default.transition"
import { TransitionImage } from "~/scene/Components/Project/TransitionImage"
import { useCanvasMainImageProject } from "~/scene/Components/Project/MainImage"

export type ProjectFlowProps = {
}

export const projectFlowIn: FlowFunction<ProjectFlowProps> = (props: ProjectFlowProps, resolve, provider) => {

    const tl = useTL()
    const canvas = useCanvas()
    const { vh, vw, scale } = useStoreView()



    const scene = canvas.index!.node

    const route = provider.getRouteTo()

    const id = route.params.id ? route.params.id[0] : 'test'
    const { currentIndex, idToIndex } = useStoreProject()
    const { getTexture } = useStoreStepper()

    currentIndex.value = idToIndex.get(id) || 0

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

    const DELAY = 900


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

            }
        })
        .from({
            d: 2100,
            update({ prog, progE }) {

            },
            cb: () => {
                resolve()
            }
        })
    tl.play()


}


export const projectFlowOutMap = new Map([
    ['default', defaultFlowOut],
])
export const projectFlowInMap = new Map([
    ['default', defaultFlowIn],
    ["index => project-page-id", projectFlowIn]
])