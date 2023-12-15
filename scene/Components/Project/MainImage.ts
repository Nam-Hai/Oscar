import { Vec2, Program, Mesh, Texture, Plane, Vec3, Transform } from 'ogl'
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity } from "../../utils/WebGL.utils";
import { canvasInject } from '~/composables/useCanvas';

const { vh, vw, scale, mouse } = useStoreView()
const { firstScroll } = useStoreProject()

export const [provideMainImage, useCanvasMainImageProject] = canvasInject<MainImage>('canvas-main-image-project')

const endBounds = computed(() => {
    return {
        heigth: vh.value - 24 * 2 * scale.value,
        width: vw.value - 24 * 2 * scale.value,
    }
})
export class MainImage extends CanvasNode {
    raf: RafR;
    uBorderRadius: { value: number; };
    uSizePixel: { value: Vec2; };
    uScaleOffset: { value: Vec2; };
    uTranslateOffset: { value: Vec2; };

    uniformFromTo: {
        size: Vec2,
        intrinsecRatio: number,
        scale: Vec2,
        translate: Vec2
    }[]
    tMap: { value: Texture; };

    el?: HTMLElement[];
    bounds?: DOMRect[];
    uProgress: { value: number; };
    pixelPosition: Vec2;
    pixelScroll: number;
    canvasSize!: { width: number; height: number; };
    on: boolean = false;
    tMap2: { value: Texture; };
    uLoaded2: { value: number; };

    scalePixelScroll = {
        width: 0,
        height: 0
    }


    constructor(gl: any, props: { borderRadius?: number, el?: HTMLElement }) {
        super(gl)
        N.BM(this, ['update', 'onResize', 'destroy', "onScroll"])

        this.pixelPosition = new Vec2(0, 0)
        this.pixelScroll = 0
        const manifest = useManifest()
        this.tMap = { value: manifest.emptyTexture }
        this.tMap2 = { value: manifest.emptyTexture }
        this.uLoaded2 = { value: 0 }
        this.uSizePixel = { value: new Vec2(1, 1) }

        const uIntrinsecRatio = 1
        this.uScaleOffset = {
            value: new Vec2(
                this.uSizePixel.value[0] / this.uSizePixel.value[1] < uIntrinsecRatio
                    ? this.uSizePixel.value[0] /
                    (this.uSizePixel.value[1] * uIntrinsecRatio)
                    : 1,
                this.uSizePixel.value[0] / this.uSizePixel.value[1] < uIntrinsecRatio
                    ? 1
                    : (this.uSizePixel.value[1] * uIntrinsecRatio) /
                    this.uSizePixel.value[0],
            )
        };
        this.uTranslateOffset = {
            value: new Vec2(
                this.uSizePixel.value[0] / this.uSizePixel.value[1] < uIntrinsecRatio
                    ? 0.5 *
                    (1 -
                        this.uSizePixel.value[0] /
                        (this.uSizePixel.value[1] * uIntrinsecRatio))
                    : 0,
                this.uSizePixel.value[0] / this.uSizePixel.value[1] <=
                    uIntrinsecRatio
                    ? 0
                    : (1 -
                        (this.uSizePixel.value[1] * uIntrinsecRatio) /
                        this.uSizePixel.value[0]) *
                    0.5,
            )
        };

        this.uniformFromTo = [
            {
                scale: new Vec2(1, 1),
                translate: new Vec2(0, 0),
                size: new Vec2(1, 1),
                intrinsecRatio: 1
            },
            {
                scale: new Vec2(1, 1),
                translate: new Vec2(0, 0),
                size: new Vec2(1, 1),
                intrinsecRatio: 1
            }
        ]

        this.uProgress = { value: 0 }


        this.uBorderRadius = { value: props?.borderRadius || 5 }

        this.raf = useRafR(this.update)

        const { watch } = useCanvasReactivity(this)

        const tl = useTL()
        watch(firstScroll, (b) => {
            tl.reset()
            const from = this.uProgress.value
            const to = +b
            tl.from({
                d: 1000,
                e: 'io1',
                update: ({ progE }) => {
                    this.uProgress.value = N.Lerp(from, to, progE)
                    this.computeUniform()
                }
            }).play()
        })
        // watch(mouse, this.onMouseMove)
        this.mount()
        this.init()

        const { unWatch: resizeUnWatch } = useCanvasSize(this.onResize)

        provideMainImage(this)


        this.onDestroy(() => this.raf.stop())
        this.onDestroy(() => resizeUnWatch())
    }

    addEventListener() {
        const lenis = useLenis()

        const scrollUnsub = lenis.on("scroll", this.onScroll);

        this.onDestroy(() => scrollUnsub())
    }

    onScroll(e: any) {
        this.pixelScroll = e.animatedScroll
        this.scalePixelScroll = {
            height: this.pixelScroll,
            width: this.pixelScroll
        }
        console.log(this.pixelScroll);
    }


