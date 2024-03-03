import { Vec2, Program, Mesh, Texture, Plane, Vec3, Transform } from "ogl";
import type { OGLRenderingContext } from "ogl";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity, useLenisGL, type LenisEvent, getUId } from "../../utils/WebGL.utils";
import { basicVer } from "~/scene/shaders/BasicVer";
import { Motion } from "~/plugins/core/motion";

const { vh, vw, scale, breakpoint, mouse, scrollLenis } = useStoreView();
const { containerHeight, showMore } = useStorePlayground()

export class PlaygroundMedia extends CanvasNode {
    raf: RafR;
    tMap!: { value: Texture };
    uLoaded: { value: number };

    on = false;
    intrinsecRatio: number = 1;
    src: string;
    index: number;
    width: number = 1;
    height: number = 1;
    canvasSize!: { width: number; height: number; };
    el: HTMLElement;
    positionEl = { x: 0, y: 0 }
    scrollPosition: number = 0;
    offset: number = 0;
    uVelo: { value: number; } = { value: 0 };
    uBounds: { value: number[]; } = { value: [100, 100] };
    mesh!: Mesh;
    fixedMesh!: Mesh;
    fixed: HTMLElement;
    constructor(
        gl: OGLRenderingContext,
        props: {
            index: number,
            el: HTMLElement,
            fixed: HTMLElement
        }
    ) {
        super(gl);
        N.BM(this, ["update", "onResize", "destroy", "onScroll"]);
        this.index = props.index
        this.el = props.el
        this.fixed = props.fixed

        this.src = N.Ga(this.el, "data-src") || "/Assets/Home/1.jpg"
        this.uLoaded = { value: 0 };

        this.raf = useRafR(this.update);

        this.loadTexture()
        this.mount();
        this.init();

        this.onDestroy(() => this.raf.stop());
    }
    loadTexture() {
        const { watch } = useCanvasReactivity(this);
        const { textures, lazyTextures } = useManifest()
        const textureManager = lazyTextures[this.src];
        this.tMap = { value: textureManager.getTexture() }
        watch(
            textureManager.loaded,
            (loaded: boolean) => {
                if (loaded) {
                    this.intrinsecRatio =
                        (this.tMap.value.image as HTMLImageElement).width /
                        (this.tMap.value.image as HTMLImageElement).height;

                    useTL()
                        .from({
                            d: 300,
                            update: (e) => {
                                this.uLoaded.value = e.progE;
                            },
                        })
                        .play();
                }
            },
            { immediate: true },
        );
    }

    init() {
        const { watch } = useCanvasReactivity(this);


        const { unWatch: resizeUnWatch, trigger } = useCanvasSize(this.onResize);
        resizeUnWatch()
        watch(containerHeight, () => {
            trigger()
        })
        useTL().from({
            d: 500,

            update: ({ progE }) => {
                this.mesh.position.x = 0
            }
        }).from({
            d: 1200,
            e: 'o4',
            update: ({ progE }) => {
                this.mesh.position.y = (this.positionEl.y + this.scrollPosition + this.offset + 400 * (1 - progE)) * this.canvasSize.height / vh.value
            }
        }).from({
            d: 1000,
            delay: 500,
            // e: 'o4',
            update: ({ progE }) => {
                this.mesh.position.x = (this.positionEl.x * N.Ease.o3(progE)) * this.canvasSize.width / vw.value
            },
            cb: () => {
                useLenisGL(this, this.onScroll)
            }
        }).play()
        this.onDestroy(() => resizeUnWatch())
        this.raf.run();
    }

    onScroll(e: LenisEvent) {
        this.scrollPosition = e.animatedScroll
        const velo = Math.min(Math.abs(e.velocity), 50) / 50
        this.uVelo.value = N.Lerp(this.uVelo.value, velo, 0.1)

        if (this.scrollPosition + this.positionEl.y + this.offset > vh.value) {
            this.offset -= containerHeight.value
        } else if (this.scrollPosition + this.positionEl.y + this.offset < -vh.value) {
            this.offset += containerHeight.value
        }

        this.computeCoord()
    }

