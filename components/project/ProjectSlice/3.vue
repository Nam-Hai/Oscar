<template>
    <div class="container-3">
        <div class="t-c">
            <div class="data-img" :data-src="data.src_1" ref="elRef1"></div>
            <div class="data-img" :data-src="data.src_2" ref="elRef2"></div>
            <div class="data-img" :data-src="data.src_3" ref="elRef3"></div>
        </div>
        <div class="data-img" :data-src="data.src_4" ref="elRef4"></div>
    </div>
</template>

<script lang="ts" setup>

import { useProjectCanvas } from '~/scene/Pages/ProjectCanvas';
import { onFlow } from '~/waterflow/composables/onFlow';
const { data } = defineProps<{ data: { [key: string]: string } }>()

const projectCanvas = useProjectCanvas()

const elRef1 = ref()
const elRef2 = ref()
const elRef3 = ref()
const elRef4 = ref()

onFlow(() => {
    projectCanvas.addMedia(elRef1.value)
    projectCanvas.addMedia(elRef2.value)
    projectCanvas.addMedia(elRef3.value)
    projectCanvas.addMedia(elRef4.value)
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.container-3 {
    >div {
        margin: 22.4rem auto;
    }

    .t-c {
        display: flex;
        column-gap: 15.85rem;
        justify-content: center;

        div {
            width: 26.9rem;
            height: 54.5rem;
        }
    }


    >.data-img {
        width: 83.8rem;
        height: 48rem;
    }
}

.data-img {
    background-color: $placeholder-grey;
}
</style>

