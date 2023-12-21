const { toggleHover } = useCursorStore()
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