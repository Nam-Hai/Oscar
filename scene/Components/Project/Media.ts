
import { Vec2, Program, Mesh, Texture, Plane, Vec3, Transform } from 'ogl'
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity } from "../../utils/WebGL.utils";

const { vh, vw, scale, mouse } = useStoreView()

export class Media extends CanvasNode {
    raf: RafR;
    uBorderRadius: { value: number; };
    uSizePixel: { value: Vec2; };
    uScaleOffset: { value: Vec2; };
    uTranslateOffset: { value: Vec2; };

    tMap!: { value: Texture; };

    el!: HTMLElement;
    bounds!: DOMRect;
    uLoaded: { value: number }
    intrinsecRatio: number

    pixelScroll: number;
    uVelo = { value: 0 }

    canvasSize!: { width: number; height: number; };
    on: boolean = false;
    pixelPosition: Vec2;

    constructor(gl: any, props: { borderRadius?: number, el: HTMLElement }) {
        super(gl)
        N.BM(this, ['update', 'onResize', 'destroy', "onScroll"])

        this.pixelScroll = 0
        this.pixelPosition = new Vec2(0)
        this.uLoaded = { value: 0 }
        this.uSizePixel = { value: new Vec2(1, 1) }

        this.intrinsecRatio = 1
        this.uScaleOffset = {
            value: new Vec2(
                this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.intrinsecRatio
                    ? this.uSizePixel.value[0] /
                    (this.uSizePixel.value[1] * this.intrinsecRatio)
                    : 1,
                this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.intrinsecRatio
                    ? 1
                    : (this.uSizePixel.value[1] * this.intrinsecRatio) /
                    this.uSizePixel.value[0],
            )
        };
        this.uTranslateOffset = {
            value: new Vec2(
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
        };

        this.uBorderRadius = { value: props?.borderRadius || 5 }

        this.raf = useRafR(this.update)


        this.mountElement(props.el)

        this.mount()
        this.init()

        this.addEventListener()


        this.onDestroy(() => this.raf.stop())
    }

    addEventListener() {
        const { watch } = useCanvasReactivity(this)

        const { unWatch: resizeUnWatch } = useCanvasSize(this.onResize)
        const lenis = useLenis()

        const scrollUnsub = lenis.on("scroll", this.onScroll);

        this.onDestroy(() => resizeUnWatch())
        this.onDestroy(() => scrollUnsub())
    }

    onScroll(e: any) {
        // if (this.pixelScroll >= 800) return
        const eS = e.animatedScroll

        this.uVelo.value = e.velocity
        this.pixelScroll = eS

    }


    mountElement(el: HTMLElement) {
        this.el = el

        const src_1 = N.Ga(this.el, "data-src") || "/Assets/Home3.png"

        const manifest = useManifest()
        const a = manifest.lazyTextures.assets[src_1]
        this.tMap = { value: a.texture }

        const { watch } = useCanvasReactivity(this)
        watch(a.loaded, b => {
            if (b) {
                this.intrinsecRatio = (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height
                this.computeUniform()
                useTL().from({
                    d: 300,
                    update: (e) => {
                        this.uLoaded.value = e.progE
                    }
                }).play()
            }
        }, { immediate: true })
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
                uTranslateOffset: this.uTranslateOffset,
                uVelo: this.uVelo,
                uLoaded: this.uLoaded,
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
        if (this.on) {
            // this.pixelScroll = scrollY
        }

        this.node.position.set(
            this.canvasSize.width * (this.pixelPosition.x) / vw.value,
            this.canvasSize.height * (this.pixelPosition.y + this.pixelScroll) / vh.value,
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
        if (!this.el) return

        this.bounds = this.el.getBoundingClientRect()!
        this.bounds.y = this.bounds.top + scrollY

        this.computeUniform()
    }

    computeUniform() {
        this.on = true
        if (!this.bounds) return
        if (this.tMap.value.texture)
            this.uSizePixel.value.set(
                this.bounds.width,
                this.bounds.height
            )
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

        if (!this.bounds) return
        // const x = N.Lerp(this.bounds.x, this.bounds[1].x, this.uProgress.value) + this.uSizePixel.value.x / 2 - vw.value / 2
        const x = this.bounds.x + this.uSizePixel.value.x / 2 - vw.value / 2
        const y = vh.value / 2 - this.uSizePixel.value.y / 2 - this.bounds.y

        this.pixelPosition.set(x, y)
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

uniform float uLoaded;

float io2(float t) {
    float p = 2.0 * t * t;
    return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
}

void main() {
    // object-fix: cover
    vec4 color = texture(tMap, vUv * uScaleOffset + uTranslateOffset);

    color = mix(vec4(0.886,0.886,0.886,1.), color, uLoaded);
    


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
    // p.y += i2(p.x + 0.5) * clamp(uVelo, -f, f) / f;
    // p.y += sin(p.x + 0.5) * clamp(uVelo, -f, f) / f;

    vec4 mvmP = modelViewMatrix * vec4(p, 1.);

    gl_Position = projectionMatrix * mvmP;
}`;