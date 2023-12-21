import type { RafR, rafEvent } from "~/plugins/core/raf"
import type { ROR, ResizeEvent } from "~/plugins/core/resize"
import { CanvasPage } from "../utils/types"
import { Transform, type Camera, type OGLRenderingContext, type Renderer } from "ogl"

export class FallbackCanvas extends CanvasPage {

  ro: ROR
  raf: RafR
  canvasScene: any
  target: any;
  renderer: Renderer;
  camera: Camera;
  scene: Transform;
  once: boolean

  constructor(gl: OGLRenderingContext, options: { scene: Transform, camera: Camera }) {
    super(gl)

    this.renderer = this.gl.renderer

    this.scene = options.scene
    this.node = new Transform()
    this.node.setParent(this.scene)

    this.camera = options.camera

    N.BM(this, ['render', 'resize'])

    this.ro = useROR(this.resize)
    this.onDestroy(() => this.ro.off())
    this.raf = useRafR(this.render)
    this.onDestroy(() => this.raf.kill())

    this.once = false
  }
  init() {
    this.raf.run()
    this.ro.on()
  }

  resize({ vh, vw, scale, breakpoint }: ResizeEvent) {
  }

  render(e: rafEvent) {
    if (this.once) {
      this.raf.stop()
      return
    }
    this.renderer.render({
      camera: this.camera,
      scene: this.scene
    })
    this.once = true
  }

}