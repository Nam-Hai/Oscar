<template>
    <main ref="mainRef">
        <h1>Viadomo©DECO</h1>

        <div class="flavor">
            <div class="flavor-main">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, exercitationem
            </div>
            <div class="flavor-sub">
                <div>Type</div>
                <div>Field</div>
                <div>Date</div>
            </div>
        </div>

        <Stepper />
    </main>
</template>

<script lang="ts" setup>
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { defaultFlowIn, defaultFlowOut } from './default.transition';

const mainRef = ref()

useResetLenis({
    infinite: false,
    direction: "vertical"
})


usePageFlow({
    props: {},
    flowOut: defaultFlowOut,
    flowInCrossfade: defaultFlowIn,
    enableCrossfade: 'BOTTOM'
})

const { onHold } = useCursorStore()

onHold(mainRef, ()=>{

})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

main {
    height: 100vh;
    width: 100vw;
    top: 0;
    // background-color: black;
    color: $white;
}

.flavor {
    position: absolute;
    top: calc(50% + 3rem + 2.4rem);
    left: calc(50% + 2rem);
    font-size: 1.3rem;
    line-height: 100%;

    .flavor-main {
        margin-bottom: 3.6rem;
        width: 35rem;
    }

    .flavor-sub {
        display: flex;
        flex-direction: column;
        row-gap: 0.8rem;
    }
}

h1 {
    text-transform: uppercase;
    text-align: center;
    font-size: 8.8rem;
    font-weight: 500;
    line-height: 0;
    letter-spacing: -0.088rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>