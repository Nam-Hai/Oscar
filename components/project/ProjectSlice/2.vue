<template>
    <div class="container-2">
        2
        <div class="data-img" :data-src="data.data.src_1.src" ref="elRef1">
            <img :src="data.data.src_1.src" alt="project_image_2_1"
                v-if="isMobile && data.data.src_1.type === 'image'" />

            <video v-if="isMobile && data.data.src_1.type[0] === 'v'" playsinline disableremoteplayback="true" muted
                loop autoplay>
                <source :src="data.data.src_1.src" :type="data.data.src_1.type">
            </video>

        </div>
        <div class="data-img" :data-src="data.data.src_2.src" ref="elRef2">
            <img :src="data.data.src_2.src" alt="project_image_2_2"
                v-if="isMobile && data.data.src_2.type === 'image'" />

            <video v-if="isMobile && data.data.src_2.type[0] === 'v'" playsinline disableremoteplayback="true" muted
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
    projectCanvas.addMedia(elRef2.value, 0.3)
})
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.container-2 {
    margin: 1.6rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    div:first-child {
        width: 97.9rem;
        height: 120rem;

        @include breakpoint(mobile) {
            width: 20.2rem;
            height: 29.2rem;
        }
    }

    div:nth-child(2) {
        width: 32.2rem;
        height: 32.2rem;

        @include breakpoint(mobile) {
            width: 6.2rem;
            height: 6.2rem;
        }
    }

}

.data-img {
    // background-color: $placeholder-grey;
}
</style>