    mount() {
        const geometry = new Plane(this.gl, {
            widthSegments: 40,
            heightSegments: 40,
        });

        const picker = usePicker()
        const { watch } = useCanvasReactivity(this)
        const hover = picker.useHover(this.id)
        const uHover = { value: 0 }
        let motion: Motion;
        const uShow = { value: 0 }
        watch(hover, h => {
            showMore.value = h ? this.id : -1
            uHover.value = h
            // const from = uHover.value
            // const to = +h
            // motion?.pause();
            // motion = new Motion({
            //     d: 100,
            //     update: (e) => {
            //         uHover.value = N.Lerp(from, to, e.progE)
            //     },
            // });
            // motion.play()
        }, { immediate: true })
        watch(showMore, b => {
            uShow.value = b === this.id || b === -1 ? 1 : 0
        }, { immediate: true })

        const program = new Program(this.gl, {
            fragment,
            vertex,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            cullFace: false,
            uniforms: {
                tMap: this.tMap,
                uLoaded: this.uLoaded,
                uId: this.uId,
                uVelo: this.uVelo,
                uHover,
                uShow,
                uPixelWidth: vw,
                uPixelHeight: vh,
                uBounds: this.uBounds,
            },
        });

        this.node = new Transform()
        this.mesh = new Mesh(this.gl, {
            geometry,
            program,
        });


        this.mesh.setParent(this.node)

        this.fixedMesh = new Mesh(this.gl, {
            geometry: new Plane(this.gl),
            program: new Program(this.gl, {
                fragment: fixedFrag,
                vertex: basicVer,
                depthTest: false,
                depthWrite: false,
                transparent: true,
                uniforms: {
                    tMap: this.tMap,
                    uLoaded: this.uLoaded,
                    uId: { value: getUId().uId },
                    uHover
                }

            }),
        })
        this.fixedMesh.renderOrder = -5400

        this.fixedMesh.setParent(this.node)

    }

    update(e: rafEvent) {
    }

    onResize(canvasSize: { width: number; height: number }) {
        this.canvasSize = canvasSize
        const bounds = this.el.getBoundingClientRect()
        this.positionEl = {
            x: bounds.left + bounds.width / 2 - vw.value / 2,
            y: vh.value / 2 - bounds.top - bounds.height / 2,
        }
        this.mesh.scale.set(
            bounds.width * canvasSize.width / vw.value,
            bounds.height * canvasSize.height / vh.value,
            1
        )
        this.offset = 0
        this.uBounds.value = [bounds.width, bounds.height]

        const boundsFixed = this.fixed.getBoundingClientRect()
        const positionFixed = {
            x: boundsFixed.left + boundsFixed.width / 2 - vw.value / 2,
            y: vh.value / 2 - boundsFixed.top - boundsFixed.height / 2,
        }
        this.fixedMesh.position.set(
            positionFixed.x * canvasSize.width / vw.value,
            positionFixed.y * canvasSize.height / vh.value,
            0
        )
        this.fixedMesh.scale.set(
            boundsFixed.width * canvasSize.width / vw.value,
            boundsFixed.height * canvasSize.height / vh.value,
            1
        )


        this.offset = -Math.floor((this.scrollPosition + this.positionEl.y + containerHeight.value / 2) / containerHeight.value) * containerHeight.value
        this.computeCoord()
    }

    computeCoord() {
        this.mesh.position.set(
            (this.positionEl.x * N.Ease.i3(1 - this.uVelo.value)) * this.canvasSize.width / vw.value,
            (this.positionEl.y + this.scrollPosition + this.offset) * this.canvasSize.height / vh.value,
            0
        )

    }
}

const fragment = /* glsl */ `#version 300 es
#define borderWidth 2.
precision highp float;

uniform sampler2D tMap;
uniform vec4 uId;

in vec2 vUv;
out vec4 FragColor[2];

uniform float uLoaded;
uniform float uHover;
uniform float uShow;
uniform float uPixelHeight;
uniform float uPixelWidth;
uniform vec2 uBounds;

void main() {

    vec4 color = texture(tMap, vUv);
    color.a = 1.;
    color = mix(vec4(0.886,0.886,0.886,1.), color, uLoaded);

    if(uBounds.y - borderWidth < vUv.y * uBounds.y || vUv.y * uBounds.y < borderWidth || uBounds.x - borderWidth < vUv.x * uBounds.x || vUv.x * uBounds.x < borderWidth){
        color.rgb = mix(color.rgb, vec3(0.878,0.878,0.878), uHover);
    } else {
        color = mix(color, vec4(0.), uHover);
    }

    color = mix(color, vec4(0.), 1. - uShow);

    FragColor[0] = vec4(color.rgba);
    FragColor[1] = uId;
}
`;

const vertex = /* glsl */ `#version 300 es
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

  vec4 mvmP = modelViewMatrix * vec4(p, 1.);

  mvmP.z += cos(mvmP.y * .5) * uVelo * 1.2;
  gl_Position = projectionMatrix * mvmP;
}`;


const fixedFrag = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform vec4 uId;

in vec2 vUv;
out vec4 FragColor[2];

uniform float uLoaded;
uniform float uHover;

void main() {
    vec4 color = texture(tMap, vUv);
    color = mix(vec4(0.886,0.886,0.886,1.), color, uLoaded);
    color = mix(color, vec4(0.), 1. - uHover);
    FragColor[0] = vec4(color.rgba);
    FragColor[1] = uId;
}
`;