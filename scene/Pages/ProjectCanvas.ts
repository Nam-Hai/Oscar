import { RafPriority, type RafR, type rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";

import { CanvasPage } from "../utils/types";
import { Transform, type Camera, type OGLRenderingContext, type Renderer } from "ogl";
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
    scene: Transform;

    constructor(gl: OGLRenderingContext, options: { scene: Transform, camera: Camera }) {
        super(gl)
        provideProjectCanvas(this)

        this.scene = options.scene
        this.node = new Transform()
        this.node.setParent(options.scene)

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
        console.log('project canvas');
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
            scene: this.scene,
            camera: this.camera,
            frustumCull: false
        })
    }

    destroy() {
        super.destroy()
    }
}