<template>
    <div class="container-3">
        <div class="t-c">
            <div class="data-img" :data-src="data.src_1" ref="elRef1"></div>
            <div class="data-img" :data-src="data.src_2" ref="elRef2"></div>
        </div>
        <div class="data-img" :data-src="data.src_3" ref="elRef3"></div>
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

.container-3 {
    >div {
        margin: 22.4rem auto;
        width: 83.8rem;

        @include breakpoint(mobile) {
            width: 34.3rem;
            margin: 8.8rem auto;
        }
    }

    .t-c {
        display: flex;
        justify-content: space-between;

        height: 81.8rem;

        @include breakpoint(mobile) {
            height: 26.7rem;
        }


        div {
            width: 26.9rem;
            height: 54.5rem;

            @include breakpoint(mobile) {
                height: 26.7rem;
                width: 13.2rem;
            }

            &:nth-child(2) {
                margin-top: auto;
            }
        }
    }


    >.data-img {
        width: 83.8rem;
        height: 48rem;

        @include breakpoint(mobile) {
            width: 34.3rem;
            height: 19.4rem;
        }
    }
}

.data-img {
    background-color: $placeholder-grey;
}
</style>

