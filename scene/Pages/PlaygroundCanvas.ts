import { RafPriority, type RafR, type rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";

import { CanvasPage } from "../utils/types";
import { Transform, type Camera, type OGLRenderingContext, type Renderer } from "ogl";
import { Picker } from "../Components/Picker";
import { Media } from "../Components/Project/Media";
import { useCanvasReactivity } from "../utils/WebGL.utils";
import { PlaygroundMedia } from "../Components/Playground/PlaygroundMedia";

export const [providePlaygroundCanvas, usePlaygroundCanvas] = canvasInject<PlaygroundCanvas>('playground-archive-canvas')

export class PlaygroundCanvas extends CanvasPage {

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
        providePlaygroundCanvas(this)

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
    }

    mount() {
        const picker = new Picker(this.gl, { renderTargetRatio: 5 })
        picker.add(this)


        const { src } = useStorePlayground()
        for (const s of src) {
            this.add(new PlaygroundMedia(this.gl, { src: s }))
        }
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
}