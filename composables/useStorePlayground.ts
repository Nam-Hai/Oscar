const PLAYGROUND_COPY = [
    {
        src: "/Assets/Playground/playground_1.webp",
        ratio: 232 / 323,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Playground/playground_2.webp",
        ratio: 1 / 1,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Playground/playground_3.webp",
        ratio: 2181 / 1394,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Playground/playground_4.webp",
        ratio: 1 / 1,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Playground/playground_5.webp",
        ratio: 1856 / 2584,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Playground/playground_6.webp",
        ratio: 2181 / 1394,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Playground/playground_7.webp",
        ratio: 1 / 1,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Playground/playground_8.webp",
        ratio: 2181 / 1394,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Playground/playground_9.webp",
        ratio: 1856 / 2584,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Playground/playground_10.webp",
        ratio: 2181 / 1394,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Playground/playground_11.webp",
        ratio: 1 / 1,
        height: "78.8rem",
        width: "59.4rem"
    },
    {
        src: "/Assets/Playground/playground_12.webp",
        ratio: 1856 / 2584,
        height: "78.8rem",
        width: "59.4rem"
    },
]
export const useStorePlayground = createStore(() => {
    const copy = [...PLAYGROUND_COPY]
    const containerHeight = ref(1)

    const showMore = ref(-1)
    const index = ref(-1)

    return { copy, containerHeight, showMore, index }
})