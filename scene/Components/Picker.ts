
import { Transform, Camera, RenderTarget, Program, type OGLRenderingContext } from 'ogl'

import { CanvasNode } from '../utils/types';
import { EventHandler } from '../utils/WebGL.utils';
import { providePicker } from '~/composables/useCanvas';
import type { ResizeEvent } from '~/plugins/core/resize';

const { mouse, vh, vw, canvasBg } = useStoreView()
const { pickerDark } = useCursorStore()

// Drop frames with mousemove after 300 meshes
export class Picker extends CanvasNode {
    dpr: number;
    camera: Camera;

    indexPicked: number;

    needUpdate: { click: boolean; hover: number; on: boolean; };
    renderTargetRatio: number;
    hoverHandler: EventHandler;
    clickHandler: EventHandler;
    target!: RenderTarget;
    constructor(gl: OGLRenderingContext, options?: { camera?: Camera, renderTargetRatio?: number }) {
        super(gl)
        this.camera = options?.camera || useCanvas().camera

        this.dpr = devicePixelRatio
        this.renderTargetRatio = options?.renderTargetRatio || 4

        this.needUpdate = {
            click: false,
            hover: -1,
            on: false
        }
        this.indexPicked = -1

        N.BM(this, ['pick'])
        const click = () => {
            this.needUpdate.click = true
            this.needUpdate.on = true
        }
        const hover = () => {
            // this.needUpdate.hover = true
            this.needUpdate.on = true
        }
        document.addEventListener('mouseup', click)
        // document.addEventListener('touchend', click)

        this.onDestroy(() => {
            document.removeEventListener('mouseup', click)
            // document.addEventListener('touchend', click)
        })

        this.clickHandler = new EventHandler()
        this.hoverHandler = new EventHandler()
        this.onDestroy(this.hoverHandler.kill.bind(this))
        this.onDestroy(this.clickHandler.kill.bind(this))

        this.onDestroy(providePicker(this))
    }

    mount() {
        this.target = new RenderTarget(this.gl, {
            color: 2,
            width: innerWidth * devicePixelRatio / this.renderTargetRatio,
            height: innerHeight * devicePixelRatio / this.renderTargetRatio
        })

    }
    init() {
        const ro = useROR(({ vw, vh }) => {
            this.dpr = devicePixelRatio
            this.target.setSize(vw * this.dpr / this.renderTargetRatio, vh * this.dpr / this.renderTargetRatio)
        })
        ro.on()
        this.onDestroy(() => ro.off())

        const raf = useRafR(this.pick)
        raf.run()
        this.onDestroy(() => raf.kill())
    }

    add(canvasNode: CanvasNode) {
        this.node = canvasNode.node

        this.mount()
        this.init()

        canvasNode.onDestroy(() => {
            this.destroy()
        })
        return this
    }

    onClick(id: number, callback: (e: number) => void) {
        this.clickHandler.on(id, callback)
    }
    useHover(id: number) {
        const hover = ref(false)
        this.hoverHandler.on(id, (e: { state: boolean }) => {
            hover.value = e.state
        })
        return hover
    }

    private pick() {
        this.gl.clearColor(canvasBg.value[0], canvasBg.value[1], canvasBg.value[2], canvasBg.value[3]);
        this.gl.renderer.render({
            scene: this.node,
            camera: this.camera,
            target: this.target
        });


        if (!this.gl.renderer.isWebgl2) {
            console.warn("Picking not allowed")
        }

        (this.gl as WebGL2RenderingContext).readBuffer((this.gl as WebGL2RenderingContext).COLOR_ATTACHMENT0);
        const dataLumos = new Uint8Array(4);
        this.gl.readPixels(
            mouse.value.x * this.dpr / this.renderTargetRatio,
            (vh.value - mouse.value.y) * this.dpr / this.renderTargetRatio,
            1,
            1,
            this.gl.RGBA,           // format
            this.gl.UNSIGNED_BYTE,  // type
            dataLumos);             // typed array to hold result
        const indexLumos = (dataLumos[0] * 0.2126 + dataLumos[1] * 0.7152 + dataLumos[2] * 0.0722) / 255;
        pickerDark.value = indexLumos >= 0.5;
        // L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

        // Framebuffer is binded from render()
        // now read the right gl.COLOR_ATTACHMENT
        // in this pipeline, uIDs are drawn in FragColor[1]
        (this.gl as WebGL2RenderingContext).readBuffer((this.gl as WebGL2RenderingContext).COLOR_ATTACHMENT1);

        const data = new Uint8Array(4);
        this.gl.readPixels(
            mouse.value.x * this.dpr / this.renderTargetRatio,
            (vh.value - mouse.value.y) * this.dpr / this.renderTargetRatio,
            1,
            1,
            this.gl.RGBA,           // format
            this.gl.UNSIGNED_BYTE,  // type
            data);             // typed array to hold result

        // const index = data[0] + data[1] * 256 + data[2] * 256 * 256 + data[3] * 256 * 256 * 256

        // Removed the alpha chanel, was messing up thing because of transparency whatever
        const index = data[0] + (data[1] << 8) + (data[2] << 16);

        this.eventHandling(index)
        this.gl.clearColor(0, 0, 0, 0);
    }

    eventHandling(index: number) {
        if (this.needUpdate.click) {
            this.clickHandler.emit(index, index)
        }

        if (this.needUpdate.hover != this.indexPicked) {
            this.hoverHandler.emit(this.needUpdate.hover, { state: false })
            this.hoverHandler.emit(index, { state: true })
            this.needUpdate.hover = this.indexPicked
        }

        this.indexPicked = index >= 0 ? index : -1
        this.needUpdate.click = false
        // this.needUpdate.hover = false
        // this.needUpdate.on = false
    }
}

const pickerFragment = /* glsl */ `#version 300 es
precision highp float;

uniform vec4 uId;

in vec2 vUv;
out vec4 FragColor;

void main() {
  FragColor = uId;
}
`