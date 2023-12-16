<template>
    <div>
        <div class="data-img" data-src="/Assets/Viadomo/2.png" ref="elRef1"></div>
        <div class="data-img" data-src="/Assets/Viadomo/3.png" ref="elRef2"></div>
    </div>
</template>

<script lang="ts" setup>
import { useProjectCanvas } from '~/scene/Pages/ProjectCanvas';


const projectCanvas = useProjectCanvas()

const elRef1 = ref()
const elRef2 = ref()

onMounted(() => {
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

