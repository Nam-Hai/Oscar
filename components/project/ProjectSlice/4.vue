<template>
    <div class="container-4" :style="{ backgroundImage: `url(${data.data.bg_src.src})` }">
        <div class="data-img" :data-src="data.data.src_1.src" ref="elRef1">
            <img :src="data.data.src_1.src" alt="project_image_4_1"
                v-if="isMobile && data.data.src_1.type === 'image'" />

            <video disablePictureInPicture v-if="isMobile && data.data.src_1.type[0] === 'v'" playsinline disableremoteplayback="true" muted
                loop autoplay>
                <source :src="data.data.src_1.src" :type="data.data.src_1.type">
            </video>
        </div>
        <div class="data-img" :data-src="data.data.src_2.src" ref="elRef2">
            <img :src="data.data.src_2.src" alt="project_image_4_2"
                v-if="isMobile && data.data.src_2.type === 'image'" />

            <video disablePictureInPicture v-if="isMobile && data.data.src_2.type[0] === 'v'" playsinline disableremoteplayback="true" muted
                loop autoplay>
                <source :src="data.data.src_3.src" :type="data.data.src_3.type">
            </video>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useProjectCanvas } from '~/scene/Pages/ProjectCanvas';
import { onFlow } from '~/waterflow/composables/onFlow';
const { data } = defineProps<{ data: ISlice }>()
const { isMobile } = useStore()

const projectCanvas = useProjectCanvas()

const elRef1 = ref()
const elRef2 = ref()

onFlow(async () => {
    await nextTick()
    if (isMobile.value) return
    projectCanvas.addMedia(elRef1.value, -0.03)
    projectCanvas.addMedia(elRef2.value, 0.08)
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.container-4 {
    position: relative;
    background-color: $placeholder-grey;

    margin: 22.4rem 0;
    width: 100vw;

    height: 180rem;
    background-size: cover;

    @include breakpoint(mobile) {
        margin: 8.8rem 0rem;
        width: 100vw;
        height: 86.2rem;
    }

    >div {
        position: absolute;

        &:first-child {
            left: 14.2rem;
            top: 33.1rem;
            width: 83.9rem;
            height: 60.1rem;

            @include breakpoint(mobile) {
                width: calc(100vw - 3.2rem);
                height: 24.6rem;
                top: 8rem;
                left: 1.6rem;
            }
        }

        &:nth-child(2) {
            right: 14.2rem;
            bottom: 33.1rem;
            width: 26.9rem;
            height: 89.8rem;

            @include breakpoint(mobile) {
                width: 13.2rem;
                height: 44rem;
                bottom: 8rem;
                right: 1.6rem;
            }
        }
    }
}

.data-img {
    margin: 0 auto;
    width: 83.7rem;
    height: 100.4rem;
    // background-color: $placeholder-grey-2;
}
</style>
