import ProjectSlice1 from "~/components/project/ProjectSlice/1.vue"
import ProjectSlice2 from "~/components/project/ProjectSlice/2.vue"
import ProjectSlice3 from "~/components/project/ProjectSlice/3.vue"
import ProjectSlice4 from "~/components/project/ProjectSlice/4.vue"
import ProjectSlice5 from "~/components/project/ProjectSlice/5.vue"
import ProjectSlice6 from "~/components/project/ProjectSlice/6.vue"
import ProjectSliceNext from "~/components/project/ProjectSlice/NextProject.vue"

export interface ISlice {
    keyId: any,
    data: { [key: string]: any },
    key: number
}

type ProjectCopyType = {
    title: string,
    type: string,
    date: string,
    main_image: {
        src_1: string,
        src_2: string,
    }
    slice: ISlice[]
}
const projectCopy: { [key: string]: ProjectCopyType } = {
    "viadomo-deco": {
        title: 'VIADOMO©DECO',
        type: "Fourniture",
        date: "03.2023",
        main_image: {
            src_1: "/Assets/Home1.png",
            src_2: "/Assets/Viadomo/1.jpg",
        },
        slice: [
            {
                keyId: ProjectSlice1,
                data: {
                    src_1: "/Assets/Viadomo/2.png",
                    src_2: "/Assets/Viadomo/3.png",
                },
                key: 1
            },
            {
                keyId: ProjectSlice2,
                data: {
                    src_1: "/Assets/Viadomo/4.png",
                    src_2: "/Assets/Viadomo/5.png",
                },
                key: 2
            },
            {
                keyId: ProjectSlice3,
                data: {
                    src_1: "/Assets/Viadomo/6.png",
                    src_2: "/Assets/Viadomo/7.png",
                    src_3: "/Assets/Viadomo/8.png",
                    src_4: "/Assets/Viadomo/9.png",
                },
                key: 3
            },
            {
                keyId: ProjectSliceNext,
                data: {},
                key: 4
            }

        ]
    },
    "avant-garden": {
        title: 'Avant garden',
        type: "Fourniture",
        date: "03.2023",
        main_image: {
            src_1: "/Assets/Home_2.jpg",
            src_2: "/Assets/Viadomo/6.png",
        },
        slice: [
            {
                keyId: "ProjectSliceNextProject",
                data: {},
                key: 1
            }
        ]
    },
    "mucho-matxa": {
        title: 'mucho matxa',
        type: "Fourniture",
        date: "03.2023",
        main_image: {
            src_1: "/Assets/Home3.png",
            src_2: "/Assets/Viadomo/8.png",
        },
        slice: [
            {
                keyId: "ProjectSliceNextProject",
                data: {},
                key: 1
            }
        ]
    }

}

export const useStoreProject = createStore(() => {
    const copy = projectCopy
    const firstScroll = ref(false)
    const landingHeaderScale = ref(1)

    const currentIndex = ref(0);
    const length = Object.values(copy).length

    const idToIndex = new Map<string, number>([
        ['viadomo-deco', 0],
        ['avant-garden', 1],
        ['mucho-matxa', 2],
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

    return { copy, firstScroll, currentIndex, length, idToIndex, landingHeaderScale, nextPageTitleRef, isNextId, isPreviousId }
})