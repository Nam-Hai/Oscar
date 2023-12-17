
import { Vec2, Program, Mesh, Texture, Plane, Vec3, Transform } from 'ogl'
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity } from "../../utils/WebGL.utils";

const { vh, vw, scale, mouse } = useStoreView()

export class TransitionMediaTest extends CanvasNode {
    raf: RafR;
    uBorderRadius: { value: number; };
    uSizePixel: { value: Vec2; };
    uScaleOffset: { value: Vec2; };
    uTranslateOffset: { value: Vec2; };

    tMap: { value: Texture; };

    intrinsecRatio: number

    uVelo = { value: 0 }

    canvasSize!: { width: number; height: number; };
    on: boolean = false;
    pixelPosition: Vec2;

    constructor(gl: any, props: { borderRadius?: number, texture: Texture }) {
        super(gl)
        N.BM(this, ['update', 'onResize', 'destroy'])

        this.pixelPosition = new Vec2(0)
        this.uSizePixel = { value: new Vec2(1, 1) }

        this.tMap = { value: props.texture }
        this.intrinsecRatio = (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height

        this.uScaleOffset = {
            value: new Vec2(
                1, 1
            )
        };
        this.uTranslateOffset = {
            value: new Vec2(
                0, 0
            )
        };

        this.uBorderRadius = { value: props?.borderRadius || 5 }

        this.raf = useRafR(this.update)



        this.mount()

        this.addEventListener()

        this.init()



        this.onDestroy(() => this.raf.stop())
    }

    addEventListener() {
        const { watch } = useCanvasReactivity(this)

        const { unWatch: resizeUnWatch } = useCanvasSize(this.onResize)

        this.onDestroy(() => resizeUnWatch())
    }



    init() {
        this.raf.run()
    }

    mount() {
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
                uTranslateOffset: this.uTranslateOffset,
                uVelo: this.uVelo,
                uId: this.uId
            }
        })

        this.node = new Mesh(this.gl, {
            geometry,
            program,
        })
    }


    update(e: rafEvent) {

        this.node.position.set(
            this.canvasSize.width * (this.pixelPosition.x) / vw.value,
            this.canvasSize.height * (this.pixelPosition.y) / vh.value,
            0
        )

        this.node.scale.set(
            this.canvasSize.width * (this.uSizePixel.value.x) / vw.value,
            this.canvasSize.height * (this.uSizePixel.value.y) / vh.value,
            1
        )
    }

    onResize(canvasSize: { width: number, height: number }) {
        this.canvasSize = canvasSize

        this.computeUniforms()

    }

    computeUniforms() {
        this.on = true
        this.uScaleOffset.value.set(
            this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.intrinsecRatio
                ? this.uSizePixel.value[0] /
                (this.uSizePixel.value[1] * this.intrinsecRatio)
                : 1,
            this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.intrinsecRatio
                ? 1
                : (this.uSizePixel.value[1] * this.intrinsecRatio) /
                this.uSizePixel.value[0],
        )
        this.uTranslateOffset.value.set(
            this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.intrinsecRatio
                ? 0.5 *
                (1 -
                    this.uSizePixel.value[0] /
                    (this.uSizePixel.value[1] * this.intrinsecRatio))
                : 0,
            this.uSizePixel.value[0] / this.uSizePixel.value[1] <=
                this.intrinsecRatio
                ? 0
                : (1 -
                    (this.uSizePixel.value[1] * this.intrinsecRatio) /
                    this.uSizePixel.value[0]) *
                0.5,
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

void main() {
    // object-fix: cover
    vec4 color = texture(tMap, vUv * uScaleOffset + uTranslateOffset);

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
#define PI 3.1415926

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uVelo;

out vec2 vUv;

void main() {
    vUv = uv;
    vec3 p = position;
    float f = 1000.;
    p.y += cos(p.x* PI) * clamp(uVelo, -f, f) / f;

    vec4 mvmP = modelViewMatrix * vec4(p, 1.);

    gl_Position = projectionMatrix * mvmP;
}`;
export { vertex as veloVertex }