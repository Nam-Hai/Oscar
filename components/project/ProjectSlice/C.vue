<template>
    <div class="container-C">
        <div class="data-img" :data-src="data.data.src_1.src" ref="elRef1">
            <img :src="data.data.src_1.src" alt="project_image_C_1"
                v-if="isMobile && data.data.src_1.type === 'image'" />

            <video v-if="isMobile && data.data.src_1.type[0] === 'v'" playsinline disableremoteplayback="true" muted
                loop autoplay>
                <source :src="data.data.src_1.src" :type="data.data.src_1.type">
            </video>

        </div>
        <div class="data-img" :data-src="data.data.src_2.src" ref="elRef2">
            <img :src="data.data.src_2.src" alt="project_image_C_2"
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

.container-C {
    width: 100%;
    height: 92rem;
    padding-left: $side-margin;
    padding-right: $side-margin;

    display: flex;
    column-gap: $side-margin;

    margin: 28rem auto;

    @include breakpoint(mobile) {
        flex-direction: column;
        height: 42rem;
        margin: 4.8rem auto;
    }


    div:first-child {
        height: 100%;
        flex-grow: 1;

        @include breakpoint(mobile) {
            width: 30rem;
            height: 100%;
        }
    }

    div:nth-child(2) {
        width: 55.5rem;
        height: 100%;
    }

}

.data-img {
    // background-color: $placeholder-grey;
}
</style>
