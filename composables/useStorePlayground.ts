
const PLAYGROUND__TEXTURE = [
    "/Assets/Home/1.jpg",
    "/Assets/Home/2.jpg",
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

    return { src, mediaBoundsPixel }
})