export const useStoreTextSplit = createStore(() => {
    const index = ref(0)
    function reset() {
        index.value = 0
    }
    return {
        index,
        reset
    }
})