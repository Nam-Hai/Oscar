import type { RafR, rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";

import { CanvasPage } from "../utils/types";
import { Transform, type Camera, type OGLRenderingContext, type Renderer } from "ogl";
import { HomeMedia } from "../Components/Index/HomeMedia";
import { SteppersWrapper } from "../Components/Index/SteppersWrapper";
import { Picker } from "../Components/Picker";
import { useCanvasReactivity } from "../utils/WebGL.utils";

const { isMobile } = useStore()
export class IndexCanvas extends CanvasPage {

    ro: ROR
    raf: RafR
    canvasScene: any
    target: any;
    renderer: Renderer;
    camera: Camera;
    scene: Transform;

    constructor(gl: OGLRenderingContext, options: { scene: Transform, camera: Camera }) {
        super(gl)

        this.scene = options.scene
        this.node = new Transform()
        this.node.setParent(this.scene)

        // const canvasWatch = plugReactivity(this)
        this.renderer = this.gl.renderer

        this.camera = options.camera


        this.onDestroy(() => {
            this.node.setParent(null);
        })

        N.BM(this, ["render", "resize", "init", "destroy"]);

        this.ro = useROR(this.resize)
        this.raf = useRafR(this.render)
        this.onDestroy(() => this.ro.off())
        this.onDestroy(() => this.raf.kill())

        this.mount()
    }
    init() {
        this.raf.run()
        this.ro.on()
    }

    mount() {
        const picker = new Picker(this.gl, { renderTargetRatio: 5 })
        picker.add(this)


        const stepper = new SteppersWrapper(this.gl)
        const { watch } = useCanvasReactivity(this)
        watch(isMobile, mobile => {
            if (!mobile) {
                stepper.raf.run()
                this.add(stepper)
            } else {
                stepper.node.setParent(null)
                stepper.raf.stop()
            }
        }, { immediate: true })


        this.add(new HomeMedia(this.gl))

    }

    resize({ vh, vw, scale, breakpoint }: ResizeEvent) {
    }


    render(e: rafEvent) {
        this.renderer.render({
            scene: this.scene,
            camera: this.camera,
        })
    }

    destroy() {
        super.destroy()
    }
}