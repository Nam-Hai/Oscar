import { Vec2, Program, Mesh, Texture, Plane, Vec3, Transform } from "ogl";
import type { OGLRenderingContext } from "ogl";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity, useLenisGL, type LenisEvent } from "../../utils/WebGL.utils";

const { vh, vw, scale, breakpoint, mouse, scrollLenis } = useStoreView();

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

    constructor(
        gl: OGLRenderingContext,
        props: {
            index: number,
            el: HTMLElement
        }
    ) {
        super(gl);
        N.BM(this, ["update", "onResize", "destroy", "onScroll"]);
        this.index = props.index
        this.el = props.el

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
            (loaded) => {
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
        useLenisGL(this, this.onScroll)
        this.onDestroy(() => resizeUnWatch())
        this.raf.run();
    }

    onScroll(e: LenisEvent) {
        this.scrollPosition = e.animatedScroll
        const velo = Math.min(Math.abs(e.velocity), 50) / 50
        this.uVelo.value = N.Lerp(this.uVelo.value, velo, 0.1)
        // this.offset = Math.floor((this.scrollPosition + this.positionEl.y + vh.value / 2) / vh.value) * vh.value
        // console.log(this.offset, this.scrollPosition, this.positionEl.y);
        this.computeCoord()
    }

    mount() {
        const geometry = new Plane(this.gl, {
            widthSegments: 40,
            heightSegments: 40,
        });

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
                uVelo: this.uVelo
            },
        });

        this.node = new Mesh(this.gl, {
            geometry,
            program,
        });
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
        this.node.scale.set(
            bounds.width * canvasSize.width / vw.value,
            bounds.height * canvasSize.height / vh.value,
            1
        )
        this.computeCoord()
    }

    computeCoord() {
        this.node.position.set(
            (this.positionEl.x * N.Ease.i4(1 - this.uVelo.value)) * this.canvasSize.width / vw.value,
            (this.positionEl.y + this.scrollPosition - this.offset) * this.canvasSize.height / vh.value,
            0
        )

    }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform vec4 uId;

in vec2 vUv;
out vec4 FragColor[2];

uniform float uLoaded;

void main() {

    vec4 color = texture(tMap, vUv);
    color = mix(vec4(0.886,0.886,0.886,1.), color, uLoaded);
    FragColor[0] = vec4(color.rgb,1.);
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

  mvmP.z += cos(mvmP.y * .5) * uVelo * 0.9;

  gl_Position = projectionMatrix * mvmP;
}`;
