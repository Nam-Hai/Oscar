import type { RouteLocationNormalized } from 'vue-router';
import { Renderer, Camera, Transform, type OGLRenderingContext } from 'ogl'

import { FallbackCanvas } from './Pages/fallbackCanvas';
import { ROR } from '~/plugins/core/resize';
import { FlowProvider } from '~/waterflow/FlowProvider';
import { PreloaderCanvas } from './Pages/PreloaderCanvas';
import type { CanvasPage } from './utils/types';
import { IndexCanvas } from './Pages/IndexCanvas';
import { ProjectCanvas } from './Pages/ProjectCanvas';

type routeMapType = 'index' | 'project-page-id'

export default class Canvas {
    renderer: Renderer;
    gl: OGLRenderingContext;
    camera: Camera;
    scene: Transform;

    ro: any;

    nextPage: CanvasPage | undefined;
    currentPage!: CanvasPage;

    map: Map<string, () => CanvasPage>;
    on?: boolean;
    size: Ref<{ width: number; height: number; }>;
    fallback?: FallbackCanvas;
    index?: IndexCanvas;
    projectPage?: ProjectCanvas;

    dom: HTMLCanvasElement;

    constructor() {
        this.renderer = new Renderer({
            alpha: true,
            antialias: true,
            premultipliedAlpha: true,
            dpr: devicePixelRatio,
        });
        this.gl = this.renderer.gl
        this.gl.clearColor(0.945, 0.945, 0.945, 0)
        // this.gl.clearColor(0, 0, 0, 0)
        this.dom = this.gl.canvas

        this.map = new Map([
            ['fallback', this.createFallbackCanvas],
            ['index', this.createIndexCanvas],
            ['project-page-id', this.createProjectPage]
        ])

        this.camera = new Camera(this.gl);
        this.camera.position.z = 5;

        this.scene = new Transform();
        N.BM(this, ["resize"]);


        this.size = ref({ width: 0, height: 0 })

        this.on = true

        this.ro = new ROR(this.resize)
        this.ro.on();
    }

    preloader() {
        const preloader = new PreloaderCanvas(this.gl, { scene: this.scene, camera: this.camera })
        preloader.init()
    }

    init(flowProvider: FlowProvider) {
        this.onChange(flowProvider.getRouteFrom())
        // this.currentPage = this.nextPage!
        // this.currentPage.init()

        this.resolveOnChange()
    }

    private resize({ vh, vw, scale }: { vh: number, vw: number, scale: number }) {

        this.renderer.setSize(vw, vh);

        this.camera.perspective({
            aspect: vw / vh
        });
        const fov = (this.camera.fov * Math.PI) / 180;

        const height = 2 * Math.tan(fov / 2) * this.camera.position.z;

        this.size.value = {
            height,
            width: height * this.camera.aspect
        }
    }

    onChange(route: RouteLocationNormalized) {
        // if (isMobile.value) return
        if (!this.on) return
        const routeName = route.name?.toString() || ''
        const createPage = this.map.get(routeName) || this.createFallbackCanvas
        this.nextPage = createPage.bind(this)()
    }

    resolveOnChange() {
        if (!this.on) return
        if (this.currentPage) {
            this.currentPage.destroy()
        }
        if (this.nextPage) {
            this.nextPage.init()
            this.currentPage = this.nextPage
        }
    }

    createIndexCanvas() {
        this.index = new IndexCanvas(this.gl, { camera: this.camera, scene: this.scene })
        return this.index
    }
    createProjectPage() {
        this.projectPage = new ProjectCanvas(this.gl, { camera: this.camera, scene: this.scene })
        return this.projectPage
    }
    createFallbackCanvas() {
        // this.fallback = new FallbackCanvas({ gl: this.gl, scene: this.scene, camera: this.camera })
        this.fallback = new FallbackCanvas(this.gl, { camera: this.camera, scene: this.scene })
        return this.fallback
    }

    destroy() {
        this.ro.off()
    }
}
