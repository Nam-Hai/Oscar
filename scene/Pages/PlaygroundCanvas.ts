import { RafPriority, type RafR, type rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";

import { CanvasPage } from "../utils/types";
import { Transform, type Camera, type OGLRenderingContext, type Renderer } from "ogl";
import { Picker } from "../Components/Picker";
import { useCanvasReactivity } from "../utils/WebGL.utils";
import { PlaygroundMedia } from "../Components/Playground/PlaygroundMedia";

export const [providePlaygroundCanvas, usePlaygroundCanvas] = canvasInject<PlaygroundCanvas>('playground-archive-canvas')

const { mediaBoundsPixel, placeMediaEvent } = useStorePlayground()
const { vw } = useStoreView()
export class PlaygroundCanvas extends CanvasPage {

    ro: ROR
    raf: RafR
    target: any;
    renderer: Renderer;
    camera: Camera;
    scene: Transform;
    medias: PlaygroundMedia[];

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
        this.mount()

        this.onDestroy(() => this.ro.off())
        this.onDestroy(() => this.raf.kill())
    }
    init() {
        this.raf.run()
        this.ro.on()

        placeMediaEvent.on(this.placeMedia.bind(this))

    }

    mount() {
        const picker = new Picker(this.gl, { renderTargetRatio: 5 })
        picker.add(this)

        const { src } = useStorePlayground()
        for (let index = 0; index < src.length; index++) {
            const media = new PlaygroundMedia(this.gl, { index, last: index === src.length - 1 })
            this.medias.push(media)
            this.add(media)
        }
    }

    resize({ vh, vw, scale, breakpoint }: ResizeEvent) {
        // console.log("plauyground canvas");
    }

    placeMedia() {

        console.log('MEdia');
    }

    render(e: rafEvent) {
        this.renderer.render({
            scene: this.scene,
            camera: this.camera,
            frustumCull: false
        })
    }
}