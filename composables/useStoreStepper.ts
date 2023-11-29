import { MANIFEST } from "~/services/Manifest"

const homeStore = [
    {
        title: "Viadomo©DECO",
        titleHTML: '<span class="overflow-content">V</span><span class="overflow-content">i</span><span class="overflow-content">a</span><span class="overflow-content">d</span><span class="overflow-content">o</span><span class="overflow-content">m</span><span class="overflow-content">o</span><span class="overflow-content">©</span><span class="overflow-content">D</span><span class="overflow-content">E</span><span class="overflow-content">C</span><span class="overflow-content">O</span>',
        flavorMain: "An innovative collection of top-tier furniture",
        flavorSub: ["Web design", "Furniture", "11.2023"]
    },
    {
        title: "Avant garden",
        titleHTML: '<span class="overflow-content">A</span><span class="overflow-content">v</span><span class="overflow-content">a</span><span class="overflow-content">n</span><span class="overflow-content">t</span><span class="overflow-content">&nbsp;</span><span class="overflow-content">g</span><span class="overflow-content">a</span><span class="overflow-content">r</span><span class="overflow-content">d</span><span class="overflow-content">e</span><span class="overflow-content">n</span>',
        flavorMain: "Fashion clothing from the future.",
        flavorSub: ["Web design", "Fashion", "03.2023"]
    },
    {
        title: "MUCHO MATXA",
        titleHTML: '<span class="overflow-content">M</span><span class="overflow-content">U</span><span class="overflow-content">C</span><span class="overflow-content">H</span><span class="overflow-content">O</span><span class="overflow-content">&nbsp;</span><span class="overflow-content">M</span><span class="overflow-content">A</span><span class="overflow-content">T</span><span class="overflow-content">X</span><span class="overflow-content">A</span>',
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

    return { stack, LERP, imageBounds, getTexture, currentIndex, stepperIsHovered, length, idToIndex, homeStore }
})
