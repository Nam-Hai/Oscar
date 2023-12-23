<template>
    <div>
        <div class="data-img" :data-src="data.src_1"></div>
    </div>
</template>

<script lang="ts" setup>
import { useProjectCanvas } from '~/scene/Pages/ProjectCanvas';
import { onFlow } from '~/waterflow/composables/onFlow';
const { data } = defineProps<{ data: { [key: string]: string } }>()

const projectCanvas = useProjectCanvas()

const elRef1 = ref()

onFlow(async () => {
    await nextTick()
    projectCanvas.addMedia(elRef1.value)
})
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.data-img {
    width: 83.8rem;
    height: 48rem;
    margin: 22.4rem auto 48rem;
    background-color: $placeholder-grey;
}
</style>

