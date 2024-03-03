import Lenis from "@studio-freight/lenis";
import { RefSymbol } from "@vue/reactivity";

export const useStoreView = createStore(() => {
	const mouse = ref({ x: 0, y: 0 });
	const firstMove = ref(false)

	const vh = ref(0);
	const vw = ref(0);
	const scale = ref(0);
	const breakpoint = ref("");
	const scrollLenis = ref(0);
	const scrollLenisOn = ref(true);

	const preventScroll = ref(false);
	const lenis = ref() as Ref<Lenis>;

	const canvasBg = shallowRef([0, 0, 0, 0])
	const mouseLag = shallowRef({ x: 0, y: 0 })

	function init() {
		lenis.value = new Lenis();

		const ro = useROR((e) => {
			vh.value = e.vh;
			vw.value = e.vw;
			scale.value = e.scale;
			breakpoint.value = e.breakpoint;
		});
		ro.on();
		ro.trigger();

		const updateMouse = (evt: MouseEvent) => {
			if (!firstMove.value) firstMove.value = true
			mouse.value = { x: evt.clientX, y: evt.clientY };
		};
		document.addEventListener("mousemove", updateMouse);

		const router = useRouter()

		watch(router.currentRoute, route => {
			if (route.name === 'info') {
				canvasBg.value = [0, 0, 0, 0]
			} else {
				canvasBg.value = [0.969, 0.961, 0.949, 0]
			}
		}, { immediate: true })
	}
	function resetLenis({
		wrapper,
		content,
		target,
		infinite,
		direction,
		duration,
		lerp,
	}: {
		wrapper?: Window | HTMLElement;
		content?: HTMLElement;
		target?: Window | HTMLElement;
		infinite?: boolean;
		direction?: "horizontal" | "vertical";
		duration?: number;
		lerp?: number;
	}) {
		lenis.value.destroy();
		lenis.value = new Lenis({
			wrapper,
			content,
			wheelEventsTarget: target,
			normalizeWheel: true,
			smoothTouch: false,
			syncTouch: true,
			wheelMultiplier: 0.82,
			touchMultiplier: 1.0,
			infinite: infinite,
			orientation: direction,
			duration,
			// lerp
		});
		lenis.value.stop();
		// lenis.value.normalizeWheel
		scrollLenis.value = 0;
		lenis.value.on("scroll", (e: { animatedScroll: number }) => {
			if (!scrollLenisOn.value) {
				scrollLenis.value = 0;
				return;
			}
			scrollLenis.value = e.animatedScroll;
		});
	}

	return {
		mouse,
		firstMove,
		mouseLag,
		vw,
		canvasBg,
		vh,
		scale,
		breakpoint,
		lenis,
		init,
		preventScroll,
		resetLenis,
		scrollLenis,
		scrollLenisOn,
	};
});
