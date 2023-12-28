<template>
    <div ref="wrapperRef" class="stepper-mobile__wrapper" :data-current="currentIndex">

        <div class="project-display__wrapper" v-for="(data, index) in homeStore"
            :class="{ current: currentIndex == index }">
            <img :src="data.mini" :alt="`home_mini-${data.title}`" @click="currentIndex = index">
        </div>
    </div>
</template>

<script lang="ts" setup>
// const {propName = fallbackValue} = defineProps<{propName: type}>()
// const emits = defineEmits([])

const { homeStore, currentIndex } = useStoreStepper()

const wrapperRef = ref() as Ref<HTMLElement>

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

        &:first-child::after {
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

    &[data-current="1"] {
        .project-display__wrapper:first-child::after {
            transform: translateX(calc(100% + 1.2rem));
        }
    }

    &[data-current="2"] {
        .project-display__wrapper:first-child::after {
            transform: translateX(calc(200% + 2 * 1.2rem));
        }
    }
}
</style>
