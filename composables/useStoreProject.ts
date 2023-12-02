type ProjectCopyType = {
    title: string,
    type: string,
    date: string,
}
const projectCopy: { [key: string]: ProjectCopyType } = {
    "viadomo-deco": {
        title: 'VIADOMO©DECO',
        type: "Fourniture",
        date: "03.2023"

    },
    "avant-garden": {
        title: 'Avant garden',
        type: "Fourniture",
        date: "03.2023"
    },
    "mucho-matxa": {
        title: 'c',
        type: "Fourniture",
        date: "03.2023"
    }

}

export const useStoreProject = createStore(() => {
    const copy = projectCopy
    const firstScroll = ref(false)

    return { copy, firstScroll }
})