<template>
    <div class="container-4">
        <div class="data-img" :data-src="data.src_1" ref="elRef1"></div>
    </div>
</template>

<script lang="ts" setup>
import { useProjectCanvas } from '~/scene/Pages/ProjectCanvas';
import { onFlow } from '~/waterflow/composables/onFlow';
const { data } = defineProps<{ data: { [key: string]: string } }>()

const projectCanvas = useProjectCanvas()

const elRef1 = ref()

onFlow(() => {
    projectCanvas.addMedia(elRef1.value)
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.container-4 {
    position: relative;
    width: 100%;
    background-color: $placeholder-grey;

    // display: flex;
    // align-items: center;
    // justify-content: center;
    padding: 25rem 0;
}

.data-img {
    margin: 0 auto;
    width: 83.7rem;
    height: 100.4rem;
    // background-color: $placeholder-grey-2;
}
</style>

