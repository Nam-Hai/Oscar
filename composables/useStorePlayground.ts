import { EventEmitter, EventHandler } from "~/scene/utils/WebGL.utils"

const PLAYGROUND__TEXTURE = [
    "/Assets/Home/1.jpg",
    "/Assets/Home/2.jpg",
    "/Assets/info/Oscar_Pico.png",
    "/Assets/Home/3.jpg",
    "/Assets/Home/4.jpg",
    "/Assets/Home/1.jpg",
    "/Assets/Home/2.jpg",
    "/Assets/Home/3.jpg",
]
export const useStorePlayground = createStore(() => {
    const src = PLAYGROUND__TEXTURE
    const mediaBoundsPixel = shallowRef({
        width: 100,
        gap: 10
    })

    const placeMediaEvent = new EventEmitter()

    return { src, mediaBoundsPixel, placeMediaEvent }
})