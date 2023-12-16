<template>
    <div class="container-6">
        <div class="data-img" data-src="#"></div>

        <div class="c-62">
            <div class="data-img" data-src="#"></div>
            <div class="data-img" data-src="#"></div>

        </div>
    </div>
</template>

<script lang="ts" setup>


</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.container-6 {
    position: relative;
    width: 100%;
    background-color: $placeholder-grey;

    padding: 20rem 0;

    >.data-img:first-child {
        margin: 0 auto;
        width: 83.7rem;
        height: 47.9rem;
    }

    .c-62 {
        height: 75rem;
        width: 112.3rem;
        position: relative;
        margin: 16rem auto 0;

        .data-img:first-child {
            position: absolute;
            top: 0;
            right: 0;
            width: 40.9rem;
            height: 40.9rem;
        }

        .data-img:nth-child(2) {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 26.9rem;
            height: 54.5rem;
        }
    }
}

.data-img {
    background-color: $placeholder-grey-2;
}
</style>

