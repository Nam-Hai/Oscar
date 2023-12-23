import type { FlowFunction } from "~/waterflow/composables/usePageFlow"
import { defaultFlowIn, defaultFlowOut, type defaultTransitionProps } from "./default.transition"
import { TransitionImage } from "~/scene/Components/Project/TransitionImage"
import { useCanvasMainImageProject } from "~/scene/Components/Project/MainImage"
import { TransitionMediaTest } from "~/scene/Components/Project/TransitionMediaTest"

export type ProjectFlowProps = defaultTransitionProps & {
}

export const indexProjectFlowIn: FlowFunction<ProjectFlowProps> = (props: ProjectFlowProps, resolve, provider) => {

    const tl = useTL()
    const canvas = useCanvas()
    const { vh, vw, scale } = useStoreView()

    const scene = canvas.scene

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
            d: DELAY + 800 + 400,
            update({ prog, progE }) {

            },
            cb: () => {
                resolve()
            }
        })
    tl.play()


}

export const projectProjectFlowIn: FlowFunction<ProjectFlowProps> = (props: ProjectFlowProps, resolve, provider) => {
    const tl = useTL()
    const canvas = useCanvas()
    const { vh, vw, scale, lenis } = useStoreView()
    const { currentIndex, idToIndex, isPreviousId } = useStoreProject()

    const from = provider.getRouteFrom()
    const oldId = from.params.id ? from.params.id[0] : 'viadomo-deco'
    if (!isPreviousId(oldId)) {
        defaultFlowIn(props, resolve, provider)
        return
    }


    const scene = canvas.scene

    const route = provider.getRouteTo()
    const id = route.params.id ? route.params.id[0] : 'test'
    const { getTexture } = useStoreStepper()

    currentIndex.value = idToIndex.get(id) || 0

    const texture = getTexture(currentIndex.value)
    const transitionNode = new TransitionImage(canvas.gl, {
        texture
    })
    const mainImage = useCanvasMainImageProject()
    const width = mainImage && mainImage.bounds && mainImage.bounds[0].width || 268 * scale.value
    const height = mainImage && mainImage.bounds && mainImage.bounds[0].height || 240 * scale.value
    const coef = 0.8

    const node = mainImage.node
    const parent = node.parent
    node.setParent(null)

    const DELAY = 900

    // useDelay(scrollDuration, () => {
    // })
    transitionNode.node.setParent(scene)

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
    useDelay(400 + 800 + DELAY, () => {
        resolve()

    })
    tl.play()
}

export const projectProjectFlowOut: FlowFunction<ProjectFlowProps> = (props: ProjectFlowProps, resolve, provider) => {

    const tl = useTL()
    const canvas = useCanvas()


    const { nextPageTitleRef, isNextId } = useStoreProject()

    const to = provider.getRouteTo()
    const newID = to.params.id ? to.params.id[0] : 'viadomo-deco'
    if (!isNextId(newID)) {
        defaultFlowOut(props, resolve, provider)
        return
    }

    const { vh, vw, scale, lenis } = useStoreView()

    const titleContainer = nextPageTitleRef.value
    const spans = N.getAll('.overflow-content', titleContainer)
    const fontFromTo = {
        from: [8.8, -0.088],
        to: [17.7, -0.177]
    }

    canvas.onChange(provider.getRouteTo())
    canvas.resolveOnChange()

    tl.from({
        update: ({ progE }) => {
            titleContainer.style.fontSize = N.Lerp(fontFromTo.from[0], fontFromTo.to[0], progE) + "rem"
            titleContainer.style.letterSpacing = N.Lerp(fontFromTo.from[1], fontFromTo.to[1], progE) + "rem"

            titleContainer.style.transform = `translate(-50%, calc(${N.Lerp(0, 3, progE)}rem - 50%))`
        },
        d: 650,
        e: [.47, -0.43, .45, 1.24]
    }).from({
        update: ({ progE }) => {
            titleContainer.style.transform = `translate(-50%, calc(${progE * 50}vh + ${3 * (1 - progE)}rem - ${progE * 50}% - 50%))`
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
    useDelay(1450, () => {
        resolve()
    })

    tl.play()
}
export const projectFlowOutMap = new Map([
    ['default', defaultFlowOut],
    ["project-page-id => project-page-id", projectProjectFlowOut]
])
export const projectFlowInMap = new Map([
    // ['default', defaultFlowIn],
    ["index => project-page-id", indexProjectFlowIn],
    // ["project-page-id => project-page-id", projectProjectFlowIn]
    // ["project-page-id => project-page-id", projectProjectFlowIn2]
    ["default", projectProjectFlowIn]
])