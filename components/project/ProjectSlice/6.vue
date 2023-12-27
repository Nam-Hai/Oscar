<template>
    <div class="container-6">
        <div class="c-62">
            <div class="data-img" :data-src="data.src_1" ref="elRef1"></div>
            <div class="data-img" :data-src="data.src_2" ref="elRef2"></div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { useProjectCanvas } from '~/scene/Pages/ProjectCanvas';
import { onFlow } from '~/waterflow/composables/onFlow';
const { data } = defineProps<{ data: { [key: string]: string } }>()

const projectCanvas = useProjectCanvas()

const elRef1 = ref()
const elRef2 = ref()

onFlow(async () => {
    await nextTick()
    projectCanvas.addMedia(elRef1.value)
    projectCanvas.addMedia(elRef2.value)
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.container-6 {
    position: relative;
    width: 100%;
    margin: 22.4rem 0;

    @include breakpoint(mobile) {
        margin: 8.8rem 0;
    }

    .c-62 {
        width: 100%;
        position: relative;
        padding: 0 16.2rem;
        display: flex;
        flex-direction: column;

        @include breakpoint(mobile) {
            padding: 0 1.6rem;
        }

        .data-img:first-child {
            width: 40.9rem;
            height: 40.9rem;

            @include breakpoint(mobile) {
                width: 13.2rem;
                height: 13.6rem;
            }
        }

        .data-img:nth-child(2) {
            margin-top: 22.4rem;
            width: 69.27rem;
            height: 57.5rem;

            align-self: flex-end;

            @include breakpoint(mobile) {
                margin-top: 6.4rem;
                width: 20.1rem;
                height: 15.6rem;
            }
        }
    }
}

.data-img {
    background-color: $placeholder-grey;
}
</style>

