import { RafPriority, type RafR, type rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";

import { CanvasPage } from "../utils/types";
import { Transform, type Camera, type OGLRenderingContext, type Renderer } from "ogl";
import { Picker } from "../Components/Picker";
import { Media } from "../Components/Project/Media";
import { useCanvasReactivity } from "../utils/WebGL.utils";

export const [provideArchiveCanvas, useArchiveCanvas] = canvasInject<ArchiveCanvas>('canvas-archive-canvas')

const { isHover, hoverIndex } = useStoreArchive()

export class ArchiveCanvas extends CanvasPage {

    ro: ROR
    raf: RafR
    canvasScene: any
    target: any;
    renderer: Renderer;
    camera: Camera;
    scene: Transform;
    medias: Media[];
    fixedMedias: Media[];

    constructor(gl: OGLRenderingContext, options: { scene: Transform, camera: Camera }) {
        super(gl)
        provideArchiveCanvas(this)

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


        this.medias = []
        this.fixedMedias = []
        this.mount()

        this.onDestroy(() => this.ro.off())
        this.onDestroy(() => this.raf.kill())
    }
    init() {
        this.raf.run()
        this.ro.on()

        const { watch } = useCanvasReactivity(this)

        watch(isHover, hover => {
            for (const m of this.medias) {
                m.node.setParent(hover ? null : this.node)
            }
        })
        watch(hoverIndex, index => {
            for (const m of this.fixedMedias) {
                m.node.setParent(null)
            }
            if (index == null) return
            this.fixedMedias[index].node.setParent(this.node)
        })
    }

    mount() {
        const picker = new Picker(this.gl, { renderTargetRatio: 5 })
        picker.add(this)
    }

    addMedia(el: HTMLElement) {
        const m = new Media(this.gl, { el });
        this.medias.push(m)
        this.add(m)
        return m
    }

    addFixedMedia(el: HTMLElement) {
        const m = new Media(this.gl, { el, fixed: true });
        this.fixedMedias.push(m)
        this.add(m)
        m.node.setParent(null)
        return m
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