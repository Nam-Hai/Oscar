<template>
    <div class="container-3">
        <div class="t-c">
            <div class="data-img" :data-src="data.data.src_1.src" ref="elRef1">
                <img :src="data.data.src_1.src" alt="project_image_3_1"
                    v-if="isMobile && data.data.src_1.type === 'image'" />

                <video disablePictureInPicture v-if="isMobile && data.data.src_1.type[0] === 'v'"  playsinline disableremoteplayback="true" muted
                    loop autoplay>
                    <source :src="data.data.src_1.src" :type="data.data.src_1.type">
                </video>

            </div>

            <div class="data-img" :data-src="data.data.src_2.src" ref="elRef2">
                <img :src="data.data.src_2.src" alt="project_image_3_2"
                    v-if="isMobile && data.data.src_2.type === 'image'" />

                <video disablePictureInPicture v-if="isMobile && data.data.src_2.type[0] === 'v'" playsinline disableremoteplayback="true" muted
                    loop autoplay>
                    <source :src="data.data.src_2.src" :type="data.data.src_2.type">
                </video>

            </div>
        </div>
        <div class="data-img" :data-src="data.data.src_3.src" ref="elRef3">
            <img :src="data.data.src_3.src" alt="project_image_3_3"
                v-if="isMobile && data.data.src_3.type === 'image'" />

            <video disablePictureInPicture v-if="isMobile && data.data.src_3.type[0] === 'v'" playsinline disableremoteplayback="true" muted
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
const elRef3 = ref()

onFlow(async () => {
    await nextTick()
    if(isMobile.value) return
    projectCanvas.addMedia(elRef1.value, -0.2)
    projectCanvas.addMedia(elRef2.value, 0.1)
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
