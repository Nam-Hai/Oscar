<template>
    <div class="container-5">
        <div class="c-53">
            <div class="data-img" :data-src="data.src_1" ref="elRef1"></div>
            <div class="data-img" :data-src="data.src_2" ref="elRef2"></div>
            <div class="data-img" :data-src="data.src_3" ref="elRef3"></div>
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

onFlow(async () => {
    await nextTick()
    projectCanvas.addMedia(elRef1.value)
    projectCanvas.addMedia(elRef2.value)
    projectCanvas.addMedia(elRef3.value)
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.container-5 {
    position: relative;
    width: 100%;

    .c-53 {
        width: 100%;
        display: flex;
        
        padding: 0 16.2rem;
        justify-content: space-between;
        
        .data-img:nth-child(2) {
            margin-top: 27.3rem;
        }
        .data-img:nth-child(3) {
            margin-top: 57.8rem;
        }
    }

    margin: 22.4rem auto;
}

.data-img {
    width: 26.9rem;
    height: 54.5rem;
    // background-color: $placeholder-grey;
}
</style>

