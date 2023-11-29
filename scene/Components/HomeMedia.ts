
import { Mesh, Plane, Program, Texture } from "ogl";
import { CanvasNode } from "../utils/types";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { basicVer } from "../shaders/BasicVer";
import { useCanvasReactivity } from "../utils/WebGL.utils";
import { MANIFEST } from "~/services/Manifest";

const { vh, vw } = useStoreView()
const { currentIndex } = useStoreStepper()

export class HomeMedia extends CanvasNode {

    uTime!: { value: number; }
    raf: RafR;
    uIntrinsecRatio: number;
    uSizePixel: { value: number[]; };
    uScaleOffset: { value: number[]; };
    uTranslateOffset: { value: number[]; };
    tNext: { value: Texture };
    tMap: { value: Texture };
    uProgress: { value: number; };
    constructor(gl: any, options?: {}) {
        super(gl)

        N.BM(this, ["update", "resize"])

        const manifest = useManifest()
        this.tMap = { value: manifest.textures.home[currentIndex.value] }
        this.tNext = { value: manifest.textures.home[(currentIndex.value + 1) % MANIFEST.home.length] }

        this.uProgress = { value: 0 }

        this.uSizePixel = { value: [1, 1] }
        this.uIntrinsecRatio = this.tMap.value.image
            ? (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height
            : 1;
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


        this.raf = useRafR(this.update)
        this.onDestroy(() => {
            this.raf.kill()
        })

        this.mount()
        this.init()

        const tl = useTL()
        const { watch } = useCanvasReactivity(this)
        watch(currentIndex, i => {
            // this.tMap.value = useManifest().textures.home[i]
            this.tNext.value = manifest.textures.home[i]

            tl.reset()
            tl.from({
                d: 500,
                update: ({ progE }) => {
                    this.uProgress.value = progE
                },
                cb: () => {
                    this.tMap.value = this.tNext.value
                    this.uProgress.value = 0
                }
            })
                .play()
        })

        const { unWatch: resizeWatcher } = useCanvasSize(this.resize)

        this.onDestroy(() => resizeWatcher())
    }

    mount() {
        const program = new Program(this.gl, {
            vertex: basicVer,
            fragment,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                tMap: this.tMap,
                tNext: this.tNext,
                uScaleOffset: this.uScaleOffset,
                uTranslateOffset: this.uTranslateOffset,
                uProgress: this.uProgress
            }
        })
        const geometry = new Plane(this.gl, {
        })

        this.node = new Mesh(this.gl, {
            geometry,
            program
        })

        const s = useCanvas().size.value
        this.node.scale.set(s.width / 4, s.height / 4, 1)
    }

    init() {
        this.raf.run()
    }

    resize({ width, height }: { width: number, height: number }) {

        this.uSizePixel = { value: [width, height] }
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
uniform sampler2D tNext;
uniform vec2 uSizePixel;
uniform float uIntrinsecRatio;
uniform vec2 uScaleOffset;
uniform vec2 uTranslateOffset;

uniform float uProgress;

in vec2 vUv;
out vec4 FragColor;

void main() {
    // object-fix: cover
    vec4 tex = texture(tMap, vUv * uScaleOffset + uTranslateOffset);
    vec4 next = texture(tNext, vUv * uScaleOffset + uTranslateOffset);

    vec4 color = mix(tex, next, uProgress);

    FragColor = color;
}
`