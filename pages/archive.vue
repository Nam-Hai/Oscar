<template>
    <div ref="wrapperRef" class="archive__wrapper">
        <div class="archive__grid">
            <div v-for="i in 50" :key="i">test</div>
        </div>
        <div class="archive__number">12</div>
    </div>
</template>

<script lang="ts" setup>
import { defaultFlowIn, defaultFlowOut } from '~/pages_transitions/default.transition';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

const store = useStore()

// const { client } = usePrismic()
// const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

useResetLenis()

const wrapperRef = ref() as Ref<HTMLElement>

usePageFlow({
    props: {wrapperRef},
    flowOut: defaultFlowOut,
    flowInCrossfade: defaultFlowIn,
    enableCrossfade: 'TOP'
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.archive__wrapper {

    min-height: 100vh;
    width: 100vw;
    background-color: $white;
    color: $black;
}

.archive__grid {
    position: relative;

    min-height: 100vh;
    min-width: 100vw;
    @include mainGrid;

    > div {
        height: 20rem;
        margin-bottom: 2rem;
        width: 100%;
        background-color: $placeholder-grey;
    }
}

.archive__number {
    position: fixed;
    bottom: 2.4rem;
    right: 2.4rem;
    text-align: right;
    font-size: 3.2rem;
    font-weight: 400;
    line-height: 90%;
    letter-spacing: -.032rem;
    text-transform: uppercase;
}
</style>

