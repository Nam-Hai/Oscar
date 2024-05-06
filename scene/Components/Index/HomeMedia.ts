import { Mesh, Plane, Program, Texture, Transform } from "ogl";
import type { OGLRenderingContext } from "ogl";
import { CanvasNode } from "../../utils/types";
import type { RafR, Timer, rafEvent } from "~/plugins/core/raf";
import { Timeline } from "/Users/namhai/Documents/Code/Oscar/plugins/core/motion";
import { useCanvasReactivity } from "../../utils/WebGL.utils";
// import { Pane } from "tweakpane";

const { currentIndex, length } = useStoreStepper();
const { progress } = useCursorStore()
const { isMobile } = useStore()

const uReach = { value: 2 };
const uForce = { value: 0.6 };

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
	uTime!: { value: number };
	raf: RafR;
	uIntrinsecRatio: number;
	uSizeCanvas: { value: number[] };
	uScaleOffset: { value: number[] };
	uTranslateOffset: { value: number[] };
	uProgress: { value: number };
	currentMesh!: Mesh;
	textures: Texture[];
	onChangeImmediate: boolean;
	waitAnimation: boolean;
	oldMesh: Mesh | undefined;
	lastIndex: number = currentIndex.value;
	scrollArray: { on: { value: boolean; }; distance: { value: number; }; start: { value: number; }; tl: Timeline; timer: Timer; }[];
	constructor(gl: OGLRenderingContext, options?: null) {
		super(gl);

		N.BM(this, ["update", "resize", "onScroll"]);

		const manifest = useManifest();
		this.textures = Object.values(manifest.textures.home);

		this.uProgress = { value: 0 };

		this.uSizeCanvas = { value: [1, 1] };
		this.uIntrinsecRatio = this.textures[0].image
			? (this.textures[0].image as HTMLImageElement).width /
			(this.textures[0].image as HTMLImageElement).height
			: 1;
		this.uScaleOffset = {
			value: [
				this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] <
					this.uIntrinsecRatio
					? this.uSizeCanvas.value[0] /
					(this.uSizeCanvas.value[1] * this.uIntrinsecRatio)
					: 1,
				this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] <
					this.uIntrinsecRatio
					? 1
					: (this.uSizeCanvas.value[1] * this.uIntrinsecRatio) /
					this.uSizeCanvas.value[0],
			],
		};
		this.uTranslateOffset = {
			value: [
				this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] <
					this.uIntrinsecRatio
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
			],
		};

		this.onChangeImmediate = false;

		this.scrollArray = N.Arr.create(length).map(() => {
			let on = { value: false }
			let distance = { value: 0 }
			let start = { value: 0 }

			const tl = useTL()
			const timer = useTimer(() => {
				on.value = false;
				tl.reset();
				const distFrom = distance.value;


				tl.from({
					e: "io3",
					d: 800,
					update: ({ progE }) => {
						distance.value = distFrom * (1 - progE);
					},
				}).play();
			}, 180)
			return {
				on, distance, start, tl, timer
			}
		})

		this.waitAnimation = false;

		this.raf = useRafR(this.update);
		this.onDestroy(() => {
			this.raf.kill();
		});

		this.mount();
		this.init();
		this.addEventListener();
	}

	mount() {
		this.node = new Transform();
		this.currentMesh = this.createPlane(currentIndex.value);
		this.currentMesh.setParent(this.node);
		this.currentMesh.program.uniforms.uInProgress.value = 1;

		const s = useCanvas().size.value;
		this.node.scale.set(s.width / 4, s.height / 4, 1);
	}

	async addEventListener() {
		const { watch } = useCanvasReactivity(this);

		await nextTick();
		const lenis = useLenis();
		const scrollUnsub = lenis.on("scroll", this.onScroll);

		watch(currentIndex, (i) => {
			this.onChange(i);
		});

		const { unWatch: resizeWatcher } = useCanvasSize(this.resize);

		this.onDestroy(() => resizeWatcher());
		this.onDestroy(() => scrollUnsub());
	}

	onScroll(e: {
		velocity: number;
		animatedScroll: number;
	}) {
		if(isMobile) return

		for (const scrollWrapper of this.scrollArray) {

			if (!scrollWrapper.on.value) {
				scrollWrapper.on.value = true;
				scrollWrapper.start.value = e.animatedScroll - scrollWrapper.distance.value;
				scrollWrapper.tl.reset();
				return;
			}
			scrollWrapper.distance.value = e.animatedScroll - scrollWrapper.start.value;

			if (Math.abs(e.velocity) > 0.1) {
				scrollWrapper.timer.tick();
			}
		}
	}
	onChange(nextId: number) {
		const oldMesh = this.currentMesh
		this.oldMesh = oldMesh
		const currentMesh = this.createPlane(nextId)
		this.currentMesh = currentMesh
		let added = false

		const DURATION = 1050
		const DELAY_IN = this.onChangeImmediate ? 0 : 250

		const tl = useTL()
		if (!this.onChangeImmediate) {
			tl.from({
				d: 600,
				e: 'i2',
				update: ({ progE }) => {
					oldMesh.program.uniforms.uOutProgress.value = progE
				},
				cb: () => {
				},
			})
		} else {
			tl.from({
				d: DURATION + DELAY_IN,
				update({ prog, progE }) {
				},
				cb: () => {
					if (!this.oldMesh) return
					this.oldMesh.setParent(null)
					this.oldMesh = undefined
				}
			})
		}

		tl.from({
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

				const scrollWrapper = this.scrollArray[nextId]
				this.waitAnimation = false;
				this.onChangeImmediate = false;

				scrollWrapper.on.value = false;
				scrollWrapper.distance.value = 0;
				scrollWrapper.timer.stop();
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
				uForce,
			},
		});
		const geometry = new Plane(this.gl, {
			widthSegments: 20,
			heightSegments: 20,
		});

		const mesh = new Mesh(this.gl, {
			geometry,
			program,
			// renderOrder: -1
		});
		return mesh;
	}

	init() {
		this.raf.run();
	}

	resize({ width, height }: { width: number; height: number }) {
		this.uSizeCanvas.value = [width, height];

		this.uScaleOffset.value = [
			this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] <
				this.uIntrinsecRatio
				? this.uSizeCanvas.value[0] /
				(this.uSizeCanvas.value[1] * this.uIntrinsecRatio)
				: 1,
			this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] <
				this.uIntrinsecRatio
				? 1
				: (this.uSizeCanvas.value[1] * this.uIntrinsecRatio) /
				this.uSizeCanvas.value[0],
		];
		this.uTranslateOffset.value = [
			this.uSizeCanvas.value[0] / this.uSizeCanvas.value[1] <
				this.uIntrinsecRatio
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

		this.node.scale.set(width, height, 1);
	}

	update(e: rafEvent) {
		const distTrigger = 2000;
		{

			const currentMesh = this.currentMesh;

			const scrollWrapper = this.scrollArray[currentIndex.value]
			const distance = scrollWrapper.distance.value
			const f = Math.abs(distance) / distTrigger;
			progress.value = Math.sign(distance) * N.Clamp(f, 0, 0.4) / 0.4

			const dir = distance > 0 ? 1 : -1;

			if (!this.waitAnimation) {
				currentMesh.program.uniforms.uOutProgress.value = Math.sign(distance) * f;
				if (dir < 0) {
					currentMesh.position.z = f * 1
				}
			}
			if (f >= 0.4 && !this.waitAnimation) {
				this.waitAnimation = true
				this.onChangeImmediate = true;
				this.lastIndex = currentIndex.value
				currentIndex.value = N.mod(currentIndex.value + dir, length);
			}
		}
		{
			const currentMesh = this.oldMesh;
			if (!currentMesh) return
			const index = N.mod(this.lastIndex, length)
			const scrollWrapper = this.scrollArray[index]
			const distance = scrollWrapper.distance.value
			const f = Math.abs(distance) / distTrigger;
			const dir = distance > 0 ? 1 : -1;

			currentMesh.program.uniforms.uOutProgress.value = Math.sign(distance) * f;
			if (dir < 0) {
				currentMesh.position.z = f * 1
			}
		}
	}

	destroy() {
		super.destroy();
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
	color = mix(color, vec4(0., 0., 0., 1.), 0.25);

    FragColor[0] = color;
    // FragColor[1] = color;
}
`;
const vertex = /* glsl */ `#version 300 es
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

    newP.z += cos(d / dMax * 3.1415 ) * 1.2 * uOutProgress;
    // newP.z += cos()

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * newP;
}`;

