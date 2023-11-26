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
const { getTexture, stack, imageBounds, currentIndex } = useStoreStepper()

export class SteppersWrapper extends CanvasNode {
    raf: RafR;
    positionTarget: Vec3;
    child!: BorderImage[];

    constructor(gl: any) {
        super(gl)
        N.BM(this, ['update', 'destroy', 'onMouseMove', 'onHold'])

        this.positionTarget = new Vec3(0, 0, 0)

        this.raf = useRafR(this.update)


        const { watch } = useCanvasReactivity(this)
        watch(mouse, this.onMouseMove)
        watch(isHold, this.onHold)
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

    }

    update(e: rafEvent) {

    }

    onMouseMove(mouse: { x: number, y: number }) {
        const { size } = useCanvas()
        // console.log(size.value, vh.value, vw.value, mouse.x - vw.value / 2, vh.value / 2 - mouse.y);
        this.positionTarget.set(
            (mouse.x - vw.value / 2 + imageBounds.w * 0.5 + 18) * size.value.width / vw.value,
            (vh.value / 2 - mouse.y + imageBounds.h * 0.5 + 18) * size.value.height / vh.value,
            0
        )
    }

    onHold(h: boolean) {

    }
}