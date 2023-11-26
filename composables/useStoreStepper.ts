import { MANIFEST } from "~/services/Manifest"

const homeStore = [
    {
        title: "Viadomo©DECO",
        flavorMain: "An innovative collection of top-tier furniture",
        flavorSub: ["Web design", "Furniture", "11.2023"]
    },
    {
        title: "Avant garden",
        flavorMain: "Fashion clothing from the future.",
        flavorSub: ["Web design", "Fashion", "03.2023"]
    },
    {
        title: "MUCHO MATXA",
        flavorMain: "Lorem ipsum dolor sit amet consectetur.",
        flavorSub: ["Type", "Field", "Date"]
    }
]

export const useStoreStepper = createStore(() => {
    const LERP = [0.15, 0.11, 0.09]
    const imageBounds = { w: 100, h: 60 }
    const length = MANIFEST.home.length
    const currentIndex = ref(0)

    const idToIndex = new Map<number, number>()

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

    const stepperIsHovered = ref(false)

    return { stack, LERP, imageBounds, getTexture, currentIndex, stepperIsHovered, length, idToIndex, homeStore}
})
