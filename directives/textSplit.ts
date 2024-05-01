
export const vTextSplit = {
    mounted: (el: HTMLElement, binding: {}) => {
        const { index: indexSplit } = useStoreTextSplit()
        const _index = indexSplit.value
        console.log(_index);
        const initialText = el.innerText
        const words = initialText.split(" ")
        el.innerText = ""
        const spans = words.map(word => {
            const span = N.Cr("span")
            span.innerText = word + " "
            N.O(span, 0)
            el.appendChild(span)
            return span
        })

        const tl = useTL()
        for (let index = 0; index < spans.length; index++) {
            const span = spans[index]
            tl.from({
                el: span,
                p: {
                    o: [0, 1]
                },
                d: 500,
                delay: 300 + (index + _index) * 10
            })
        }
        tl.play()
        indexSplit.value += spans.length
    }
}