import type { RafR, rafEvent } from "~/plugins/core/raf";
import Callstack from "../utils/Callstack";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";

//@ts-ignore
import { Camera, Renderer, Transform, type OGLRenderingContext } from "ogl";
import { CanvasPage } from "../utils/types";
import { PreloaderImage } from "../Components/Preloader/PreloaderImage";
import { useFlowProvider } from "~/waterflow/FlowProvider";
import { DURATION } from "~/pages_transitions/default.transition";


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

    this.nodes = N.Arr.create(4).map((index) => {
      const image = new PreloaderImage(this.gl, { texture: textures[index] })
      const node = image.node

      node.setParent(this.group)

      return image
    })

  }

  async preloaderAnimation() {
    // useStore().preloaderComplete.value = true;
    // this.destroy();
    // return false;
    // DEBUG, skip preloader animation

    const provider = useFlowProvider()
    if (provider.getRouteTo().name !== "index") {
      const overlay = provider.props.overlay

      const { breakpoint, scale, vh } = useStoreView()
      const pFrom = "M 0 0 C 6 0 8 0 14 0 L 14 7 C 8 7 6 7 0 7 L 0 0"
      const pTo = breakpoint.value == 'desktop' ? "M 0 0 C 6 1 8 1 14 0 L 14 7 C 8 8 6 8 0 7 L 0 0" :
        "M 0 0 C 6 0.2 8 0.2 14 0 L 14 7 C 8 7.3 6 7.3 0 7 L 0 0";

      const path = N.get("path", overlay.value)
      const tl = useTL()
      const ooo = 200
      tl.from({
        d: DURATION / 2,
        e: 'i2',
        update: ({ progE }) => {
          overlay.value.style.transform = `translateY(${N.Lerp(-100, -19, progE)}%)`
          // canvas.currentPage.node.position.y = -progE * 300 * scale.value * canvas.size.value.height / vh.value
        },
      })
      tl.from({
        d: DURATION / 2,
        delay: DURATION / 2 + ooo,
        e: 'o2',
        update: ({ progE }) => {
          // overlay.value.style.transform = `translateY(${progE * 100}%)`
          overlay.value.style.transform = `translateY(${N.Lerp(-19, 75, progE)}%)`
        },
        cb: () => {
          overlay.value.style.transform = `translateY(-100%)`
        }
      }).from({
        d: DURATION / 2,
        el: path,
        e: 'o1',
        svg: {
          type: 'd',
          start: pFrom,
          end: pTo
        },
        cb: () => {
          useStore().preloaderComplete.value = true
          this.destroy()
        },
      }).from({
        d: DURATION / 2,
        el: path,
        delay: DURATION / 2 + ooo,
        e: 'o1',
        svg: {
          type: 'd',
          start: pTo,
          end: pFrom
        },

      }).play()
    } else {


      // I guess there is a spike in ram use because of gpu loading and raf init
      await new Promise<void>((res) => {
        useDelay(50, () => res())
      })
      const promise = []
      for (let i = 0; i < this.nodes.length; i++) {
        const p = new Promise<void>((res) => {
          useDelay(200 * i, () => {
            const node = this.nodes[i]
            node.growAnimation().then(() => {
              res()
            })
          })
        })
        promise.push(p)
      }

      await Promise.all(promise)


      // this.nodes[1].node.rotation.set(-Math.PI * 0.5, 0, 0)

      // const tl = useTL()
      // tl.from({
      //   d: 1000,
      //   e: "io3",
      //   update: ({ progE, prog }) => {

      //     this.group.rotation.set(progE * Math.PI * 0.5, 0, 0)
      //     // this.nodes[1].mesh.program.uniforms.uMorph.value = N.Ease.io4(prog)

      //     this.nodes[1].mesh.program.uniforms.uMorph.value = progE

      //   },
      //   cb: () => {
      //     this.nodes[0].node.rotation.set(-Math.PI * 1, 0, 0)
      //     this.nodes[0].computeUniforms(0.8)
      //   },
      // }).from({
      //   d: 1000,
      //   e: "io3",
      //   delay: 1000,
      //   update: ({ progE, prog }) => {
      //     this.group.rotation.set((1 + progE) * Math.PI * 0.5, 0, 0)
      //     this.nodes[0].mesh.program.uniforms.uMorph.value = progE
      //   },
      //   cb: () => {
      //     this.nodes[0].growToHome().then(() => {
      //       useStore().preloaderComplete.value = true
      //       this.destroy()
      //     })
      //   },
      // }).play()


    }
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
