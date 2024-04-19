<template>
    <div class="project-slice-E__wrapper">
        <div class="data-img" :data-src="data.data.src_1.src" ref="elRef1">
            <img :src="data.data.src_1.src" alt="project_image_E_1"
                v-if="isMobile && data.data.src_1.type === 'image'" />

            <video disablePictureInPicture v-if="isMobile && data.data.src_1.type[0] === 'v'" playsinline disableremoteplayback="true" muted
                loop autoplay>
                <source :src="data.data.src_1.src" :type="data.data.src_1.type">
            </video>

        </div>

        <div class="data-img" :data-src="data.data.src_2.src" ref="elRef2">
            <img :src="data.data.src_2.src" alt="project_image_E_2"
                v-if="isMobile && data.data.src_2.type === 'image'" />

            <video disablePictureInPicture v-if="isMobile && data.data.src_2.type[0] === 'v'" playsinline disableremoteplayback="true" muted
                loop autoplay>
                <source :src="data.data.src_2.src" :type="data.data.src_2.type">
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

    projectCanvas.addMedia(elRef1.value)
    projectCanvas.addMedia(elRef2.value)
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.project-slice-E__wrapper {
    width: 85.4rem;

    display: flex;
    justify-content: space-between;

    margin: 28rem auto;

    @include breakpoint(mobile) {
        column-gap: $side-margin;
        margin: 4.8rem 1.6rem;
        height: 34.16rem;
        width: calc(100% - 3.2rem);
    }
}

.data-img {
    height: 100%;
    width: 27.7rem;

    @include breakpoint(mobile) {
        width: unset;
        flex-grow: 1;

        img,
        video {
            border-radius: 4px;
        }
    }
}
</style>
