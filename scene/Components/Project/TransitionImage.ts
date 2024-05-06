import { Vec2, Program, Mesh, Texture, Plane, Vec3, Transform } from 'ogl'
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity } from "../../utils/WebGL.utils";

const { vh, vw, scale, mouse } = useStoreView()

export class TransitionImage extends CanvasNode {
    raf: RafR;
    uBorderRadius: { value: number; };
    uSizePixel: { value: Vec2; };
    uScaleOffset: { value: Vec2; };
    uTranslateOffset: { value: Vec2; };

    tMap: { value: Texture; };

    uProgress: { value: number; };
    uIntrinsecRatio: number;
    uDarken = { value: 0 };

    constructor(gl: any, props: { texture: Texture }) {
        super(gl)
        N.BM(this, ['update', 'onResize', 'destroy'])

        this.tMap = { value: props.texture }
        this.uSizePixel = { value: new Vec2(vw.value, vh.value) }

        const uIntrinsecRatio = 1
        this.uIntrinsecRatio = this.tMap.value.image
            ? (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height
            : 1;
        this.uScaleOffset = {
            value: new Vec2(
                1, 1
            )
        };
        this.uTranslateOffset = {
            value: new Vec2(
                1, 1
            )
        };

        this.uProgress = { value: 0 }


        this.uBorderRadius = { value: 5 }

        this.raf = useRafR(this.update)

        const { watch } = useCanvasReactivity(this)

        // watch(mouse, this.onMouseMove)
        this.mount()
        this.init()

        const { unWatch: resizeUnWatch } = useCanvasSize(this.onResize)
        this.addEventListener()

        this.onDestroy(() => resizeUnWatch())
        this.onDestroy(() => this.raf.stop())
    }

    addEventListener() {
    }


    init() {
        this.raf.run()
    }

    mount() {
        this.node = new Transform()
        const geometry = new Plane(this.gl, {
            widthSegments: 40,
            heightSegments: 40
        })

        const program = new Program(this.gl, {
            fragment,
            vertex,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                tMap: this.tMap,
                uSizePixel: this.uSizePixel,
                uBorderRadius: this.uBorderRadius,
                uScaleOffset: this.uScaleOffset,
                uDarken: this.uDarken,
                uTranslateOffset: this.uTranslateOffset,
                uProgress: this.uProgress,
                uId: this.uId
            }
        })

        const a = new Mesh(this.gl, {
            geometry,
            program,
        })
        a.setParent(this.node)
    }


    update(e: rafEvent) {
    }

    computeUniforms() {
        this.uScaleOffset.value.set(
            this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
                ? this.uSizePixel.value[0] /
                (this.uSizePixel.value[1] * this.uIntrinsecRatio)
                : 1,
            this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
                ? 1
                : (this.uSizePixel.value[1] * this.uIntrinsecRatio) /
                this.uSizePixel.value[0],
        )
        this.uTranslateOffset.value.set(
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
        )
    }

    onResize(canvasSize: { width: number, height: number }) {
        // this.uSizePixel.value.set(vw.value, vh.value)
        this.uScaleOffset.value.set(
            this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
                ? this.uSizePixel.value[0] /
                (this.uSizePixel.value[1] * this.uIntrinsecRatio)
                : 1,
            this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
                ? 1
                : (this.uSizePixel.value[1] * this.uIntrinsecRatio) /
                this.uSizePixel.value[0],
        )
        this.uTranslateOffset.value.set(
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
        )
        this.node.scale.set(
            canvasSize.width * this.uSizePixel.value.x / vw.value,
            canvasSize.height * this.uSizePixel.value.y / vh.value,
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

uniform vec4 uId;

in vec2 vUv;
out vec4 FragColor[2];

uniform float uDarken;

void main() {
    // object-fix: cover
    vec4 color = texture(tMap, vUv * uScaleOffset + uTranslateOffset);
    color = mix(color, vec4(0., 0., 0., 1.), mix(0.25, 0., uDarken));

    vec2 cornerTopRight = vec2((vUv.x - 1.) * uSizePixel.x, (vUv.y - 1.) * uSizePixel.y);
    cornerTopRight += uBorderRadius;
    if(cornerTopRight.x > 0.  && cornerTopRight.y > 0.){
        if(sqrt(cornerTopRight.y * cornerTopRight.y + cornerTopRight.x * cornerTopRight.x)> uBorderRadius ) discard;
    }

    vec2 cornerTopLeft = vec2(vUv.x * uSizePixel.x, (vUv.y - 1.) * uSizePixel.y);
    cornerTopLeft += vec2(-uBorderRadius, uBorderRadius);
    if(cornerTopLeft.x < 0.  && cornerTopLeft.y > 0.){
        if(sqrt(cornerTopLeft.y * cornerTopLeft.y + cornerTopLeft.x * cornerTopLeft.x) > uBorderRadius ) discard;
    }

    vec2 cBL = vec2(vUv.x * uSizePixel.x, vUv.y * uSizePixel.y);
    cBL += vec2(-uBorderRadius, -uBorderRadius);
    if(cBL.x < 0.  && cBL.y < 0.){
        if(sqrt(cBL.y * cBL.y + cBL.x * cBL.x) > uBorderRadius ) discard;
    }

    vec2 cBR = vec2((vUv.x - 1.) * uSizePixel.x, vUv.y * uSizePixel.y);
    cBR += vec2(uBorderRadius, -uBorderRadius);
    if(cBR.x > 0.  && cBR.y < 0.){
        if(sqrt(cBR.y * cBR.y + cBR.x * cBR.x) > uBorderRadius ) discard;
    }

    FragColor[0] = color;
    // FragColor[0] = vec4(1.,0.,0.,1.);
    FragColor[1] = uId;
}
`
const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec2 uSizePixel;
uniform float uProgress;

out vec2 vUv;

void main() {
    vUv = uv;

    vec4 mvmP = modelViewMatrix * vec4(position, 1.);

    vec4 vP = vec4(position, 1.);

    vec2 coord = vec2(vP.x * uSizePixel.x, vP.y * uSizePixel.y);
    float dMax = sqrt(uSizePixel.x * uSizePixel.x + uSizePixel.y * uSizePixel.y);
    float d = sqrt(coord.x * coord.x + coord.y * coord.y);

    mvmP.z += (cos(d / dMax * 3.1415 )  - 1. )* 1. * uProgress;

    gl_Position = projectionMatrix * mvmP;
}`;