import { Vec2, Program, Mesh, Texture, Plane, Vec3 } from 'ogl'
import { basicVer } from "../../shaders/BasicVer";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import type { ROR } from "~/plugins/core/resize";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity } from "../../utils/WebGL.utils";
import type { Timeline } from "~/plugins/core/motion";

const { vh, vw, mouse, firstMove } = useStoreView()
const { isHold } = useCursorStore()
// const m = toRefs(mouse)
const { idToIndex, stack, imageBounds, currentIndex, hideTrail } = useStoreStepper()

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
    tl: Timeline;
    uTransparency: { value: number; };
    index: number;
    fake: boolean;
    tMap: { value: Texture; };
    uHide: { value: number; };

    constructor(gl: any, props: { borderRadius?: number, lerp: number, renderOrder: number, texture: Texture, index: number, fake?: boolean }) {
        super(gl)
        N.BM(this, ['update', 'onResize', 'destroy', 'onMouseMove'])

        this.lerp = props.lerp
        this.index = props.index

        this.fake = props.fake || false
        if (!this.fake) {
            idToIndex.set(this.id, this.index)
        }

        // this.fake && (this.uId = [1, 1, 1, 1])

        this.positionTarget = new Vec3(0, 0, 0)
        this.renderOrder = props.renderOrder

        // this.texture = this.fake ? new Texture(this.gl) : props.texture
        this.tMap = { value: props.texture }
        this.uIntrinsecRatio = this.tMap.value.image
            ? (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height
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
        this.tl = useTL()

        this.uBorderRadius = { value: props?.borderRadius || 5 }
        this.uTransparency = { value: 0 }
        this.uHide = { value: 1 }

        this.raf = useRafR(this.update)
        this.uResolution = { value: [innerWidth, innerHeight] }


        this.mount()
        this.init()

        const { unWatch: resizeUnWatch } = useCanvasSize(this.onResize)

        this.addEventListener()

        this.onDestroy(() => this.raf.stop())
        this.onDestroy(() => resizeUnWatch())
    }

    setRenderOrder(i: number) {
        this.renderOrder = i;
        (this.node as Mesh).renderOrder = i
    }

    addEventListener() {
        const { watch } = useCanvasReactivity(this)
        watch(mouse, this.onMouseMove)

        watch(firstMove, (b: boolean) => {
            if (!b) return
            const { size } = useCanvas()
            this.positionTarget.set(
                (mouse.value.x - vw.value / 2 + imageBounds.w * 0.5 + 18) * size.value.width / vw.value,
                (vh.value / 2 - mouse.value.y + imageBounds.h * 0.5 + 18) * size.value.height / vh.value,
                0
            )
            this.node.position.set(this.positionTarget)
        }, { immediate: true })


        const tl = useTL()

        watch(hideTrail, (b: boolean) => {
            const from = this.uHide.value
            const to = +b;
            tl.reset()
            tl.from({
                d: 200,
                update: (e) => {
                    this.uHide.value = N.Lerp(from, to, e.progE)
                }
            }).play()
        })
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
                uTransparency: this.uTransparency,
                uFake: { value: this.fake ? 1 : 0 },
                uCaca: {value: 0},
                uHide: this.uHide,
                uId: this.uId
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
        this.positionTarget.set(
            (mouse.x - vw.value / 2 + imageBounds.w * 0.5 + 18) * size.value.width / vw.value,
            (vh.value / 2 - mouse.y + imageBounds.h * 0.5 + 18) * size.value.height / vh.value,
            0
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
    color = mix(color, vec4(0.), uHide);

    color = mix(color, vec4(0.), uFake);
    vec4 borderColor = mix(color, vec4(0.98,1.,0., 1.), uTransparency);
    float borderWidth = 1.;

    float xPixel = vUv.x * uSizePixel.x;
    float yPixel = vUv.y * uSizePixel.y;

    if(xPixel < borderWidth) color = borderColor;
    if(xPixel > uSizePixel.x - borderWidth) color = borderColor;
    if(yPixel > uSizePixel.y - borderWidth) color = borderColor;
    if(yPixel < borderWidth) color = borderColor;

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