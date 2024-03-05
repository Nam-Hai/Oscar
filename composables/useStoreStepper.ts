const homeStore = [
    {
        title: "Viadomo DECO",
        titleMobile: "Viadomo DECO",
        titleHTML: '<span class="overflow-content">V</span><span class="overflow-content">i</span><span class="overflow-content">a</span><span class="overflow-content">d</span><span class="overflow-content">o</span><span class="overflow-content">m</span><span class="overflow-content">o</span><span class="overflow-content">©</span><span class="overflow-content">D</span><span class="overflow-content">E</span><span class="overflow-content">C</span><span class="overflow-content">O</span>',
        flavorMain: "A studio of crafters of original design furniture pieces.",
        flavorSub: ["Web design", "Furniture", "11.2023"],
        flavorTitle: ["Type", "Field", "Date"],
        link: "/project-page/viadomo-deco",
        mini: "/Assets/Minia/1_mini.jpg"
    },
    {
        title: "Avant garden",
        titleMobile: "Avant garden",
        flavorMain: "A newsletter showcasing vanguard fashion and beauty.",
        flavorSub: ["Web", "Fashion", "2023"],
        flavorTitle: ["Type", "Field", "Date"],
        link: "/project-page/avant-garden",
        mini: "/Assets/Minia/2_mini.jpg",
    },
    {
        title: "MUCHO MATXA",
        titleMobile: "MUCHO MATXA",
        flavorMain: "E-shop of high-quality Basque matcha tea and its accesories.",
        flavorSub: ["Web", "Nutrition", "2023"],
        flavorTitle: ["Type", "Field", "Date"],
        link: "/project-page/mucho-matxa",
        mini: "/Assets/Minia/3_mini.jpg",
    },
    {
        title: "MAPFRE SALUD",
        titleMobile: "MAPFRE SALUD",
        flavorMain: "Official healthcare app, offering professional services.",
        flavorSub: ["App", "Health", "2022"],
        flavorTitle: ["Type", "Field", "Date"],
        link: "/project-page/mapfre-salud",
        mini: "/Assets/Minia/4_mini.jpg",
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

    const tileHover = ref(false)
    return { stack, LERP, imageBounds, getTexture, currentIndex, stepperIsHovered, tileHover, length, idToIndex, homeStore, hideTrail }
})