    mountElement(el: HTMLElement, next: HTMLElement) {
        this.addEventListener()
        this.el = [el, next]

        const src_1 = N.Ga(this.el[0], "data-src") || "/Assets/Home3.png"
        const src_2 = N.Ga(this.el[1], "data-src") || "/Assets/Home3.png"

        const manifest = useManifest()
        this.tMap.value = manifest.textures.home[src_1]

        const a = manifest.lazyTextures.VIADOMO[src_2]
        const t = a.texture
        this.tMap2.value = t
        this.uniformFromTo[0].intrinsecRatio = (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height

        const { watch } = useCanvasReactivity(this)
        watch(a.loaded, b => {
            if (b) {
                this.uniformFromTo[1].intrinsecRatio = (this.tMap2.value.image as HTMLImageElement).width / (this.tMap2.value.image as HTMLImageElement).height
                useTL().from({
                    d: 300,
                    update: (e) => {
                        this.uLoaded2.value = e.progE
                    }
                }).play()
            }
        }, { immediate: true })

        this.onResize(useCanvas().size.value)

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
                uProgress: this.uProgress,
                uSwap: { value: false },
                uLoaded: { value: 1 },
                uId: this.uId
            }
        })

        const a = new Mesh(this.gl, {
            geometry,
            program,
        })
        a.setParent(this.node)

        const program2 = new Program(this.gl, {
            fragment,
            vertex,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                tMap: this.tMap2,
                uSizePixel: this.uSizePixel,
                uBorderRadius: this.uBorderRadius,
                uScaleOffset: this.uScaleOffset,
                uTranslateOffset: this.uTranslateOffset,
                uProgress: this.uProgress,
                uSwap: { value: true },
                uLoaded: this.uLoaded2,
                uId: this.uId
            }
        })

        const b = new Mesh(this.gl, {
            program: program2,
            geometry
        })
        b.setParent(this.node)
    }


    update(e: rafEvent) {
        // this.node.position.lerp(this.positionTarget, this.lerp)

        // this.uProgress.value = (Math.cos(e.elapsed) + 1) / 2

        if (this.on) {
            this.pixelScroll = scrollY
        }

        this.node.position.set(
            this.canvasSize.width * (this.pixelPosition.x - this.pixelScroll / 2) / vw.value,
            this.canvasSize.height * (this.pixelPosition.y + this.pixelScroll / 2) / vh.value,
            0
        )

        this.node.scale.set(
            this.canvasSize.width * (this.scalePixelScroll.width + this.uSizePixel.value.x) / vw.value,
            this.canvasSize.height * (this.scalePixelScroll.height + this.uSizePixel.value.y) / vh.value,
            1
        )
    }

    onResize(canvasSize: { width: number, height: number }) {
        this.canvasSize = canvasSize
        if (!this.el) return

        this.bounds = [this.el[0].getBoundingClientRect(), this.el[1].getBoundingClientRect()]

        this.uniformFromTo[0].size.set(this.bounds[0].width, this.bounds[0].height)
        this.uniformFromTo[1].size.set(this.bounds[1].width, this.bounds[1].height)

        this.uniformFromTo[0].scale.set(
            this.uniformFromTo[0].size[0] / this.uniformFromTo[0].size[1] < this.uniformFromTo[0].intrinsecRatio
                ? this.uniformFromTo[0].size[0] /
                (this.uniformFromTo[0].size[1] * this.uniformFromTo[0].intrinsecRatio)
                : 1,
            this.uniformFromTo[0].size[0] / this.uniformFromTo[0].size[1] < this.uniformFromTo[0].intrinsecRatio
                ? 1
                : (this.uniformFromTo[0].size[1] * this.uniformFromTo[0].intrinsecRatio) /
                this.uniformFromTo[0].size[0],
        )

        this.uniformFromTo[0].translate.set(
            this.uniformFromTo[0].size[0] / this.uniformFromTo[0].size[1] < this.uniformFromTo[0].intrinsecRatio
                ? 0.5 *
                (1 -
                    this.uniformFromTo[0].size[0] /
                    (this.uniformFromTo[0].size[1] * this.uniformFromTo[0].intrinsecRatio))
                : 0,
            this.uniformFromTo[0].size[0] / this.uniformFromTo[0].size[1] <=
                this.uniformFromTo[0].intrinsecRatio
                ? 0
                : (1 -
                    (this.uniformFromTo[0].size[1] * this.uniformFromTo[0].intrinsecRatio) /
                    this.uniformFromTo[0].size[0]) *
                0.5,
        );
        this.uniformFromTo[1].scale.set(
            this.uniformFromTo[1].size[0] / this.uniformFromTo[1].size[1] < this.uniformFromTo[1].intrinsecRatio
                ? this.uniformFromTo[1].size[0] /
                (this.uniformFromTo[1].size[1] * this.uniformFromTo[1].intrinsecRatio)
                : 1,
            this.uniformFromTo[1].size[0] / this.uniformFromTo[1].size[1] < this.uniformFromTo[1].intrinsecRatio
                ? 1
                : (this.uniformFromTo[1].size[1] * this.uniformFromTo[1].intrinsecRatio) /
                this.uniformFromTo[1].size[0],
        )

        this.uniformFromTo[1].translate.set(
            this.uniformFromTo[1].size[0] / this.uniformFromTo[1].size[1] < this.uniformFromTo[1].intrinsecRatio
                ? 0.5 *
                (1 -
                    this.uniformFromTo[1].size[0] /
                    (this.uniformFromTo[1].size[1] * this.uniformFromTo[1].intrinsecRatio))
                : 0,
            this.uniformFromTo[1].size[0] / this.uniformFromTo[1].size[1] <=
                this.uniformFromTo[1].intrinsecRatio
                ? 0
                : (1 -
                    (this.uniformFromTo[1].size[1] * this.uniformFromTo[1].intrinsecRatio) /
                    this.uniformFromTo[1].size[0]) *
                0.5,
        );

        this.computeUniform()

    }

    computeUniform() {
        this.on = true
        this.uSizePixel.value.set(
            N.Lerp(this.uniformFromTo[0].size.x, this.uniformFromTo[1].size.x, this.uProgress.value),
            N.Lerp(this.uniformFromTo[0].size.y, this.uniformFromTo[1].size.y, this.uProgress.value),
        )
        this.uScaleOffset.value.set(
            N.Lerp(this.uniformFromTo[0].scale.x, this.uniformFromTo[1].scale.x, this.uProgress.value),
            N.Lerp(this.uniformFromTo[0].scale.y, this.uniformFromTo[1].scale.y, this.uProgress.value),
        )
        this.uTranslateOffset.value.set(
            N.Lerp(this.uniformFromTo[0].translate.x, this.uniformFromTo[1].translate.x, this.uProgress.value),
            N.Lerp(this.uniformFromTo[0].translate.y, this.uniformFromTo[1].translate.y, this.uProgress.value),
        )


        if (!this.bounds) return
        const x = N.Lerp(this.bounds[0].x, this.bounds[1].x, this.uProgress.value) + this.uSizePixel.value.x / 2 - vw.value / 2
        const y = vh.value / 2 - this.uSizePixel.value.y / 2 - N.Lerp(this.bounds[0].y, vh.value - 24 * scale.value - this.bounds[1].height, this.uProgress.value)
        this.pixelPosition.set(x, y)

        // this.node.position.set(
        //     this.canvasSize.width * x / vw.value,
        //     this.canvasSize.height * y / vh.value,
        //     0
        // )
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
in vec3 vP;
out vec4 FragColor[2];

uniform bool uSwap;

uniform float uProgress;
uniform float uLoaded;

float io2(float t) {
    float p = 2.0 * t * t;
    return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
}

void main() {
    // object-fix: cover
    vec4 color = texture(tMap, vUv * uScaleOffset + uTranslateOffset);

    color = mix(vec4(0.886,0.886,0.886,1.), color, uLoaded);


    vec4 c = vec4(0.);

    float t = uSwap ? uProgress * 1.2: uProgress * 0.;
    vec2 coord = vec2(vP.x - .5 - 0.3 * (1. - t), vP.y - .5 - 0.3 * (1. - t));
    float d = sqrt(coord.x * coord.x + coord.y * coord.y * .7);
    d = clamp(d - t * sqrt(2.), 0., 1.);
    float radius = 0.3;

    float z = (1. - io2(d / radius)) * step(d, radius);
    color = !uSwap ? mix(color, c, z) : mix(c, color, z);


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

uniform float uProgress;

out vec2 vUv;

out vec3 vP;

float io2(float t) {
    float p = 2.0 * t * t;
    return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
}

void main() {
    vUv = uv;
    vP = position;


    float t = uProgress * 2.;
    if(uProgress > .5){
        t = 2. - uProgress * 2.;
    }
    vec2 coord = vec2(mix(1.1, -1.1, uProgress), mix(0.3, -0.4, uProgress));

    float radius = mix(0.6, 1.3, t);
    float d = sqrt((vP.x - coord.x) * (vP.x - coord.x) + (vP.y - coord.y) * (vP.y - coord.y));
    float z = (1. - io2(d / radius)) * step(d, radius);

    vec4 mvmP = modelViewMatrix * vec4(position, 1.);
    mvmP.z += z * 1.9;
    mvmP.x += z * -0.4 ;

    gl_Position = projectionMatrix * mvmP;
}`;