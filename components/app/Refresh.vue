<template>
    <div ref="wrapperRef" class="refresh">
        <h1>404.</h1>
        <h2>Something broke</h2>
    </div>
</template>

<script lang="ts" setup>
// const {propName = fallbackValue} = defineProps<{propName: type}>()
// const emits = defineEmits([])

const store = useStore()

const wrapperRef = ref() as Ref<HTMLElement>

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;


.refresh {
    font-size: 2rem;
    line-height: 100%;
    text-transform: uppercase;
    padding: 2rem 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    text-transform: unset;
    // text-transform: capitalize;

    h1,
    h2 {
        font-weight: 100;
    }
}
</style>
