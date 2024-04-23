<template>
    <div class="project-slice-D">
        <div class="data-img" :data-src="data.data.src_1.src" ref="elRef1">
            <img :src="data.data.src_1.src" alt="project_image_D_1"
                v-if="isMobile && data.data.src_1.type === 'image'" />

            <video disablePictureInPicture v-if="isMobile && data.data.src_1.type[0] === 'v'" playsinline disableremoteplayback="true" muted
                loop autoplay>
                <source :src="data.data.src_1.src" :type="data.data.src_1.type">
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

onFlow(async () => {
    await nextTick()
    if (isMobile.value) return

    projectCanvas.addMedia(elRef1.value)
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.project-slice-D {
    margin: 28rem auto;

    @include breakpoint(mobile) {
        margin: 4.8rem auto;
    }
    display: flex;
    justify-content: center;
    align-items: center;

}

.data-img {
    width: 82.6rem;
    height: 47.4rem;

    @include breakpoint(mobile) {
        width: calc(100% - 2 * $side-margin);
        height: unset;
        aspect-ratio: 343 / 196;
        img, video {
            border-radius: 2px;
        }
    }
}
</style>
