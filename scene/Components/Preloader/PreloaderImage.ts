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
    progress: { old: number; new: number; };
    uVelo: { value: number; };
    uAcc: { value: number; };

    constructor(gl: any, props: { texture: Texture }) {
        super(gl)
        N.BM(this, ['update', 'onResize', 'destroy'])



        // this.fake && (this.uId = [1, 1, 1, 1])

        // this.texture = this.fake ? new Texture(this.gl) : props.texture
        this.tMap = {
            value: props.texture
        }


        this.uIntrinsecRatio = (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height
        this.uSizePixel = { value: new Vec2(0) }

        this.progress = {
            old: 0,
            new: 0
        }
        this.uVelo = { value: 0 }
        this.uAcc = { value: 0 }

        this.targetSize = {
            width: 1,
            height: 1
        }

        this.uScaleOffset = {
            value: [
                1, 1
            ]
        };
        this.uTranslateOffset = {
            value: [
                0, 0
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
            widthSegments: 20,
            heightSegments: 20
        })

        const program = new Program(this.gl, {
            fragment,
            vertex,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                tMap: this.tMap,
                uSizePixel: this.uSizePixel,
                uScaleOffset: this.uScaleOffset,
                uTranslateOffset: this.uTranslateOffset,
                uId: this.uId,

                uProgress: { value: 0 },
                uVelo: this.uVelo,
                uAcc: this.uAcc
            }
        })

        this.node = new Mesh(this.gl, {
            geometry,
            program,
        })

        this.node.scale.set(0, 0, 0)

    }


    update(e: rafEvent) {
        const prog = this.progress.old
        const velo = this.uVelo.value

        this.progress.old = this.progress.new
        this.uVelo.value = N.Round((this.progress.new - prog) / e.delta * 800, 5);
        this.uAcc.value = (this.uVelo.value - velo) / e.delta;

        this.node.scale.set(
            this.canvasSize.width * this.uSizePixel.value.x / vw.value,
            this.canvasSize.height * this.uSizePixel.value.y / vh.value,
            1
        )
    }

    growAnimation() {
        const tl = useTL()
        tl.from({
            d: 1000,
            e: 'o2',
            update: (e) => {
                this.progress.new = e.progE

                this.uSizePixel.value.set(
                    N.Lerp(0, this.targetSize.width, e.progE),
                    N.Lerp(0, this.targetSize.height, e.progE)
                )
                this.computeUniforms()
            }
        }).play()
    }


    onResize(canvasSize: { width: number, height: number }) {
        this.canvasSize = canvasSize

        const imageBounds = usePreloaderStore().getBounds()
        this.targetSize.width = imageBounds.value.width
        this.targetSize.height = imageBounds.value.height

        this.uSizePixel.value.set(
            N.Lerp(0, this.targetSize.width, this.progress.new),
            N.Lerp(0, this.targetSize.height, this.progress.new)
        )

        this.computeUniforms()
    }
    computeUniforms() {

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

    FragColor[0] = color;
    FragColor[1] = uId;
    // FragColor[0] = uId;
    // FragColor[0].x *= 40.;
    
}
`

const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec2 uSizePixel;
uniform float uVelo;
uniform float uAcc;
uniform float uProgress;

out vec2 vUv;

void main() {
    vUv = uv;

    vec4 mvmP = modelViewMatrix * vec4(position, 1.);

    vec4 vP = vec4(position, 1.);

    vec2 coord = vec2(vP.x * uSizePixel.x, vP.y * uSizePixel.y);
    float dMax = sqrt(uSizePixel.x * uSizePixel.x + uSizePixel.y * uSizePixel.y);
    float d = sqrt(coord.x * coord.x + coord.y * coord.y);

    // mvmP.z += (cos(d / dMax * 3.1415 )  - 1. )* 1. * uProgress;
    mvmP.z += (cos(d / dMax * 3.1415 )  - 1. )* 1. * uVelo;

    gl_Position = projectionMatrix * mvmP;
}`;