<template>
    <div ref="wrapperRef" class="stepper-mobile__wrapper" :data-current="currentIndex">

        <div class="project-display__wrapper" v-for="(data, index) in homeStore" :class="{ current: currentIndex == index }"
            ref="stepperRef">
            <img :src="data.mini" :alt="`home_mini-${data.title}`" @click="currentIndex = index">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onFlow } from '~/waterflow/composables/onFlow';

const { homeStore, currentIndex } = useStoreStepper()

const wrapperRef = ref() as Ref<HTMLElement>
const stepperRef = ref() as Ref<HTMLElement[]>
onFlow(() => {
    const tl = useTL()
    for (let i = 0; i < stepperRef.value.length; i++) {
        const el = stepperRef.value[i]
        tl.from({
            el,
            p: {
                y: [200, 0]
            },
            d: 2000,
            delay: i * 100,
            e: 'io4'
        })
    }
    tl.play()
})
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.stepper-mobile__wrapper {
    position: absolute;
    bottom: 1.6rem;
    display: flex;
    column-gap: 1.2rem;
    justify-content: center;
    left: 1.6rem;
    width: calc(100% - 3.2rem);

    .project-display__wrapper {

        transform: translateY(200%);
        &.current {
            img {
                opacity: 0;
            }


        }

        height: 4.4rem;

        img {
            height: 100%;
            border-radius: 2px;
            position: relative;
            z-index: 2;

            transition: opacity 300ms;
        }

        position: relative;

        &:nth-child(4)::after {
            content: "";
            display: block;
            position: absolute;
            height: 100%;
            width: 100%;
            border: 1px solid $yellow;
            border-radius: 2px;
            top: 0;
            left: 0;

            transition: transform $easeOutQuart 500ms;
            z-index: 20;
        }
    }

    &[data-current="0"] {
        .project-display__wrapper:nth-child(4)::after {
            transform: translateX(calc(-300% - 3 * 1.2rem));
        }
    }

    &[data-current="1"] {
        .project-display__wrapper:nth-child(4)::after {
            transform: translateX(calc(-200% - 2 * 1.2rem));
        }
    }

    &[data-current="2"] {
        .project-display__wrapper:nth-child(4)::after {
            transform: translateX(calc(-100% - 1 * 1.2rem));
        }
    }
    &[data-current="3"] {
        .project-display__wrapper:nth-child(4)::after {
            transform: translateX(0);
        }
    }
}
</style>
