import { Vec2, Program, Mesh, Texture, Plane, Vec3 } from 'ogl'
import { basicVer } from "../../shaders/BasicVer";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity } from "../../utils/WebGL.utils";
import { canvasInject } from '~/composables/useCanvas';
import type Lenis from '@studio-freight/lenis';

const { vh, vw, scale, mouse } = useStoreView()
const { firstScroll } = useStoreProject()

export const [provideMainImage, useCanvasMainImageProject] = canvasInject<MainImage>('canvas-main-image-project')

export class MainImage extends CanvasNode {
    raf: RafR;
    uBorderRadius: { value: number; };
    uSizePixel: { value: Vec2; };
    uIntrinsecRatio: number;
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

    constructor(gl: any, props: { borderRadius?: number, el?: HTMLElement }) {
        super(gl)
        N.BM(this, ['update', 'onResize', 'destroy'])

        this.pixelPosition = new Vec2(0, 0)
        this.pixelScroll = 0
        const manifest = useManifest()
        // this.tMap = { value: manifest.manifestTextures.home[src] || manifest.emptyTexture }
        this.tMap = { value: manifest.emptyTexture }
        this.uIntrinsecRatio = this.tMap.value.image
            ? (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height
            : 1;

        this.uSizePixel = { value: new Vec2(1, 1) }

        this.uScaleOffset = {
            value: new Vec2(
                this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
                    ? this.uSizePixel.value[0] /
                    (this.uSizePixel.value[1] * this.uIntrinsecRatio)
                    : 1,
                this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
                    ? 1
                    : (this.uSizePixel.value[1] * this.uIntrinsecRatio) /
                    this.uSizePixel.value[0],
            )
        };
        this.uTranslateOffset = {
            value: new Vec2(
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
                e: 'o4',
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

        this.addEventListener()

        this.onDestroy(() => this.raf.stop())
        this.onDestroy(() => resizeUnWatch())
    }

    addEventListener() {
        const lenis = useLenis()
        const scrollUnsub = lenis.on("scroll", () => this.on = true);

        this.onDestroy(() => scrollUnsub())
    }


    mountElement(el: HTMLElement, next: HTMLElement) {
        this.el = [el, next]

        const src = N.Ga(this.el[0], "data-src") || "/Assets/Home3.png"


        const manifest = useManifest()
        this.tMap.value = manifest.manifestTextures.home[src]
        console.log(this.tMap.value.image);
        this.uniformFromTo[0].intrinsecRatio = (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height
        this.uniformFromTo[1].intrinsecRatio = (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height
        this.uIntrinsecRatio = (this.tMap.value.image as HTMLImageElement).width / (this.tMap.value.image as HTMLImageElement).height

        this.onResize(useCanvas().size.value)

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
                uId: this.uId
            }
        })

        this.node = new Mesh(this.gl, {
            geometry,
            program,
        })
    }


    update(e: rafEvent) {
        // this.node.position.lerp(this.positionTarget, this.lerp)
        if (!this.on) return

        this.pixelScroll = scrollY

        this.node.position.set(
            this.canvasSize.width * this.pixelPosition.x / vw.value,
            this.canvasSize.height * (this.pixelPosition.y + this.pixelScroll) / vh.value,
            0
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

        this.node.scale.set(
            this.canvasSize.width * this.uSizePixel.value.x / vw.value,
            this.canvasSize.height * this.uSizePixel.value.y / vh.value,
            1
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
// uniform float uBorderWidth;

uniform vec4 uId;

in vec2 vUv;
out vec4 FragColor[2];


void main() {
    // object-fix: cover
    vec4 color = texture(tMap, vUv * uScaleOffset + uTranslateOffset);
    // color.a = 1.;

    // vec4 borderColor = mix(color, vec4(1.), uTransparency);
    vec4 borderColor = color;
    float borderWidth = 1.;

    // float xPixel = vUv.x * uSizePixel.x;
    // float yPixel = vUv.y * uSizePixel.y;

    // if(xPixel < borderWidth) color = borderColor;
    // if(xPixel > uSizePixel.x - borderWidth) color = borderColor;
    // if(yPixel > uSizePixel.y - borderWidth) color = borderColor;
    // if(yPixel < borderWidth) color = borderColor;

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
    // FragColor[0] = vec4(1.,0.,0.,1.);
    FragColor[1] = uId;
}
`