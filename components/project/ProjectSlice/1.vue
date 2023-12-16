<template>
    <div>
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

onFlow(() => {
    projectCanvas.addMedia(elRef1.value)
    projectCanvas.addMedia(elRef2.value)
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.data-img {
    width: 83.8rem;
    height: 48rem;
    margin: 22.4rem auto;
    // background-color: $placeholder-grey;
}
</style>

