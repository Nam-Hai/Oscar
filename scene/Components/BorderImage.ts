import Callstack from "../utils/Callstack";

import { Vec2, Program, Mesh, Texture, Plane, Vec3 } from 'ogl'
import { basicVer } from "../shaders/BasicVer";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import type { ROR } from "~/plugins/core/resize";
import { CanvasNode } from "../utils/types";
import { useCanvasReactivity } from "../utils/WebGL.utils";

const { vh, vw, mouse } = useStoreView()
const { isHold } = useCursorStore()
// const m = toRefs(mouse)
const imageBounds = { w: 100, h: 60 }

export class BorderImage extends CanvasNode {
    raf: RafR;
    uResolution: { value: number[]; };
    uBorderRadius: { value: number; };
    uSizePixel: { value: Vec2; };
    uIntrinsecRatio: number;
    uScaleOffset: { value: number[]; };
    uTranslateOffset: { value: number[]; };
    positionTarget: Vec3;
    lerp: number;
    renderOrder: number;

    constructor(gl: any, props: { borderRadius?: number, lerp: number, renderOrder: number }) {
        super(gl)
        N.BM(this, ['update', 'onResize', 'destroy', 'onMouseMove', 'onHold'])

        this.lerp = props.lerp

        this.positionTarget = new Vec3(0, 0, 0)
        this.renderOrder = props.renderOrder

        const texture = useManifest().textures.home[0]
        this.uIntrinsecRatio = texture.image
            ? (texture.image as HTMLImageElement).width / (texture.image as HTMLImageElement).height
            : 1;
        this.uSizePixel = { value: new Vec2(imageBounds.w, imageBounds.h) }
        this.uScaleOffset = {
            value: [
                this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
                    ? this.uSizePixel.value[0] /
                    (this.uSizePixel.value[1] * this.uIntrinsecRatio)
                    : 1,
                this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
                    ? 1
                    : (this.uSizePixel.value[1] * this.uIntrinsecRatio) /
                    this.uSizePixel.value[0],
            ]
        };
        this.uTranslateOffset = {
            value: [
                this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
                    ? 0.5 *
                    (1 -
                        this.uSizePixel.value[0] /
                        (this.uSizePixel.value[1] * this.uIntrinsecRatio))
                    : 0,
                this.uSizePixel.value[0] / this.uSizePixel.value[1] <=
                    this.uIntrinsecRatio
                    ? 0
                    : (1 -
                        (this.uSizePixel.value[1] * this.uIntrinsecRatio) /
                        this.uSizePixel.value[0]) *
                    0.5,
            ]
        };

        this.uBorderRadius = { value: props?.borderRadius || 2 }

        this.raf = useRafR(this.update)
        this.uResolution = { value: [innerWidth, innerHeight] }


        const { watch } = useCanvasReactivity(this)
        watch(mouse, this.onMouseMove)
        watch(isHold, this.onHold)
        this.mount()
        this.init()

        const { unWatch: resizeUnWatch } = useCanvasSize(this.onResize)


        this.onDestroy(() => this.raf.stop())
        this.onDestroy(() => resizeUnWatch())
    }


    init() {
        this.raf.run()
    }

    mount() {
        const geometry = new Plane(this.gl, {
        })

        const texture = useManifest().textures.home[2 - this.renderOrder]
        const program = new Program(this.gl, {
            fragment,
            vertex: basicVer,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                tMap: { value: texture },
                uSizePixel: this.uSizePixel,
                uBorderRadius: this.uBorderRadius,
                uScaleOffset: this.uScaleOffset,
                uTranslateOffset: this.uTranslateOffset
            }
        })

