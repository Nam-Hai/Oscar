import { RafPriority, type RafR, type rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";

import { CanvasPage } from "../utils/types";
import type { Camera, OGLRenderingContext, Renderer, Transform } from "ogl";
import { Picker } from "../Components/Picker";
import { MainImage } from "../Components/Project/MainImage";
import { Media } from "../Components/Project/Media";
import { StaticMedia } from "../Components/Project/StaticMedia";

export const [provideProjectCanvas, useProjectCanvas] = canvasInject<ProjectCanvas>('canvas-project-canvas')

export class ProjectCanvas extends CanvasPage {

    ro: ROR
    raf: RafR
    canvasScene: any
    target: any;
    renderer: Renderer;
    camera: Camera;

    constructor(gl: OGLRenderingContext, options: { scene: Transform, camera: Camera }) {
        super(gl)
        provideProjectCanvas(this)

        this.node = options.scene

        this.renderer = this.gl.renderer

        this.camera = options.camera


        this.onDestroy(() => {
            this.node.setParent(null);
        })

        N.BM(this, ["render", "resize", "init", "destroy"]);

        this.ro = useROR(this.resize)
        this.raf = useRafR(this.render, RafPriority.LAST)


        this.mount()

        this.onDestroy(() => this.ro.off())
        this.onDestroy(() => this.raf.kill())
    }
    init() {
        this.raf.run()
        this.ro.on()
    }

    mount() {
        const picker = new Picker(this.gl, { renderTargetRatio: 5 })
        picker.add(this)

        this.add(new MainImage(this.gl, {}))
    }

    addMedia(el: HTMLElement) {
        this.add(new Media(this.gl, { el }))
    }
    addNextPageMedia(el: HTMLElement) {
        this.add(new StaticMedia(this.gl, { el }))
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