<template>
    <div class="container-3">
        <div class="c-33">
            <div class="data-img" data-src="#"></div>
            <div class="data-img" data-src="#"></div>
        </div>
        <div class="data-img" data-src="#"></div>

    </div>
</template>

<script lang="ts" setup>


</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.container-3 {
    position: relative;
    margin: 2.4rem;

    .c-33 {
        width: 83.8rem;
        height: 81.8rem;
        position: relative;

        .data-img {
            width: 26.9rem;
            height: 54.5rem;

            &:first-child {
                position: absolute;
                top: 0;
                left: 0;
            }

            &:nth-child(2) {
                position: absolute;
                bottom: 0;
                right: 0;

            }
        }
    }

    >.data-img {
        width: 83.8rem;
        height: 48rem;
    }

    >div {
        margin: 22.4rem auto;
    }
}

.data-img {
    background-color: $placeholder-grey;
}
</style>

