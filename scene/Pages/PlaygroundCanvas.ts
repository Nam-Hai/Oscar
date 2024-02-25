import { RafPriority, type RafR, type rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";

import { CanvasPage } from "../utils/types";
import { Transform, type Camera, type OGLRenderingContext, type Renderer } from "ogl";
import { Picker } from "../Components/Picker";
import { useCanvasReactivity } from "../utils/WebGL.utils";
import { PlaygroundMedia } from "../Components/Playground/PlaygroundMedia";

export const [providePlaygroundCanvas, usePlaygroundCanvas] = canvasInject<PlaygroundCanvas>('playground-archive-canvas')

const { mediaBoundsPixel } = useStorePlayground()
const { vw } = useStoreView()
export class PlaygroundCanvas extends CanvasPage {

    // ro: ROR
    raf: RafR
    target: any;
    renderer: Renderer;
    camera: Camera;
    scene: Transform;
    medias: PlaygroundMedia[];
    groupHeight: number = 1;
    canvasSize!: { width: number; height: number; };
    placed: boolean = false;

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

        N.BM(this, ["render", "resize", "init", "destroy", "onScroll"]);

        // this.ro = useROR(this.resize)
        this.raf = useRafR(this.render, RafPriority.LAST)


        this.medias = []
        this.mount()

        // this.onDestroy(() => this.ro.off())
        this.onDestroy(() => this.raf.kill())
    }
    init() {
        this.raf.run()
        // this.ro.on()

        const { unWatch: resizeUnWatch, trigger } = useCanvasSize(this.resize);

        const lenis = useLenis();
        const scrollUnsub = lenis.on("scroll", this.onScroll);
        this.onDestroy(() => scrollUnsub());
        this.onDestroy(() => resizeUnWatch())
    }

    mount() {
        const picker = new Picker(this.gl, { renderTargetRatio: 5 })
        picker.add(this)
    }

    resize(canvasSize: { width: number, height: number }) {
        this.canvasSize = canvasSize
    }

    addMedia(el: HTMLElement) {
        const media = new PlaygroundMedia(this.gl, { index: this.medias.length, el })
        this.medias.push(media)
    }

    onScroll(e: any) {
        console.log('onscroll', e);
        this.node.position.y = e.animatedScroll / 500
    }

    render(e: rafEvent) {
        this.renderer.render({
            scene: this.scene,
            camera: this.camera,
            frustumCull: false
        })
    }
}