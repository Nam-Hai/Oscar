const homeStore = [
    {
        title: "Viadomo ©DECO",
        titleHTML: '<span class="overflow-content">V</span><span class="overflow-content">i</span><span class="overflow-content">a</span><span class="overflow-content">d</span><span class="overflow-content">o</span><span class="overflow-content">m</span><span class="overflow-content">o</span><span class="overflow-content">©</span><span class="overflow-content">D</span><span class="overflow-content">E</span><span class="overflow-content">C</span><span class="overflow-content">O</span>',
        flavorMain: "An innovative collection of top-tier furniture",
        flavorSub: ["Web design", "Furniture", "11.2023"],
        link: "/project-page/viadomo-deco",
        mini: "/Assets/Minia/home_mini_1.jpg"
    },
    {
        title: "Avant garden",
        flavorMain: "Fashion clothing from the future.",
        flavorSub: ["Web design", "Fashion", "03.2023"],
        link: "/project-page/avant-garden",
        mini: "/Assets/Minia/home_mini_2.jpg",
    },
    {
        title: "MUCHO MATXA",
        flavorMain: "Lorem ipsum dolor sit amet consectetur.",
        flavorSub: ["Type", "Field", "Date"],
        link: "/project-page/mucho-matxa",
        mini: "/Assets/Minia/home_mini_3.jpg",
    },
    {
        title: "MAPFRE SALUD",
        flavorMain: "An online and face-to-face health app.",
        flavorSub: ["App Design", "Health", "11.2022"],
        link: "/project-page/mapfre-salud",
        mini: "/Assets/Minia/home_mini_4.jpg",
    }
]

export const useStoreStepper = createStore(() => {
    const LERP = [0.15, 0.11, 0.09, 0.077]
    const imageBounds = { w: 100, h: 60 }
    const length = homeStore.length
    const currentIndex = ref(0)

    const idToIndex = new Map<number, number>()

    const stack = N.Arr.create(length).map((el, index) => {
        const i = N.mod(index - 1, length)
        return {
            lerp: LERP[i],
            renderOrder: length - 1 - i,
        }
    })
    stack[0].renderOrder++

    function getTexture(id: number) {
        const homeTextures = Object.values(useManifest().textures.home)
        return homeTextures[id]
    }

    const stepperIsHovered = ref(false)

    const hideTrail = ref(true)

    return { stack, LERP, imageBounds, getTexture, currentIndex, stepperIsHovered, length, idToIndex, homeStore, hideTrail }
})
