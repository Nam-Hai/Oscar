import { MANIFEST } from "~/services/Manifest"

export const useStoreStepper = createStore(() => {
    const LERP = [0.15, 0.11, 0.09]
    const imageBounds = { w: 100, h: 60 }
    const length = MANIFEST.home.length
    const currentIndex = ref(0)

    const stack = N.Arr.create(length).map((el, index) => {
        return {
            lerp: LERP[index],
            renderOrder: length - 1 - index,
        }
    })
    stack[0].renderOrder++

    function getTexture(id: number) {
        const homeTextures = useManifest().textures.home
        return homeTextures[id]
    }

    return { stack, LERP, imageBounds, getTexture, currentIndex}
})