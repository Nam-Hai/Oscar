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
  group: Transform;

  constructor(gl: OGLRenderingContext, options: { scene: Transform, camera: Camera }) {
    super(gl)
    this.renderer = this.gl.renderer

    this.canvasScene = options.scene;
    this.scene = new Transform();
    this.group = new Transform()
    this.group.setParent(this.scene)
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

    this.preloaderAnimation();


  }

  mount() {
    const manifest = useManifest()
    const textures = Object.values(manifest.textures.home)

    this.group.position.set(0, 0, -.5)

    this.nodes = N.Arr.create(3).map((index) => {
      const image = new PreloaderImage(this.gl, { texture: textures[index] })
      const node = image.node

      node.setParent(this.group)

      return image
    })

  }

  async preloaderAnimation() {
    const promise = []
    for (let i = 0; i < this.nodes.length; i++) {
      const p = new Promise<void>((res) => {
        useDelay(200 * i, () => {
          const node = this.nodes[i]
          // console.log(node);
          node.growAnimation().then(() => {
            console.log('PRomise');
            res()
          })
        })
      })
      promise.push(p)
    }

    await Promise.all(promise)
    console.log('DONE');


    // this.nodes[0].node.rotation.set(-Math.PI * 0.5, 0, 0)
    this.nodes[1].node.rotation.set(-Math.PI * 0.5, 0, 0)

    const tl = useTL()
    tl.from({
      d: 1000,
      e: "io3",
      update: ({ progE, prog }) => {

        this.group.rotation.set(progE * Math.PI * 0.5, 0, 0)
        // this.nodes[1].mesh.program.uniforms.uMorph.value = N.Ease.io4(prog)

        this.nodes[1].mesh.program.uniforms.uMorph.value = progE

      },
      cb: () => {
        this.nodes[0].node.rotation.set(-Math.PI * 1, 0, 0)
      },
    }).from({
      d: 1000,
      e: "io3",
      delay: 1000,
      update: ({ progE, prog }) => {
        this.group.rotation.set((1 + progE) * Math.PI * 0.5, 0, 0)
        this.nodes[0].mesh.program.uniforms.uMorph.value = progE
      },
      cb: () => {
        this.nodes[0].growToHome().then(() => {
          useStore().preloaderComplete.value = true
          this.destroy()
        })
      },
    }).play()


    // const { getBounds } = usePreloaderStore()
    // const bounds = getBounds()
    // console.log("prelaoder bounds", getBounds());


    // DEBUG, skip preloader animation
  }

  resize({ vh, vw, scale, breakpoint }: ResizeEvent) { }

  render(e: rafEvent) {
    // this.group.rotation.set(e.elapsed / 1000, 0, 0)
    this.renderer.render({
      scene: this.scene,
      camera: this.camera,
      // frustumCull: false,
    });
  }

  destroy() {
    this.scene.setParent(null);
    this.destroyStack.call();
  }
}
