<template>
    <div class="container-2">
        <div class="data-img" :data-src="data.src_1" ref="elRef1"></div>
        <div class="data-img" :data-src="data.src_2" ref="elRef2"></div>
    </div>
</template>

<script lang="ts" setup>
import { useProjectCanvas } from '~/scene/Pages/ProjectCanvas';
import { onFlow } from '~/waterflow/composables/onFlow';
const { data } = defineProps<{ data: { [key: string]: string } }>()

const projectCanvas = useProjectCanvas()

const elRef1 = ref()
const elRef2 = ref()

onFlow(async () => {
    await nextTick()
    projectCanvas.addMedia(elRef1.value)
    projectCanvas.addMedia(elRef2.value)
})
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.container-2 {
    margin: 1.6rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    div:first-child {
        width: 97.9rem;
        height: 120rem;

        @include breakpoint(mobile) {
            width: 20.2rem;
            height: 29.2rem;
        }
    }

    div:nth-child(2) {
        width: 32.2rem;
        height: 32.2rem;

        @include breakpoint(mobile) {
            width: 6.2rem;
            height: 6.2rem;
        }
    }

}

.data-img {
    // background-color: $placeholder-grey;
}
</style>

