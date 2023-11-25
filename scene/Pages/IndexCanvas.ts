import type { RafR, rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";

import { Picker } from "../Components/Picker";
import { providerPicker } from "~/composables/useCanvas";
import { CanvasPage } from "../utils/types";
import type { Camera, OGLRenderingContext, Renderer, Transform } from "ogl";
import { HomeMedia } from "../Components/HomeMedia";

export class IndexCanvas extends CanvasPage {

    ro: ROR
    raf: RafR
    canvasScene: any
    target: any;
    renderer: Renderer;
    camera: Camera;

    constructor(gl: OGLRenderingContext, options: { scene: Transform, camera: Camera }) {
        super(gl)

        this.node = options.scene

        // const canvasWatch = plugReactivity(this)
        this.renderer = this.gl.renderer

        this.camera = options.camera


        this.onDestroy(() => {
            this.node.setParent(null);
        })

        N.BM(this, ["render", "resize", "init", "destroy"]);

        this.ro = useROR(this.resize)
        this.onDestroy(() => this.ro.off())
        this.raf = useRafR(this.render)
        this.onDestroy(() => this.raf.kill())

        this.mount()
    }
    init() {
        this.raf.run()
        this.ro.on()
    }

    mount() {
        this.add(new HomeMedia(this.gl))

    }

    resize({ vh, vw, scale, breakpoint }: ResizeEvent) {
    }


    render(e: rafEvent) {
        this.renderer.render({
            scene: this.node,
            camera: this.camera,
        })
    }

    destroy() {
        super.destroy()
    }
}