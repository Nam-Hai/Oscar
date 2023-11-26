<template>
    <main ref="mainRef">
        <h1>{{ homeStore[currentIndex].title }}</h1>

        <div class="flavor">
            <div class="flavor-main">
                {{ homeStore[currentIndex].flavorMain }}
            </div>
            <div class="flavor-sub">
                <div v-for="text in homeStore[currentIndex].flavorSub">{{ text }}</div>
            </div>
        </div>

        <Stepper />
    </main>
</template>

<script lang="ts" setup>
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { defaultFlowIn, defaultFlowOut } from './default.transition';

const mainRef = ref()
const { homeStore, currentIndex } = useStoreStepper()

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

onHold(mainRef, () => {

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

    .flavor-main {
        margin-bottom: 3.6rem;
        width: 35rem;
        line-height: 1.6rem;
    }

    .flavor-sub {
        display: flex;
        flex-direction: column;
        row-gap: 0.8rem;
        position: relative;
        top: 0.45rem;

        >div {
            line-height: 0;
            height: 0.9rem;
            top: 0;
        }
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