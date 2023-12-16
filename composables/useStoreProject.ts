export interface ISlice {
    keyId: string,
    data: { [key: string]: any }
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
                keyId: "ProjectSlice1",
                data: {
                    src_1: "/Assets/Viadomo/2.png",
                    src_2: "/Assets/Viadomo/3.png",
                }
            },
            {
                keyId: "ProjectSlice2",
                data: {
                    src_1: "/Assets/Viadomo/4.png",
                    src_2: "/Assets/Viadomo/5.png",
                }
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
        slice: []
    },
    "mucho-matxa": {
        title: 'mucho matxa',
        type: "Fourniture",
        date: "03.2023",
        main_image: {
            src_1: "/Assets/Home3.png",
            src_2: "/Assets/Viadomo/8.png",
        },
        slice: []
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


    return { copy, firstScroll, currentIndex, length, idToIndex, landingHeaderScale }
})