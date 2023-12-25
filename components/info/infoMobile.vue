<template>
    <div ref="wrapperRef" class="info__wrapper">
        <div class="bio__wrapper">
            <p>
                Oscar Pico.
            </p>
            <p>
                A digital designer with over 3 years of experience, specialized in visual and interface design.
                Also, a lover and enthusiast of art direction and all existing forms of design, such as editorial or
                fashion/clothing design.
            </p>
            <p>
                Always looking towards the future to learn new skills, like motion or 3D design, and refine my current ones
                to create better works and pieces.
            </p>
            <p>
                Originally from Madrid, currently seeking new professional challenges and looking to relocate.
            </p>
        </div>

        <img src="/Assets/info/Oscar_Pico.png" alt="oscar_pico_picture">

        <div class="list__wrapper">
            <div class="socials list-item">
                <NuxtLink to="#">Email</NuxtLink>
                <NuxtLink to="#">Linkedin</NuxtLink>
                <NuxtLink to="#">Twitter</NuxtLink>
                <NuxtLink to="#">Instagram</NuxtLink>
            </div>

            <div class="list-item">
                <span>Status.</span>
                <span>Open to work and relocate</span>
            </div>
            <div class="list-item">
                <span>Des.</span>
                <span>Oscar Pico</span>
            </div>
            <div class="list-item">
                <span>Dev.</span>
                <span>Nam Hai</span>
            </div>
            <div class="last-row">
                <span>All rights reserved</span>
                <span>©2023</span>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
// const {propName = fallbackValue} = defineProps<{propName: type}>()
// const emits = defineEmits([])

const store = useStore()

const wrapperRef = ref() as Ref<HTMLElement>

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.info__wrapper {
    width: 100vw;
    color: $black;
    padding: 13.5rem 1.6rem 1.6rem;
}

.bio__wrapper {
    font-size: 4rem;
    font-weight: 500;
    line-height: 4.4rem;
    letter-spacing: -0.02rem;
    text-indent: 5rem;

    p:nth-child(2) {
        text-indent: 0rem;
    }
}

img {
    width: 100%;
    height: 40.9rem;
    margin-top: 4rem;
    margin-bottom: 4.8rem;
}

.list__wrapper {
    display: flex;
    flex-direction: column;
    // align-items: center;
    font-size: 1.3rem;
    font-weight: 500;
    line-height: 1.5rem;

    /* 115.385% */
    .list-item {
        position: relative;
        // width: 0rem;
        margin-left: calc(50% - 3rem);
        display: flex;
        flex-direction: column;
        row-gap: 1.2rem;

        span,
        a {
            // width: max-content;
        }

        &:nth-child(2) {
            margin-top: 5.6rem;
        }

        &:nth-child(3) {
            margin-top: 4rem;
        }

        &:nth-child(4) {
            margin-top: 2.8rem;
        }
    }

    .last-row {
        position: relative;
        margin-left: calc(50% - 5rem);
        margin-top: 5.6rem;
        display: flex;
        justify-content: space-between;

    }
}
</style>
