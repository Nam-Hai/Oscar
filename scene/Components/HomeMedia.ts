
import { Mesh, Plane, Program, Texture, Transform } from "ogl";
import { CanvasNode } from "../utils/types";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { useCanvasReactivity } from "../utils/WebGL.utils";
import { Pane } from 'tweakpane'

const { currentIndex } = useStoreStepper()

const uReach = { value: 2}
const uForce = { value: 0.6 }

// const pane = new Pane()
// const widthFolder = pane.addFolder({ title: "Width" })
// widthFolder.addBinding(uReach, 'value', {
//     min: 0, max: 4
// })

// const forceFolder = pane.addFolder({title: "Force"})
// forceFolder.addBinding(uForce, 'value', {
//     min: 0, max: 2
// })
// Pan

export class HomeMedia extends CanvasNode {

    uTime!: { value: number; }
    raf: RafR;
    uIntrinsecRatio: number;
    uSizeCanvas: { value: number[]; };
    uScaleOffset: { value: number[]; };
    uTranslateOffset: { value: number[]; };
    uProgress: { value: number; };
    currentMesh!: Mesh;
    textures: Texture[];
    constructor(gl: any, options?: {}) {
        super(gl)

        N.BM(this, ["update", "resize"])

        const manifest = useManifest()
        this.textures = Object.values(manifest.textures.home)

        this.uProgress = { value: 0 }

        this.uSizeCanvas = { value: [1, 1] }
        this.uIntrinsecRatio = this.textures[0].image
            ? (this.textures[0].image as HTMLImageElement).width / (this.textures[0].image as HTMLImageElement).height
            : 1;
        this.uScaleOffset = {
            value: [
                this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] < this.uIntrinsecRatio
                    ? this.uSizeCanvas.value[0] /
                    (this.uSizeCanvas.value[1] * this.uIntrinsecRatio)
                    : 1,
                this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] < this.uIntrinsecRatio
                    ? 1
                    : (this.uSizeCanvas.value[1] * this.uIntrinsecRatio) /
                    this.uSizeCanvas.value[0],
            ]
        };
        this.uTranslateOffset = {
            value: [
                this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] < this.uIntrinsecRatio
                    ? 0.5 *
                    (1 -
                        this.uSizeCanvas.value[0] /
                        (this.uSizeCanvas.value[1] * this.uIntrinsecRatio))
                    : 0,
                this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] <=
                    this.uIntrinsecRatio
                    ? 0
                    : (1 -
                        (this.uSizeCanvas.value[1] * this.uIntrinsecRatio) /
                        this.uSizeCanvas.value[0]) *
                    0.5,
            ]
        };


        this.raf = useRafR(this.update)
        this.onDestroy(() => {
            this.raf.kill()
        })

        this.mount()
        this.init()

        const { watch } = useCanvasReactivity(this)
        watch(currentIndex, i => {
            this.onChange(i)
        })

        const { unWatch: resizeWatcher } = useCanvasSize(this.resize)

        this.onDestroy(() => resizeWatcher())
    }

    mount() {
        this.node = new Transform()
        this.currentMesh = this.createPlane(currentIndex.value)
        this.currentMesh.setParent(this.node)
        this.currentMesh.program.uniforms.uInProgress.value = 1

        const s = useCanvas().size.value
        this.node.scale.set(s.width / 4, s.height / 4, 1)
    }

    onChange(nextId: number) {
        const oldMesh = this.currentMesh
        const currentMesh = this.createPlane(nextId)
        this.currentMesh = currentMesh
        let added = false

        const DURATION = 800
        const DELAY_IN = 250

        useTL().from({
            d: 600,
            e: 'i2',
            update: ({ progE }) => {
                oldMesh.program.uniforms.uOutProgress.value = progE
            },
            cb: () => {
            },
        }).from({
            d: DURATION,
            delay: DELAY_IN,
            e: "o2",
            update: ({ progE }) => {
                if (!added) {
                    currentMesh.setParent(this.node)
                    added = true
                }
                currentMesh.program.uniforms.uInProgress.value = progE
            },
            cb: () => {
                oldMesh.setParent(null)
            }
        }).play()
    }
    createPlane(idTexture: number) {
        const program = new Program(this.gl, {
            vertex,
            fragment,
            depthTest: false,
            depthWrite: false,
            // transparent: true,

            uniforms: {
                tMap: { value: this.textures[idTexture] },
                uScaleOffset: this.uScaleOffset,
                uTranslateOffset: this.uTranslateOffset,
                uSizeCanvas: this.uSizeCanvas,
                uInProgress: { value: 0 },
                uOutProgress: { value: 0 },
                uReach,
                uForce
            }
        })
        const geometry = new Plane(this.gl, {
            widthSegments: 20,
            heightSegments: 20
        })

        const mesh = new Mesh(this.gl, {
            geometry,
            program,
            // renderOrder: -1
        })
        return mesh
    }

    init() {
        this.raf.run()
    }

    resize({ width, height }: { width: number, height: number }) {
        console.log('resize');

        this.uSizeCanvas.value = [width, height]


        this.uScaleOffset.value = [
            this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] < this.uIntrinsecRatio
                ? this.uSizeCanvas.value[0] /
                (this.uSizeCanvas.value[1] * this.uIntrinsecRatio)
                : 1,
            this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] < this.uIntrinsecRatio
                ? 1
                : (this.uSizeCanvas.value[1] * this.uIntrinsecRatio) /
                this.uSizeCanvas.value[0],
        ];
        this.uTranslateOffset.value = [
            this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] < this.uIntrinsecRatio
                ? 0.5 *
                (1 -
                    this.uSizeCanvas.value[0] /
                    (this.uSizeCanvas.value[1] * this.uIntrinsecRatio))
                : 0,
            this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] <=
                this.uIntrinsecRatio
                ? 0
                : (1 -
                    (this.uSizeCanvas.value[1] * this.uIntrinsecRatio) /
                    this.uSizeCanvas.value[0]) *
                0.5,
        ];

        this.node.scale.set(width, height, 1)
    }

    update(e: rafEvent) {
    }

    destroy() {
        super.destroy()
    }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform vec2 uSizeCanvas;
