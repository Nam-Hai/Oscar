export type ArchiveCopyType = {
    src: string,
    imageDirection?: "vertical" | "horizontal"
    text: {
        title: string,
        category: string,
        source: string
    }
    bounds: { [key: string]: string }
}
const ARCHIVE_COPY: ArchiveCopyType[] = [
    {
        // src: "/Assets/info/Oscar_Pico.png",
        src: "/Assets/Home1.png",
        imageDirection: "horizontal",
        text: {
            title: "Title",
            category: "Category",
            source: "img source"
        },
        bounds: {
            "margin-top": "0rem",
            "margin-left": "72.8rem",
            width: "27rem",
            height: "36.3rem"
        }
    },
    {
        src: "/Assets/info/Oscar_Pico.png",
        text: {
            title: "Title",
            category: "Category",
            source: "img source"
        },
        bounds: {
            width: "26.8rem",
            height: "17.1rem",
            "margin-top": "20.8rem",
            "margin-left": "15.9rem"
        }
    },
    {
        src: "/Assets/info/Oscar_Pico.png",
        text: {
            title: "Title",
            category: "Category",
            source: "img source"
        },
        bounds: {
            width: "26.8rem",
            height: "27.6rem",
            "margin-top": "36.7rem",
            "margin-left": "58.6rem"
        }
    },
    {
        src: "/Assets/info/Oscar_Pico.png",
        text: {
            title: "Title",
            category: "Category",
            source: "img source"
        },
        bounds: {
            width: "26.8rem",
            height: "30.9rem",
            "margin-top": "28.1rem",
            "margin-left": "115rem"
        }
    },
    {
        src: "/Assets/info/Oscar_Pico.png",
        text: {
            title: "Title",
            category: "Category",
            source: "img source"
        },
        bounds: {
            height: "17.7rem",
            width: "12.6rem",
            "margin-top": "-13.1rem",
            "margin-left": "30rem"
        }
    },
    {
        src: "/Assets/info/Oscar_Pico.png",
        text: {
            title: "Title",
            category: "Category",
            source: "img source"
        },
        bounds: {
            height: "17.1rem",
            width: "26.8rem",
            "margin-top": "45.3rem",
            "margin-left": "72.9rem"
        }
    },
    {
        src: "/Assets/info/Oscar_Pico.png",
        text: {
            title: "Title",
            category: "Category",
            source: "img source"
        },
        bounds: {
            height: "36.3rem",
            width: "27.3rem",
            "margin-top": "28.2rem",
            "margin-left": "2.4rem"
        }
    },
    {
        src: "/Assets/info/Oscar_Pico.png",
        text: {
            title: "Title",
            category: "Category",
            source: "img source"
        },
        bounds: {
            height: "12.6rem",
            width: "17.7rem",
            "margin-top": "22.7rem",
            "margin-left": "115.5rem"
        }
    },
    {
        src: "/Assets/info/Oscar_Pico.png",
        text: {
            title: "Title",
            category: "Category",
            source: "img source"
        },
        bounds: {
            height: "27.6rem",
            width: "26.8rem",
            "margin-top": "35.3rem",
            "margin-left": "30rem"
        }
    },
]

export const useStoreArchive = createStore(() => {
    const COPY = ARCHIVE_COPY
    const currentIndexDisplay = ref(`${N.ZL(COPY.length)}`)


    const emptyCopy = {
        src: "",
        text: {
            title: "",
            category: "",
            source: ""
        },
        bounds: {
        }
    }

    const hoverIndex: Ref<number | null> = ref(null)
    const hoverCopy: Ref<ArchiveCopyType> = ref(emptyCopy)
    function setHoverCopy(index: number | null) {
        hoverIndex.value = index
        if (index == null) {
            hoverCopy.value = emptyCopy
            isHover.value = false
            // currentIndexDisplay.value = `${N.ZL(COPY.length)}`
            return
        }
        hoverCopy.value = COPY[index]
        isHover.value = true
        currentIndexDisplay.value = `${N.ZL(index + 1)}`
    }
    const isHover = ref(false)

    return { COPY, hoverCopy, setHoverCopy, isHover, hoverIndex, currentIndexDisplay }
})