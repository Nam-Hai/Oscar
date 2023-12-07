import type { RafR, rafEvent } from "~/plugins/core/raf";
import Callstack from "../utils/Callstack";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";

//@ts-ignore
import { Camera, Renderer, Transform, type OGLRenderingContext } from "ogl";
import { CanvasPage } from "../utils/types";
import { PreloaderImage } from "../Components/Preloader/PreloaderImage";


export class PreloaderCanvas extends CanvasPage {

  ro: ROR;
  raf!: RafR;
  destroyStack: Callstack;

  renderer: Renderer;
  camera: Camera;
  canvasScene: Transform;
  scene: Transform;
  nodes!: PreloaderImage[];

  constructor(gl: OGLRenderingContext, options: { scene: Transform, camera: Camera }) {
    super(gl)
    this.renderer = this.gl.renderer

    this.canvasScene = options.scene;
    this.scene = new Transform();
    this.scene.setParent(this.canvasScene);
    this.camera = options.camera;

    N.BM(this, ["render", "resize", "init"]);

    this.raf = useRafR(this.render);
    this.ro = useROR(this.resize);

    this.mount()

    this.destroyStack = new Callstack([
      () => this.raf.stop(),
      () => this.ro.off(),
    ]);
  }
  init() {
    this.raf.run();

    // this.preloaderAnimation();
  }

  mount() {
    const manifest = useManifest()
    const textures = Object.values(manifest.textures.home)
    this.nodes = N.Arr.create(1).map((index) => {
      const node = new PreloaderImage(this.gl, { texture: textures[index] })
      node.node.setParent(this.scene)
      return node
    })

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i]
      node.growAnimation()
    }

    useDelay(800, () => {
      this.preloaderAnimation()
    })
  }

  preloaderAnimation() {

    const { getBounds } = usePreloaderStore()
    const bounds = getBounds()
    console.log("prelaoder bounds", getBounds());


    // DEBUG, skip preloader animation
    useStore().preloaderComplete.value = true
    this.destroy()
  }

  resize({ vh, vw, scale, breakpoint }: ResizeEvent) { }

  render(e: rafEvent) {
    this.renderer.render({
      scene: this.scene,
      camera: this.camera,
      frustumCull: false,
    });
  }

  destroy() {
    this.scene.setParent(null);
    this.destroyStack.call();
  }
}
