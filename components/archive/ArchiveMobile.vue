<template>
    <div ref="wrapperRef" class="archive-mobile__wrapper">
        <ArchiveMediaMobile v-for="(copy, index) in COPY" :data="copy" :index="index"/>
    </div>
</template>

<script lang="ts" setup>

const { COPY } = useStoreArchive()

const wrapperRef = ref() as Ref<HTMLElement>

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.archive-mobile__wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 2.8rem;

    padding: 5rem 1.6rem 1.6rem;
}
</style>
