const PLAYGROUND_COPY = [
    {
        src: "/Assets/Home/1.jpg",
        ratio: "144 / 82"
    },
    {
        src: "/Assets/info/Oscar_Pico.png",
        ratio: "553 / 632"
    },
    {
        src: "/Assets/Home/1.jpg",
        ratio: "144 / 82"
    },
    {
        src: "/Assets/Home/2.jpg",
        ratio: "144 / 82"
    },
    {
        src: "/Assets/Home/3.jpg",
        ratio: "144 / 82"
    },
    {
        src: "/Assets/Home/4.jpg",
        ratio: "144 / 82"
    },
    {
        src: "/Assets/Home/1.jpg",
        ratio: "144 / 82"
    },
]
export const useStorePlayground = createStore(() => {
    const copy = [...PLAYGROUND_COPY, ...PLAYGROUND_COPY]

    return { copy }
})