import { Vec2, Program, Mesh, Texture, Plane, Vec3, Transform } from "ogl";
import type { OGLRenderingContext } from "ogl";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from "../../utils/types";
import { useCanvasReactivity } from "../../utils/WebGL.utils";

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

    constructor(
        gl: OGLRenderingContext,
        props: {
            index: number
        }
    ) {
        super(gl);
        N.BM(this, ["update", "onResize", "destroy"]);
        this.index = props.index
        const { src } = useStorePlayground()
        this.src = src[this.index]
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

                    this.computeScale()
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

        const { mediaBoundsPixel } = useStorePlayground()
        watch(mediaBoundsPixel, (bounds) => {
            trigger()
        })

        const { unWatch: resizeUnWatch, trigger } = useCanvasSize(this.onResize);
        this.onDestroy(() => resizeUnWatch())
        this.raf.run();
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
            },
        });

        this.node = new Mesh(this.gl, {
            geometry,
            program,
        });
        this.computeScale()
    }
    computeScale() {
        if (!this.node) return

        this.node.scale.set(this.width, this.width / this.intrinsecRatio, 1)
    }

    update(e: rafEvent) {
    }

    onResize(canvasSize: { width: number; height: number }) {
        const { mediaBoundsPixel } = useStorePlayground()
        const width = mediaBoundsPixel.value.width * canvasSize.width / vw.value
        this.width = width
        this.computeScale()
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

out vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;

  vec4 mvmP = modelViewMatrix * vec4(p, 1.);

  gl_Position = projectionMatrix * mvmP;
}`;
