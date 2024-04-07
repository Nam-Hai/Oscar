import ProjectSliceA from "~/components/project/ProjectSlice/A.vue"
import ProjectSliceB from "~/components/project/ProjectSlice/B.vue"
import ProjectSliceC from "~/components/project/ProjectSlice/C.vue"
import ProjectSliceD from "~/components/project/ProjectSlice/D.vue"
import ProjectSliceE from "~/components/project/ProjectSlice/E.vue"
import ProjectSliceF from "~/components/project/ProjectSlice/F.vue"
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
        date: "2023",
        description: "An innovative collection of top-tier furniture, reshaping the definition of luxury and sophistication.",
        main_image: {
            src_1: "/Assets/Home/01_Home_Viadomo.webp",
            src_2: "/Assets/Viadomo/output_1.webp",
        },
        slice: [
            {
                keyId: ProjectSliceC,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/output_2.webm",
                        type: "video/webm"
                    },
                    src_2: {
                        src: "/Assets/Viadomo/output_3.webp",
                        type: "image"
                    }
                },
            },
            {
                keyId: ProjectSliceD,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/output_4.webp",
                        type: "image"
                    }
                },
            },
            {
                keyId: ProjectSliceC,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/output_5.webm",
                        type: "video/webm"
                    },
                    src_2: {
                        src: "/Assets/Viadomo/output_6.webp",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSliceD,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/output_7.webp",
                        type: "image"
                    }
                },
            },
            {
                keyId: ProjectSliceF,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/output_8.webp",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSliceD,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/output_9.webp",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSliceA,
                data: {
                    src_1: {
                        src: "/Assets/Viadomo/output_10.webp",
                        type: "image"
                    },
                    src_2: {
                        src: "/Assets/Viadomo/output_11.webp",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSliceNext,
                data: {
                    src_1: {
                        src: "/Assets/Home/02_Home_AvantGarden.webp",
                        type: "image"
                    }
                },
            }
        ]
    },
    "avant-garden": {
        title: 'Avant garden',
        type: "Fashion",
        date: "2023",
        description: "A digital and physical newsletter showcasing the last vanguard fashion and beauty news.",
        main_image: {
            src_1: "/Assets/Home/02_Home_AvantGarden.webp",
            src_2: "/Assets/Avant_Garden/output_1.webp",
        },
        slice: [
            {
                keyId: ProjectSliceC,
                data: {
                    src_1: {
                        src: "/Assets/Avant_Garden/output_1.webp",
                        type: "image"
                    },
                    src_2: {
                        src: "/Assets/Avant_Garden/output_2.webp",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSliceF,
                data: {
                    src_1: {
                        src: "/Assets/Avant_Garden/output_3.webp",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSliceD,
                data: {
                    src_1: {
                        src: "/Assets/Avant_Garden/output_4.webp",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSliceA,
                data: {
                    src_1: {
                        src: "/Assets/Avant_Garden/output_5.webp",
                        type: "image"
                    },
                    src_2: {
                        src: "/Assets/Avant_Garden/output_6.webp",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSliceD,
                data: {
                    src_1: {
                        src: "/Assets/Avant_Garden/output_7.webp",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSliceE,
                data: {
                    src_1: {
                        src: "/Assets/Avant_Garden/output_8.webm",
                        type: "video/webm"
                    },
                    src_2: {
                        src: "/Assets/Avant_Garden/output_9.webp",
                        type: "video/webm"
                    },
                },
            },
            {
                keyId: ProjectSliceF,
                data: {
                    src_1: {
                        src: "/Assets/Avant_Garden/output_10.webp",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSliceD,
                data: {
                    src_1: {
                        src: "/Assets/Avant_Garden/output_11.webp",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSliceB,
                data: {
                    src_1: {
                        src: "/Assets/Avant_Garden/output_13.webp",
                        type: "image"
                    },
                    src_2: {
                        src: "/Assets/Avant_Garden/output_14.webp",
                        type: "image"
                    },
                },
            },
            {
                keyId: ProjectSliceNext,
                data: {
                    src_1: {
                        src: "/Assets/Home/03_Home_MuchoMatcha.webp",
                        type: "image"
                    }
                },
            }
        ]
    },
    "mucho-matxa": {
        title: 'mucho matxa',
        type: "Furniture",
        date: "03.2023",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
        main_image: {
            src_1: "/Assets/Home/03_Home_MuchoMatcha.webp",
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
            src_1: "/Assets/Home/04_Home_MapfreSalud.webp",
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