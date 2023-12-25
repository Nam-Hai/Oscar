<template>
    <div ref="wrapperRef" class="archive-media__wrapper">
        <img :src="data.src" :alt="`archive-img-${N.ZL(index + 1)}`">

        <div class="alt__wrapper">
            <div class="index">{{ N.ZL(index + 1) }}</div>
            <div class="info__wrapper">
                <span>{{ data.text.title }}</span>
                <span>{{ data.text.category }}</span>
                <span>{{ data.text.source }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { data, index } = defineProps<{ data: ArchiveCopyType, index: number }>()

const store = useStore()

const wrapperRef = ref() as Ref<HTMLElement>

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.archive-media__wrapper {
    width: 100%;

    img {
        width: 100%;
        margin-bottom: 1.6rem;
    }

    .alt__wrapper {
        display: flex;
        font-size: 1.3rem;
        font-weight: 500;
        line-height: 1.5rem;

        .index {
            flex-grow: 2;
        }

        .info__wrapper {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            row-gap: .8rem;
        }
    }

}
</style>
