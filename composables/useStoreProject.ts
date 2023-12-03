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
        slice: []
    },
    "avant-garden": {
        title: 'Avant garden',
        type: "Fourniture",
        date: "03.2023",
        main_image: {
            src_1: "/Assets/Home_2.jpg",
            src_2: "/Assets/Viadomo/1.jpg",
        },
        slice: []
    },
    "mucho-matxa": {
        title: 'c',
        type: "Fourniture",
        date: "03.2023",
        main_image: {
            src_1: "/Assets/Home3.png",
            src_2: "/Assets/Viadomo/1.jpg",
        },
        slice: []
    }

}

export const useStoreProject = createStore(() => {
    const copy = projectCopy
    const firstScroll = ref(false)

    const currentIndex = ref(0)

    return { copy, firstScroll, currentIndex }
})