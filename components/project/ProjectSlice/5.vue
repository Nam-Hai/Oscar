<template>
    <div class="container-5">
        <div class="data-img" data-src="/Assets/Viadomo/10.png" ref="elRef1"></div>
        <div class="c-52">
            <div class="data-img" data-src="/Assets/Viadomo/11.png" ref="elRef2"></div>
            <div class="data-img" data-src="/Assets/Viadomo/12.png" ref="elRef3"></div>
        </div>
        <div class="data-img" data-src="/Assets/Viadomo/13.png" ref="elRef4"></div>
    </div>
</template>

<script lang="ts" setup>

import { useProjectCanvas } from '~/scene/Pages/ProjectCanvas';

const projectCanvas = useProjectCanvas()

const elRef1 = ref()
const elRef2 = ref()
const elRef3 = ref()
const elRef4 = ref()

onMounted(() => {
    projectCanvas.addMedia(elRef1.value)
    projectCanvas.addMedia(elRef2.value)
    projectCanvas.addMedia(elRef3.value)
    projectCanvas.addMedia(elRef4.value)
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.container-5 {
    position: relative;
    width: 100%;

    .data-img:first-child {
        width: 83.8rem;
        height: 48rem;
    }

    .c-52 {
        width: 112.27rem;
        height: 125rem;

        .data-img:first-child {
            width: 40.9rem;
            height: 40.9rem;
        }

        .data-img:nth-child(2) {
            margin-top: 26.6rem;
            margin-left: auto;
            width: 69.272rem;
            height: 57.5rem;
        }
    }

    .data-img:nth-child(3) {
        width: 83.7rem;
        height: 100.4rem;
    }

    >div {
        margin: 22.4rem auto;
    }
}

.data-img {
    // background-color: $placeholder-grey;
}
</style>