        this.node = new Mesh(this.gl, {
            geometry,
            program,
            renderOrder: this.renderOrder
        })
    }

    update(e: rafEvent) {
        this.node.position.lerp(this.positionTarget, this.lerp)
    }

    onMouseMove(mouse: { x: number, y: number }) {
        const { size } = useCanvas()
        // console.log(size.value, vh.value, vw.value, mouse.x - vw.value / 2, vh.value / 2 - mouse.y);
        this.positionTarget.set(
            (mouse.x - vw.value / 2 + imageBounds.w * 0.5 + 18) * size.value.width / vw.value,
            (vh.value / 2 - mouse.y + imageBounds.h * 0.5 + 18) * size.value.height / vh.value,
            0
        )
    }

    onHold(h: boolean) {
        const p = this.positionTarget.clone()
        const { size } = useCanvas()

        const o = (imageBounds.w + 8) * (2 - this.renderOrder) * size.value.width / vw.value
        const offset = h ? o : - o
        this.positionTarget.set(
            p.x + offset,
            p.y,
            p.z
        )
    }

    onResize(canvasSize: { width: number, height: number }) {

        this.uResolution.value = [vw.value, vh.value]

        this.uScaleOffset.value = [
            this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
                ? this.uSizePixel.value[0] /
                (this.uSizePixel.value[1] * this.uIntrinsecRatio)
                : 1,
            this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
                ? 1
                : (this.uSizePixel.value[1] * this.uIntrinsecRatio) /
                this.uSizePixel.value[0],
        ];
        this.uTranslateOffset.value = [
            this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
                ? 0.5 *
                (1 -
                    this.uSizePixel.value[0] /
                    (this.uSizePixel.value[1] * this.uIntrinsecRatio))
                : 0,
            this.uSizePixel.value[0] / this.uSizePixel.value[1] <=
                this.uIntrinsecRatio
                ? 0
                : (1 -
                    (this.uSizePixel.value[1] * this.uIntrinsecRatio) /
                    this.uSizePixel.value[0]) *
                0.5,
        ];

        this.node.scale.set(
            canvasSize.width * this.uSizePixel.value.x / this.uResolution.value[0],
            canvasSize.height * this.uSizePixel.value.y / this.uResolution.value[1],
            1
        )
    }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform vec2 uSizePixel;
uniform vec2 uScaleOffset;
uniform vec2 uTranslateOffset;
uniform float uBorderRadius;

in vec2 vUv;
out vec4 FragColor;


void main() {
    // object-fix: cover
    vec4 color = texture(tMap, vUv * uScaleOffset + uTranslateOffset);
    color.a = 1.;

    vec2 cornerTopRight = vec2((vUv.x - 1.) * uSizePixel.x, (vUv.y - 1.) * uSizePixel.y);
    cornerTopRight += uBorderRadius;

    if(cornerTopRight.x > 0.  && cornerTopRight.y > 0.){
        cornerTopRight/= uBorderRadius;
        if(cornerTopRight.y * cornerTopRight.y + cornerTopRight.x * cornerTopRight.x > 1. ) color.a = 0.;
    }

    vec2 cornerTopLeft = vec2(vUv.x * uSizePixel.x, (vUv.y - 1.) * uSizePixel.y);
    cornerTopLeft += vec2(-uBorderRadius, uBorderRadius);
    if(cornerTopLeft.x < 0.  && cornerTopLeft.y > 0.){
        cornerTopLeft/= uBorderRadius;
        if(cornerTopLeft.y * cornerTopLeft.y + cornerTopLeft.x * cornerTopLeft.x > 1. ) color.a = 0.;
    }

    vec2 cBL = vec2(vUv.x * uSizePixel.x, vUv.y * uSizePixel.y);
    cBL += vec2(-uBorderRadius, -uBorderRadius);
    if(cBL.x < 0.  && cBL.y < 0.){
        cBL/= uBorderRadius;
        if(cBL.y * cBL.y + cBL.x * cBL.x > 1. ) color.a = 0.;
    }

    vec2 cBR = vec2((vUv.x - 1.) * uSizePixel.x, vUv.y * uSizePixel.y);
    cBR += vec2(uBorderRadius, -uBorderRadius);
    if(cBR.x > 0.  && cBR.y < 0.){
        cBR/= uBorderRadius;
        if(cBR.y * cBR.y + cBR.x * cBR.x > 1. ) color.a = 0.;
    }

    FragColor = color;
}
`