uniform vec2 uScaleOffset;
uniform vec2 uTranslateOffset;

uniform float uInProgress;

// DEBUG
uniform float uForce;
uniform float uReach;

in vec2 vUv;

in vec4 vP;

out vec4 FragColor[2];

float iLerp(float a, float b, float value) {
    return (value - a) / (b - a);
}

float i3(float x){
    return x * x * x;
}

void main() {
    vec2 coord = vec2(vP.x * uSizeCanvas.x, vP.y * uSizeCanvas.y);
    float dMax = sqrt(uSizeCanvas.x * uSizeCanvas.x + uSizeCanvas.y * uSizeCanvas.y) * 0.60;
    float d = sqrt(coord.x * coord.x + coord.y * coord.y);
    float limit = dMax * mix(0.07, 1., uInProgress);

    if (d > limit) {
        discard;
    }

    float a = 0.;
    if (d > limit - uReach) {
        a = iLerp(limit - uReach, limit, d);
    }

    float f = clamp(iLerp(1., .95, uInProgress), 0.,1.);
    a = i3(a) * uForce;

    vec2 offset = vP.xy * a * f;

    vec4 color = texture(tMap, vUv * uScaleOffset + uTranslateOffset - offset);

    FragColor[0] = color;
    // FragColor[1] = color;
}
`
const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform float uOutProgress;
uniform vec2 uSizeCanvas;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec4 vP;
out vec2 vUv;

void main() {
    vUv = uv;

    vec4 newP = modelViewMatrix * vec4(position, 1.);
    vP = vec4(position, 1.);

    vec2 coord = vec2(vP.x * uSizeCanvas.x, vP.y * uSizeCanvas.y);
    float dMax = sqrt(uSizeCanvas.x * uSizeCanvas.x + uSizeCanvas.y * uSizeCanvas.y);
    float d = sqrt(coord.x * coord.x + coord.y * coord.y);
    // float limit = dMax * mix(0.25, 1., uInProgress);

    newP.z += cos(d / dMax * 3.1415 ) * 2. * uOutProgress;
    // newP.z += cos()

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * newP;
}`;