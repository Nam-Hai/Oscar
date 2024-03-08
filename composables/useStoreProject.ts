import ProjectSlice1 from "~/components/project/ProjectSlice/1.vue"
import ProjectSlice2 from "~/components/project/ProjectSlice/2.vue"
import ProjectSlice3 from "~/components/project/ProjectSlice/3.vue"
import ProjectSlice4 from "~/components/project/ProjectSlice/4.vue"
import ProjectSlice5 from "~/components/project/ProjectSlice/5.vue"
import ProjectSlice6 from "~/components/project/ProjectSlice/6.vue"
import ProjectSliceNext from "~/components/project/ProjectSlice/NextProject.vue"

export interface ISlice {
    keyId: any,
    data: {
        [key: string]: {
            src: string,
            type: "video/mp4" | "video/webm" | "image"
        }
    },
}

type ProjectCopyType = {
    title: string,
    type: string,
    date: string,
    description: string,
    main_image: {
        src_1: string,
        src_2: string,
    }
    slice: ISlice[]
}
const projectCopy: { [key: string]: ProjectCopyType } = {
    "viadomo-deco": {
        title: 'VIADOMO DECO',
        type: "Furniture",
        date: "03.2023",
        description: "VIADOMO©DECO boasts an innovative collection of top-tier furniture, reshaping the definition of luxury and sophistication.",
        main_image: {
            src_1: "/Assets/Home/1.jpg",
            src_2: "/Assets/Viadomo/1_1.jpg",
        },
        slice: [
            {
                keyId: ProjectSlice1,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/2.mp4",
                        type: "video/mp4"
                    },
                    src_2: {
                        src: "/Assets/Viadomo/3.jpg",
                        type: "image"
                    }
                },
            },
            {
                keyId: ProjectSlice2,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/4_1.jpg",
                        type: "image"
                    },
                    src_2: {
                        src: "/Assets/Viadomo/5_1.jpg",
                        type: "image"
                    }
                },
            },
            {
                keyId: ProjectSlice3,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/6.jpg",
                        type: "image"
                    },
                    src_2: {
                        src: "/Assets/Viadomo/7.jpg",
                        type: "image"
                    },
                    src_3: {
                        src: "/Assets/Viadomo/8.mp4",
                        type: "video/mp4"
                    },
                },
            },
            {
                keyId: ProjectSlice4,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/9.jpg",
                        type: "image"
                    },
                    src_2: {
                        src: "/Assets/Viadomo/10.jpg",
                        type: "image"
                    },
                    // bg_src: "/Assets/Viadomo/9-10-Bg.jpg",
                    bg_src: {
                        src: "/Assets/Viadomo/9_10_Bg_2.jpg",
                        type: "image"
                    }
                },
            },
            {
                keyId: ProjectSlice1,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/11.jpg",
                        type: "image"
                    },
                    src_2: {
                        src: "/Assets/Viadomo/12.mp4",
                        type: "video/mp4"
                    },
                },
            },
            {
                keyId: ProjectSlice5,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/13.jpg",
                        type: "image"
                    },
                    src_2: {
                        src: "/Assets/Viadomo/14.jpg",
                        type: "image"
                    },
                    src_3: {
                        src: "/Assets/Viadomo/15.jpg",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSlice6,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/16.jpg",
                        type: "image"
                    },
                    src_2: {
                        src: "/Assets/Viadomo/17.jpg",
                        type: "image"
                    },
                },
            },
            // {
            //     keyId: ProjectSliceNext,
            //     data: {},
            // }
        ]
    },
    "avant-garden": {
        title: 'Avant garden',
        type: "Furniture",
        date: "03.2023",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
        main_image: {
            src_1: "/Assets/Home/2.jpg",
            src_2: "/Assets/Viadomo/6.jpg",
        },
        slice: [
            {
                keyId: "ProjectSliceNextProject",
                data: {},
            }
        ]
    },
    "mucho-matxa": {
        title: 'mucho matxa',
        type: "Furniture",
        date: "03.2023",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
        main_image: {
            src_1: "/Assets/Home/3.jpg",
            src_2: "/Assets/Viadomo/3.jpg",
        },
        slice: [
            {
                keyId: "ProjectSliceNextProject",
                data: {},
            }
        ]
    },
    "mapfre-salud": {
        title: 'mapfre salud',
        type: "App design",
        date: "11.2022",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
        main_image: {
            src_1: "/Assets/Home/4.jpg",
            src_2: "/Assets/Viadomo/3.jpg",
        },
        slice: [
            {
                keyId: "ProjectSliceNextProject",
                data: {},
            }
        ]
    }

}

export const useStoreProject = createStore(() => {
    const copy = projectCopy
    const landingHeaderScale = ref(1)

    const currentIndex = ref(0);
    const length = Object.values(copy).length
    const atEnd = ref(false)

    const idToIndex = new Map<string, number>([
        ['viadomo-deco', 0],
        ['avant-garden', 1],
        ['mucho-matxa', 2],
        ['mapfre-salud', 3],
    ])

    const nextPageTitleRef = ref() as Ref<HTMLElement>

    function isNextId(id: string) {
        const index = idToIndex.get(id) || 0
        return index == currentIndex.value + 1 || (currentIndex.value == (length - 1) && index == 0)
    }

    function isPreviousId(id: string) {
        const index = idToIndex.get(id) || 0
        return index == currentIndex.value - 1 || (currentIndex.value == 0 && index == (length - 1))
    }

    return { copy, currentIndex, length, idToIndex, landingHeaderScale, nextPageTitleRef, isNextId, isPreviousId, atEnd }
})