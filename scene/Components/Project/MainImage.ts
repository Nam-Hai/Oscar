import { Vec2, Program, Mesh, Texture, Plane, Vec3 } from 'ogl'
import { basicVer } from "../../shaders/BasicVer";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity } from "../../utils/WebGL.utils";
import { canvasInject } from '~/composables/useCanvas';

const { vh, vw, mouse } = useStoreView()

export const [provideMainImage, useCanvasMainImageProject] = canvasInject<MainImage>('canvas-main-image-project')

export class MainImage extends CanvasNode {
    raf: RafR;
    uBorderRadius: { value: number; };
    uSizePixel: { value: Vec2; };
    uIntrinsecRatio: number;
    uScaleOffset: { value: number[]; };
    uTranslateOffset: { value: number[]; };
    uTransparency: { value: number; };
    tMap: { value: Texture; };
    uHide: { value: number; };

    el?: HTMLElement[];
    bounds?: DOMRect[];

    constructor(gl: any, props: { borderRadius?: number, el?: HTMLElement }) {
        super(gl)
        N.BM(this, ['update', 'onResize', 'destroy'])

        const manifest = useManifest()
        // this.tMap = { value: manifest.manifestTextures.home[src] || manifest.emptyTexture }
        this.tMap = { value: manifest.emptyTexture }
        this.uIntrinsecRatio = this.tMap.value.image
            ? (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height
            : 1;

        this.uSizePixel = { value: new Vec2(1, 1) }

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

        this.uBorderRadius = { value: props?.borderRadius || 5 }
        this.uTransparency = { value: 0 }
        this.uHide = { value: 0 }

        this.raf = useRafR(this.update)

        const { watch } = useCanvasReactivity(this)
        // watch(mouse, this.onMouseMove)
        this.mount()
        this.init()

        const { unWatch: resizeUnWatch } = useCanvasSize(this.onResize)

        provideMainImage(this)

        this.addEventListener()

        this.onDestroy(() => this.raf.stop())
        this.onDestroy(() => resizeUnWatch())
    }

    addEventListener() {
    }

    mountElement(el: HTMLElement, next: HTMLElement) {
        this.el = [el, next]


        const src = N.Ga(this.el[0], "data-src") || "/Assets/Home3.png"

        // console.log(src);
        // this.bounds = this.el.getBoundingClientRect()

        const manifest = useManifest()
        this.tMap.value = manifest.manifestTextures.home[src]
        console.log(this.tMap.value.image);
        this.uIntrinsecRatio = (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height

        this.onResize(useCanvas().size.value)

    }

    init() {
        this.raf.run()
    }

    mount() {
        const geometry = new Plane(this.gl, {
        })

        const program = new Program(this.gl, {
            fragment,
            vertex: basicVer,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                tMap: this.tMap,
                uSizePixel: this.uSizePixel,
                uBorderRadius: this.uBorderRadius,
                uScaleOffset: this.uScaleOffset,
                uTranslateOffset: this.uTranslateOffset,
                uId: this.uId
            }
        })

        this.node = new Mesh(this.gl, {
            geometry,
            program,
        })
    }


    update(e: rafEvent) {
        // this.node.position.lerp(this.positionTarget, this.lerp)
    }

    onResize(canvasSize: { width: number, height: number }) {
        if (!this.el) return

        this.bounds = [this.el[0].getBoundingClientRect(), this.el[1].getBoundingClientRect()]

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
            // canvasSize.width * this.uSizePixel.value.x / vw.value,
            // canvasSize.height * this.uSizePixel.value.y / vh.value,
            1,
            1,
            1
        )

        const x = this.bounds[0].x + this.bounds[0].width / 2 - vw.value / 2
        const y = vh.value / 2 - this.bounds[0].height / 2 - this.bounds[0].y
        this.node.position.set(
            // canvasSize.width * x / vw.value,
            // canvasSize.height * y / vh.value,
            0,
            0,
            0
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
// uniform float uBorderWidth;
uniform float uTransparency;
uniform float uHide;
uniform float uFake;

uniform vec4 uId;

in vec2 vUv;
out vec4 FragColor[2];


void main() {
    // object-fix: cover
    vec4 color = texture(tMap, vUv * uScaleOffset + uTranslateOffset);
    // color.a = 1.;

    // vec4 borderColor = mix(color, vec4(1.), uTransparency);
    vec4 borderColor = color;
    float borderWidth = 1.;

    // float xPixel = vUv.x * uSizePixel.x;
    // float yPixel = vUv.y * uSizePixel.y;

    // if(xPixel < borderWidth) color = borderColor;
    // if(xPixel > uSizePixel.x - borderWidth) color = borderColor;
    // if(yPixel > uSizePixel.y - borderWidth) color = borderColor;
    // if(yPixel < borderWidth) color = borderColor;

    vec2 cornerTopRight = vec2((vUv.x - 1.) * uSizePixel.x, (vUv.y - 1.) * uSizePixel.y);
    cornerTopRight += uBorderRadius;
    if(cornerTopRight.x > 0.  && cornerTopRight.y > 0.){
        if(sqrt(cornerTopRight.y * cornerTopRight.y + cornerTopRight.x * cornerTopRight.x)> uBorderRadius - borderWidth) color = borderColor;
        if(sqrt(cornerTopRight.y * cornerTopRight.y + cornerTopRight.x * cornerTopRight.x)> uBorderRadius ) discard;
    }

    vec2 cornerTopLeft = vec2(vUv.x * uSizePixel.x, (vUv.y - 1.) * uSizePixel.y);
    cornerTopLeft += vec2(-uBorderRadius, uBorderRadius);
    if(cornerTopLeft.x < 0.  && cornerTopLeft.y > 0.){
        if(sqrt(cornerTopLeft.y * cornerTopLeft.y + cornerTopLeft.x * cornerTopLeft.x) > uBorderRadius - borderWidth) color = borderColor;
        if(sqrt(cornerTopLeft.y * cornerTopLeft.y + cornerTopLeft.x * cornerTopLeft.x) > uBorderRadius ) discard;
    }

    vec2 cBL = vec2(vUv.x * uSizePixel.x, vUv.y * uSizePixel.y);
    cBL += vec2(-uBorderRadius, -uBorderRadius);
    if(cBL.x < 0.  && cBL.y < 0.){
        if(sqrt(cBL.y * cBL.y + cBL.x * cBL.x) > uBorderRadius - borderWidth ) color = borderColor;
        if(sqrt(cBL.y * cBL.y + cBL.x * cBL.x) > uBorderRadius ) discard;
    }

    vec2 cBR = vec2((vUv.x - 1.) * uSizePixel.x, vUv.y * uSizePixel.y);
    cBR += vec2(uBorderRadius, -uBorderRadius);
    if(cBR.x > 0.  && cBR.y < 0.){
        if(sqrt(cBR.y * cBR.y + cBR.x * cBR.x) > uBorderRadius - borderWidth ) color = borderColor;
        if(sqrt(cBR.y * cBR.y + cBR.x * cBR.x) > uBorderRadius ) discard;
    }

    FragColor[0] = color;
    FragColor[1] = uId;
}
`