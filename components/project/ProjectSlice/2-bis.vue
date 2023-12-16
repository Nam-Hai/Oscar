<template>
    <div class="container-2">
        <div class="data-img" data-src="#"></div>
        <div class="data-img" data-src="#"></div>
    </div>
</template>

<script lang="ts" setup>


</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.container-2 {
    margin: 2.4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    div:first-child {
        width: 97.9rem;
        max-height: calc(100vh - 4.8rem);
        height: 84rem;
    }

    div:nth-child(2) {
        width: 26.9rem;
        height: 26.9rem;
    }
}

.data-img {
    background-color: $placeholder-grey;
}
</style>

