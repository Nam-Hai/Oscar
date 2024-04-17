<template>
    <div class="project-slice-F__wrapper">
        <div class="data-img" :data-src="data.data.src_1.src" ref="elRef1">
            <img :src="data.data.src_1.src" alt="project_image_A_1"
                v-if="isMobile && data.data.src_1.type === 'image'" />

            <video v-if="isMobile && data.data.src_1.type[0] === 'v'" playsinline disableremoteplayback="true" muted
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

.project-slice-F__wrapper {
    width: 100%;
    height: 120rem;

    margin: 28rem auto;

    @include breakpoint(mobile) {
        margin: 4.8rem auto;
        height: 48rem;
    }
}

.data-img {
    height: 100%;
    width: 100%;
    img, video {
        object-fit: cover;
    }
}
</style>
