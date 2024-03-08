<template>
    <div class="container-5">
        <div class="c-53">
            <div class="data-img" :data-src="data.data.src_1.src" ref="elRef1">
                <img :src="data.data.src_1.src" alt="project_image_5_1"
                    v-if="isMobile && data.data.src_1.type === 'image'" />

                <video v-if="isMobile && data.data.src_1.type[0] === 'v'" playsinline disableremoteplayback="true" muted
                    loop autoplay>
                    <source :src="data.data.src_1.src" :type="data.data.src_1.type">
                </video>
            </div>
            <div class="data-img" :data-src="data.data.src_2.src" ref="elRef2">
                <img :src="data.data.src_2.src" alt="project_image_5_2"
                    v-if="isMobile && data.data.src_2.type === 'image'" />

                <video v-if="isMobile && data.data.src_2.type[0] === 'v'" playsinline disableremoteplayback="true" muted
                    loop autoplay>
                    <source :src="data.data.src_2.src" :type="data.data.src_2.type">
                </video>
            </div>
            <div class="data-img" :data-src="data.data.src_3.src" ref="elRef3">
                <img :src="data.data.src_3.src" alt="project_image_5_3"
                    v-if="isMobile && data.data.src_3.type === 'image'" />

                <video v-if="isMobile && data.data.src_3.type[0] === 'v'" playsinline disableremoteplayback="true" muted
                    loop autoplay>
                    <source :src="data.data.src_3.src" :type="data.data.src_3.type">
                </video>
            </div>
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
    if (isMobile.value) return
    projectCanvas.addMedia(elRef1.value)
    projectCanvas.addMedia(elRef2.value, 0.1)
    projectCanvas.addMedia(elRef3.value, 0.2)
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

        @include breakpoint(mobile) {
            flex-wrap: wrap;
            padding: 0 1.6rem;
        }

        .data-img:nth-child(2) {
            margin-top: 27.3rem;

            @include breakpoint(mobile) {
                margin-top: 17.8rem;
            }
        }

        .data-img:nth-child(3) {
            margin-top: 57.8rem;

            @include breakpoint(mobile) {
                margin-top: -10.8rem;
            }
        }
    }

    margin: 22.4rem auto;

    @include breakpoint(mobile) {
        margin: 8.8rem auto;
    }
}

.data-img {
    width: 26.9rem;
    height: 54.5rem;
    // background-color: $placeholder-grey;

    @include breakpoint(mobile) {
        width: 13.2rem;
        height: 26.7rem;
    }
}
</style>
