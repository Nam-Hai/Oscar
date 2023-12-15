import { Vec2, Program, Mesh, Texture, Plane, Vec3, Transform } from 'ogl'
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity } from "../../utils/WebGL.utils";
import { BorderImage } from './BorderImage';

const { vh, vw, mouse } = useStoreView()
const { isHold } = useCursorStore()
// const m = toRefs(mouse)
const { getTexture, stack, imageBounds, currentIndex, stepperIsHovered, length, idToIndex } = useStoreStepper()
const { toggleHover } = useCursorStore()

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
        // watch(isHold, this.onHold)
        watch(stepperIsHovered, this.onStepperHover)
        this.mount()
        this.init()
        this.addEventListener()

        this.onDestroy(() => this.raf.stop())
    }


    init() {
        this.raf.run()
    }

    addEventListener() {
        const { onClick, useHover } = usePick(this)

        const { watch } = useCanvasReactivity(this)

        let click = false
        for (const el of [...this.child]) {
            onClick(el.id, () => {
                const index = idToIndex.get(el.id)!;

                click = true
                currentIndex.value = index
            })

            const { hover } = useHover(el.id)
            watch(hover, h => {
                toggleHover(h && (stepperIsHovered.value))
            })
        }

        const scrollTL = useTL()

        watch(currentIndex, (newIndex, oldIndex) => {
            const curr = oldIndex
            const index = newIndex

            if (index - curr > 0) {
                for (let i = 0; i < index - curr; i++) {
                    const a = this.child.shift()!
                    this.child.push(a)
                }
            } else if (index - curr < 0) {
                for (let i = 0; i < -index + curr; i++) {
                    const a = this.child.pop()!
                    this.child.unshift(a)
                }
            }


            this.fakeImage.index = index
            this.fakeImage.uId.value = this.child[0].uId.value

            if (!click) {
                scrollTL.reset()

                let dir = 0
                if (index == 0 && curr == length - 1) {
                    dir = 1
                } else if (index == length - 1 && curr == 0) {
                    dir = -1
                } else {
                    dir = index - curr
                }
                const c = this.child[dir == -1 ? 0 : length - 1]
                const from = c.positionTarget.y
                const fromX = c.positionTarget.x
                scrollTL.from({
                    d: 300,
                    e: 'io2',
                    update: (e) => {
                        c.positionTarget.y = N.Lerp(from + 0.2, from, e.progE)
                        c.positionTarget.x = N.Lerp(fromX + 0.2, fromX, e.progE)
                    }
                }).from({
                    d: 150,
                    update: () => {

                    },
                    cb: () => {
                        for (const [i, e] of this.child.entries()) {
                            e.setRenderOrder(stack[i].renderOrder)
                            e.lerp = stack[i].lerp
                        }
                    },
                })
                    .play()
            } else {
                for (const [i, e] of this.child.entries()) {
                    e.setRenderOrder(stack[i].renderOrder)
                    e.lerp = stack[i].lerp
                }
            }
            click = false

            this.onStepperHover(stepperIsHovered.value, true)
        })

    }
    mount() {
        this.node = new Transform()


        this.child = stack.map((el, index) => new BorderImage(this.gl, { lerp: el.lerp, index: index, renderOrder: el.renderOrder, texture: getTexture(index) }))
        this.add(this.child)
        const curr = currentIndex.value
        const fakeImage = new BorderImage(this.gl, { lerp: stack[curr].lerp, index: curr, renderOrder: stack[curr].renderOrder - 1, texture: getTexture(curr), fake: true })
        fakeImage.id = this.child[curr].id
        fakeImage.uId.value = this.child[curr].uId.value
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

                const delay = 50 * (el.index)
                el.tl.from({
                    d: delay,
                    update: () => {

                        posI.copy(el.node.position)
                    },
                    cb: () => {
                        el.raf.stop()
                        posI.copy(el.node.position)
                    },
                })
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
                    delay: 50 * (el.index),
                }).play()
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

    onStepperHover(h: boolean, immediate = false) {
        for (const el of [...this.child, this.fakeImage]) {
            if (currentIndex.value == el.index && !el.fake) {
                el.raf.run()
                continue
            }
            if (h) {
                const { size } = useCanvas()
                const posI = new Vec3(0)

                const posF = {
                    x: ((imageBounds.w + 8) * (el.index - (length - 1) / 2)) * size.value.width / vw.value,
                    y: -size.value.height / 2 + (imageBounds.h / 2 + 30) * size.value.height / vh.value
                }
                el.tl.reset()
                const delay = immediate ? 0 : 150 * (el.index)
                if (immediate) posI.copy(el.node.position)
                el.tl.from({
                    d: delay,
                    update: () => {
                        posI.copy(el.node.position)
                    },
                    cb: () => {
                        el.raf.stop()
                        posI.copy(el.node.position)
                    },
                })
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
                    delay,
                }).play()
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