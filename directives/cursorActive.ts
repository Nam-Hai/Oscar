const { toggleHover, homeHover } = useCursorStore()
export const vCursorHover = {
    mounted: (el: HTMLElement) => {
        el.addEventListener("mouseenter", () => {
            toggleHover(true)
        })
        el.addEventListener("mouseleave", () => toggleHover(false))
    },
    beforeUnmount: (el: HTMLElement) => {
        el.removeEventListener("mouseenter", () => toggleHover(true))
        el.removeEventListener("mouseleave", () => toggleHover(false))
    }
}
export const vCursorHoverHome = {
    mounted: (el: HTMLElement) => {
        el.addEventListener("mouseenter", () => {
            homeHover(true)
        })
        el.addEventListener("mouseleave", () => homeHover(false))
    },
    beforeUnmount: (el: HTMLElement) => {
        el.removeEventListener("mouseenter", () => homeHover(true))
        el.removeEventListener("mouseleave", () => homeHover(false))
    }
}