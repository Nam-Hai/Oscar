const PLAYGROUND_COPY = [
    {
        src: "/Assets/Home/01_Home_Viadomo.webp",
        ratio: 144 / 82,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/info/Oscar_Pico.png",
        ratio: 553 / 632,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Home/01_Home_Viadomo.webp",
        ratio: 144 / 82,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Home/01_Home_Viadomo.webp",
        ratio: 144 / 82,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Home/01_Home_Viadomo.webp",
        ratio: 144 / 82,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Home/01_Home_Viadomo.webp",
        ratio: 144 / 82,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Home/01_Home_Viadomo.webp",
        ratio: 144 / 82,
        height: "78.8rem",
        width: "59.4rem"
    },
]
export const useStorePlayground = createStore(() => {
    const copy = [...PLAYGROUND_COPY, ...PLAYGROUND_COPY]
    const containerHeight = ref(1)

    const showMore = ref(-1)

    return { copy, containerHeight, showMore }
})