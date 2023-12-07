import { Vec2, Program, Mesh, Texture, Plane, Vec3 } from 'ogl'
import { basicVer } from "../../shaders/BasicVer";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity } from "../../utils/WebGL.utils";

const { vh, vw } = useStoreView()

export class PreloaderImage extends CanvasNode {
    raf: RafR;

    uSizePixel: { value: Vec2; };
    uIntrinsecRatio: number;
    uScaleOffset: { value: number[]; };
    uTranslateOffset: { value: number[]; };
    tMap: { value: Texture; };
    targetSize: { width: number; height: number; };
    canvasSize!: { width: number; height: number; };

    constructor(gl: any, props: { texture: Texture }) {
        super(gl)
        N.BM(this, ['update', 'onResize', 'destroy'])



        // this.fake && (this.uId = [1, 1, 1, 1])

        // this.texture = this.fake ? new Texture(this.gl) : props.texture
        this.tMap = {
            value: props.texture
        }


        this.uIntrinsecRatio = this.tMap.value.image
            ? (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height
            : 1;
        this.uSizePixel = { value: new Vec2(0) }
        this.targetSize = {
            width: 1,
            height: 1
        }

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


        const { unWatch: resizeUnWatch } = useCanvasSize(this.onResize)
        this.raf = useRafR(this.update)

        this.mount()
        this.init()


        this.addEventListener()

        this.onDestroy(() => this.raf.stop())
        this.onDestroy(() => resizeUnWatch())
    }


    addEventListener() {
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
            depthTest: false,
            depthWrite: false,
            uniforms: {
                tMap: this.tMap,
                uSizePixel: this.uSizePixel,
                uScaleOffset: this.uScaleOffset,
                uTranslateOffset: this.uTranslateOffset,
                uId: this.uId
            }
        })

        this.node = new Mesh(this.gl, {
            geometry,
            program,
        })

        this.node.scale.set(0, 0, 0)

    }


    update(e: rafEvent) {
    }

    growAnimation() {
        useTL().from({
            d: 800,
            e: 'io3',
            update: (e) => {
                this.uSizePixel.value.set(
                    N.Lerp(0, this.targetSize.width, e.progE),
                    N.Lerp(0, this.targetSize.height, e.progE)
                )

                this.computeUniforms()

                this.node.scale.set(
                    this.canvasSize.width * this.uSizePixel.value.x / vw.value,
                    this.canvasSize.height * this.uSizePixel.value.y / vh.value,
                    1
                )
            }
        }).play()
    }


    onResize(canvasSize: { width: number, height: number }) {
        this.canvasSize = canvasSize

        this.computeUniforms()
    }
    computeUniforms() {
        const imageBounds = usePreloaderStore().getBounds()
        this.targetSize.width = imageBounds.value.width
        this.targetSize.height = imageBounds.value.height

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

        // this.targetSize.width = this.canvasSize.width * this.uSizePixel.value.x / vw.value
        // this.targetSize.height = this.canvasSize.height * this.uSizePixel.value.y / vh.value

    }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform vec2 uSizePixel;
uniform vec2 uScaleOffset;
uniform vec2 uTranslateOffset;

uniform vec4 uId;

in vec2 vUv;
out vec4 FragColor[2];


void main() {
    // object-fix: cover
    vec4 color = texture(tMap, vUv * uScaleOffset + uTranslateOffset);

    // vec2 cornerTopRight = vec2((vUv.x - 1.) * uSizePixel.x, (vUv.y - 1.) * uSizePixel.y);
    // cornerTopRight += uBorderRadius;
    // if(cornerTopRight.x > 0.  && cornerTopRight.y > 0.){
    //     if(sqrt(cornerTopRight.y * cornerTopRight.y + cornerTopRight.x * cornerTopRight.x)> uBorderRadius ) discard;
    // }

    // vec2 cornerTopLeft = vec2(vUv.x * uSizePixel.x, (vUv.y - 1.) * uSizePixel.y);
    // cornerTopLeft += vec2(-uBorderRadius, uBorderRadius);
    // if(cornerTopLeft.x < 0.  && cornerTopLeft.y > 0.){
    //     if(sqrt(cornerTopLeft.y * cornerTopLeft.y + cornerTopLeft.x * cornerTopLeft.x) > uBorderRadius ) discard;
    // }

    // vec2 cBL = vec2(vUv.x * uSizePixel.x, vUv.y * uSizePixel.y);
    // cBL += vec2(-uBorderRadius, -uBorderRadius);
    // if(cBL.x < 0.  && cBL.y < 0.){
    //     if(sqrt(cBL.y * cBL.y + cBL.x * cBL.x) > uBorderRadius ) discard;
    // }

    // vec2 cBR = vec2((vUv.x - 1.) * uSizePixel.x, vUv.y * uSizePixel.y);
    // cBR += vec2(uBorderRadius, -uBorderRadius);
    // if(cBR.x > 0.  && cBR.y < 0.){
    //     if(sqrt(cBR.y * cBR.y + cBR.x * cBR.x) > uBorderRadius ) discard;
    // }

    FragColor[0] = color;
    FragColor[1] = uId;
}
`