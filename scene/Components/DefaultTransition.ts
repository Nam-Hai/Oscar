import { Vec2, Program, Mesh, Texture, Plane, Vec3, Transform } from 'ogl'
import type { RafR, rafEvent } from "~/plugins/core/raf";
import { CanvasNode } from '../utils/types';
import { veloVertex as vertex } from './Project/TransitionMediaTest';

const { vh, vw, scale, mouse } = useStoreView()

export class DefaultTransition extends CanvasNode {
    raf: RafR;

    canvasSize!: { width: number; height: number; };
    uVelo: { value: number; };

    constructor(gl: any) {
        super(gl)
        N.BM(this, ['update', 'onResize'])


        this.uVelo = { value: 0 }
        this.raf = useRafR(this.update)

        this.addEventListener()

        this.mount()
        this.init()

        this.onDestroy(() => this.raf.stop())
    }

    addEventListener() {
        const { unWatch: resizeUnWatch } = useCanvasSize(this.onResize)

        this.onDestroy(() => resizeUnWatch())
    }

    init() {
        this.raf.run()
    }

    mount() {
        const geometry = new Plane(this.gl, {
            widthSegments: 40,
            heightSegments: 40
        })

        const program = new Program(this.gl, {
            fragment,
            vertex,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                uId: this.uId,
                uVelo: this.uVelo
            }
        })

        this.node = new Mesh(this.gl, {
            geometry,
            program,
        })
        this.node.position.set(0, this.canvasSize.height, 0);
        this.node.scale.set(this.canvasSize.width, this.canvasSize.height, 1)
        this.node.setParent(this.node);
        (this.node as Mesh).renderOrder = 2000
    }

    animate(t: number) {
        this.node.position.y = N.Lerp(this.canvasSize.height, -this.canvasSize.height, t)
    }

    update(e: rafEvent) {
    }

    onResize(canvasSize: { width: number, height: number }) {
        this.canvasSize = canvasSize
    }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform vec4 uId;

in vec2 vUv;
out vec4 FragColor[2];

void main() {
    // object-fix: cover
    vec4 color = vec4(1.,0.,0.4, 1.);

    FragColor[0] = color;
    FragColor[1] = uId;
}
`