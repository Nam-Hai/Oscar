import { Vec2, Program, Mesh, Texture, Plane, Vec3, Transform } from 'ogl'
import { basicVer } from "../../shaders/BasicVer";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity } from "../../utils/WebGL.utils";
import type { Timeline } from "~/plugins/core/motion";
import { BorderImage } from './BorderImage';
import { TransformNode } from '../TransformNode';

const { vh, vw, mouse } = useStoreView()
const { isHold } = useCursorStore()
// const m = toRefs(mouse)
const { getTexture, stack, imageBounds, currentIndex, stepperIsHovered, length } = useStoreStepper()

export class SteppersWrapper extends CanvasNode {
    raf: RafR;
    positionTarget: Vec3;
    child!: BorderImage[];
    fakeImage!: BorderImage;

    constructor(gl: any) {
        super(gl)
        N.BM(this, ['update', 'destroy', 'onMouseMove', 'onHold', 'onStepperHover'])

        this.positionTarget = new Vec3(0, 0, 0)

        this.raf = useRafR(this.update)


        const { watch } = useCanvasReactivity(this)
        watch(mouse, this.onMouseMove)
        watch(isHold, this.onHold)
        watch(stepperIsHovered, this.onStepperHover)
        this.mount()
        this.init()

        this.onDestroy(() => this.raf.stop())
    }


    init() {
        this.raf.run()
    }

    mount() {
        this.node = new Transform()

        this.child = stack.map((el, index) => new BorderImage(this.gl, { lerp: el.lerp, index: index, renderOrder: el.renderOrder, texture: getTexture(index) }))
        this.add(this.child)
        const curr = currentIndex.value
        const fakeImage = new BorderImage(this.gl, { lerp: stack[curr].lerp, index: curr, renderOrder: stack[curr].renderOrder - 1, texture: getTexture(curr), fake: true })
        this.add(fakeImage)
        this.fakeImage = fakeImage

    }

    update(e: rafEvent) {

    }

    onMouseMove(mouse: { x: number, y: number }) {
        const { size } = useCanvas()
        this.positionTarget.set(
            (mouse.x - vw.value / 2 + imageBounds.w * 0.5 + 18) * size.value.width / vw.value,
            (vh.value / 2 - mouse.y + imageBounds.h * 0.5 + 18) * size.value.height / vh.value,
            0
        )
    }

    onHold(h: boolean) {
        for (const el of [...this.child, this.fakeImage]) {
            if (currentIndex.value == el.index && !el.fake) continue
            if (h) {
                const p = el.positionTarget.clone()
                const { size } = useCanvas()
                const posI = el.node.position.clone()
                const offset = {
                    x: ((imageBounds.w + 8) * (el.index) - 120) * size.value.width / vw.value,
                    y: (-imageBounds.h - 40) * size.value.height / vh.value
                }
                el.tl.reset()
                el.tl.from({
                    d: 500,
                    e: 'o5',
                    update: ({ progE }) => {
                        el.fake && (el.uTransparency.value = progE)
                        el.node.position.set(
                            N.Lerp(posI.x, p.x + offset.x, progE),
                            N.Lerp(posI.y, p.y + offset.y, progE),
                            0
                        )
                    },
                    delay: 20 * (2 - el.renderOrder),
                }).play()
                el.raf.stop()
            } else {
                el.tl.reset()
                if (el.fake) {
                    el.tl.from({
                        d: 500,
                        e: 'o4',
                        update: ({ progE }) => {
                            el.uTransparency.value = 1 - progE
                        }
                    }).play()
                }
                el.raf.run()
            }
        }
    }

    onStepperHover(h: boolean) {
        for (const el of [...this.child, this.fakeImage]) {
            if (currentIndex.value == el.index && !el.fake) continue
            if (h) {
                const { size } = useCanvas()
                const posI = el.node.position.clone()

                const posF = {
                    x: ((imageBounds.w + 8) * (el.index - (length - 1) / 2)) * size.value.width / vw.value,
                    y: -size.value.height / 2 + (imageBounds.h / 2 + 30) * size.value.height / vh.value
                }
                el.tl.reset()
                el.tl.from({
                    d: 500,
                    e: 'o5',
                    update: ({ progE }) => {
                        el.fake && (el.uTransparency.value = progE)
                        el.node.position.set(
                            N.Lerp(posI.x, posF.x, progE),
                            N.Lerp(posI.y, posF.y, progE),
                            0
                        )
                    },
                    delay: 20 * (2 - el.renderOrder),
                }).play()
                el.raf.stop()
            } else {
                el.tl.reset()
                if (el.fake) {
                    el.tl.from({
                        d: 500,
                        e: 'o4',
                        update: ({ progE }) => {
                            el.uTransparency.value = 1 - progE
                        }
                    }).play()
                }
                el.raf.run()
            }
        }
    }
}