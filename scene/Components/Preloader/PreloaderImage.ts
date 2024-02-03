import { Vec2, Program, Mesh, Texture, Plane, Vec3, Transform } from 'ogl'
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
    mesh: any;
    zRatio: number;
    uDeform: { value: number; };
    progress: number;

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
        this.zRatio = 0

        this.uDeform = { value: 0 }
        this.progress = 0
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
            // depthTest: false,
            depthWrite: false,
            // cullFace: false,
            uniforms: {
                tMap: this.tMap,
                uSizePixel: this.uSizePixel,
                uScaleOffset: this.uScaleOffset,
                uTranslateOffset: this.uTranslateOffset,
                uId: this.uId,

                uDeform: this.uDeform,

                uMorph: { value: 1 }
            }
        })

        this.node = new Transform()
        this.mesh = new Mesh(this.gl, {
            geometry,
            program,
        })

        this.mesh.setParent(this.node)
        this.mesh.position.set(0, 0, 0.5)


        this.node.scale.set(0, 0, 0)

    }


    update(e: rafEvent) {

        // this.mesh.scale.set(w / h, 1, 1)
        this.node.scale.set(
            this.canvasSize.width * this.uSizePixel.value.x / vw.value,
            this.canvasSize.height * this.uSizePixel.value.y / vh.value,
            N.Lerp(this.canvasSize.height * this.uSizePixel.value.y / vh.value, 1, this.zRatio)
        );
        // this.mesh.program.uniforms.uMorph.value = 1


    }

    growAnimation() {
        return new Promise<void>((res) => {
            const tl = useTL()
            this.uDeform.value = 1
            tl.from({
                d: 1200,
                e: 'o4',
                update: (e) => {
                    this.progress = e.progE
                    this.uSizePixel.value.set(
                        N.Lerp(0, this.targetSize.width, e.progE),
                        N.Lerp(0, this.targetSize.height, e.progE)
                    )
                    this.computeUniforms()
                },
                cb: () => {
                    res()
                }
            })
            tl.from({
                d: 700,
                // e: 'i4',
                e: [.48, 0, .8, .63],
                update: (e) => {
                    this.uDeform.value = N.Lerp(1, 0, e.progE)
                }
            })
                .play()
        })
    }

    growToHome() {
        const DELAY = 200
        const force = 0.4
        const f = 0.4
        return new Promise<void>((res) => {
            const tl = useTL()
            tl.from({
                d: 1000,
                // e: 'o1',
                e: [0.76, -0.34, 0.24, 1],
                update: (e) => {
                    this.uSizePixel.value.set(
                        N.Lerp(this.targetSize.width, vw.value, e.progE),
                        N.Lerp(this.targetSize.height, vh.value, e.progE)
                    )
                    // this.mesh.position.set(0, 0, .5)
                    this.zRatio = e.progE
                    this.computeUniforms()
                },
            }).from({
                d: 150,
                e: 'o2',
                update: (e) => {
                    this.uDeform.value = e.progE * (-force)
                }
            }).from({
                d: 150,
                delay: 150,
                e: 'i2',
                update: (e) => {
                    this.uDeform.value = (1 - e.progE) * (- force)
                }
            })

            tl.from({
                d: 400,
                delay: DELAY,
                e: "o2",
                update: (e) => {
                    this.uDeform.value = N.Lerp(0, 1, e.progE) * f
                }
            })
                .from({
                    d: 500,
                    e: "io1",
                    delay: 400 + DELAY,
                    update: (e) => {
                        this.uDeform.value = N.Lerp(1, -0.8, e.progE) * f
                    }
                })
                .from({
                    d: 600,
                    e: "o2",
                    delay: 400 + 500 + DELAY,
                    update: (e) => {
                        this.uDeform.value = N.Lerp(-1, 0, e.progE) * f
                    },
                    cb: () => {
                        res()
                    }
                })
                .play()
        })
    }


    onResize(canvasSize: { width: number, height: number }) {
        this.canvasSize = canvasSize

        const imageBounds = usePreloaderStore().getBounds()
        this.targetSize.width = imageBounds.value.width
        this.targetSize.height = imageBounds.value.height

        this.uSizePixel.value.set(
            N.Lerp(0, this.targetSize.width, this.progress),
            N.Lerp(0, this.targetSize.height, this.progress)
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

uniform float uMorph;

uniform vec4 uId;

in vec2 vUv;
out vec4 FragColor[2];

float o3(float x) {
    return 1. - (1. - x) * (1. - x) * (1. - x);
}

float i4(float x){
    return x == 0. ? 0. : pow(2., 10. * x - 10.);
}

void main() {
    // object-fix: cover
    vec4 color = texture(tMap, vUv * uScaleOffset + uTranslateOffset);

    FragColor[0] = color;
    FragColor[1] = uId;

    // float y = vUv.x < .5 ? vUv.x * 2. : 2. - vUv.x * 2.;
    // if(vUv.y > y) {discard;}

    float t = clamp(0., 1., uMorph * 2.);
    if(vUv.x < vUv.y * (1. - uMorph) * 0.5 || vUv.x > 1. -vUv.y * (1. - uMorph) * .5 || i4(vUv.y) > 2. - t - vUv.x * 2. * (1. - uMorph)) {
        discard;
    }

    // FragColor[0].a = step(uMorph, mix(abs(coord.x));

    // FragColor[0] = uId;
    
}
`

const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec2 uSizePixel;

uniform float uDeform;


out vec2 vUv;

void main() {
    vUv = uv;


    vec4 vP = vec4(position, 1.);
    vec3 p = position;

    vec2 coord = vec2(vP.x * uSizePixel.x, vP.y * uSizePixel.y);
    float dMax = sqrt(uSizePixel.x * uSizePixel.x + uSizePixel.y * uSizePixel.y);
    float d = sqrt(coord.x * coord.x + coord.y * coord.y);




    vec4 mvmP = modelViewMatrix * vec4(p, 1.);

    mvmP.z += (cos(d / dMax * 3.1415 )  - 1. )* 0.8 * uDeform;

    gl_Position = projectionMatrix * mvmP;
}`;