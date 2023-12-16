<template>
    <div class="container-6">
        <div class="data-img" :data-src="data.src_1"></div>

        <div class="c-62">
            <div class="data-img" :data-src="data.src_2"></div>
            <div class="data-img" :data-src="data.src_3"></div>

        </div>
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

onFlow(() => {
    projectCanvas.addMedia(elRef1.value)
    projectCanvas.addMedia(elRef2.value)
    projectCanvas.addMedia(elRef3.value)
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.container-6 {
    position: relative;
    width: 100%;
    background-color: $placeholder-grey;

    padding: 20rem 0;

    >.data-img:first-child {
        margin: 0 auto;
        width: 83.7rem;
        height: 47.9rem;
    }

    .c-62 {
        height: 75rem;
        width: 112.3rem;
        position: relative;
        margin: 16rem auto 0;

        .data-img:first-child {
            position: absolute;
            top: 0;
            right: 0;
            width: 40.9rem;
            height: 40.9rem;
        }

        .data-img:nth-child(2) {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 26.9rem;
            height: 54.5rem;
        }
    }
}

.data-img {
    background-color: $placeholder-grey-2;
}
</style>

