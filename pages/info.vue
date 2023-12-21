<template>
    <div ref="wrapperRef" class="info__wrapper">

        <div class="social__wrapper">
            <NuxtLink to="#?a=email" v-cursor-hover>Email</NuxtLink>
            <NuxtLink to="#?a=linkedin" v-cursor-hover>Linkedin</NuxtLink>
            <NuxtLink to="#?a=twitter" v-cursor-hover>Twitter</NuxtLink>
            <NuxtLink to="#?a=insta" v-cursor-hover>Instagram</NuxtLink>
        </div>

        <div class="bio__wrapper" :class="{ highlight }">
            <p>
                <span class="highlight">Oscar Pico</span><br>
                <span>A </span><span class="highlight">digital designer,</span><span> originally
                    from
                </span><span class="highlight">Madrid,</span><span> specialised in </span><span class="highlight">visual
                    design.</span><span> Also, an art direction and branding lover.</span>
            </p>
            <p>
                <span>Always looking forward to </span><span class="highlight">grow</span><span> my skillset and get
                </span><span class="highlight">better.</span><span> Now, polishing </span><span class="highlight">motion
                    skills</span><span> and getting the hang
                    of </span><span class="highlight">3D design.</span>
            </p>
            <p>
                <span>Currently seeking new professional challenges and looking to relocate.</span>
            </p>
        </div>
        <img src="/Assets/info/Oscar_Pico.png" alt="oscar_pico_picture">

        <div class="list__wrapper">
            <div class="list__item">
                <div class="list__item-title">Status.</div>
                <div class="list__item-text">Open to work and relocate</div>
            </div>
            <div class="list__item">
                <div class="list__item-title">Des.</div>
                <div class="list__item-text">Oscar Pico</div>
            </div>
            <div class="list__item">
                <div class="list__item-title">Dev.</div>
                <NuxtLink class="list__item-text" to="https://twitter.com/_NamHai" target="_blank" v-cursor-hover>Nam Hai
                </NuxtLink>
            </div>
            <div class="list__item">
                <div class="list__item-title">All rights reserved</div>
                <div class="list__item-text">©2023</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defaultFlowIn, defaultFlowOut } from '~/pages_transitions/default.transition';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { vCursorHover } from '~/directives/cursorActive';

const highlight = ref(false)

onMounted(() => {
    const spans = N.getAll(".bio__wrapper p .highlight", wrapperRef.value)
    for (const span of spans) {
        span.addEventListener("mouseenter", highlightSpan, { passive: true })
        span.addEventListener("mouseleave", leaveSpan, { passive: true })
    }
})
onBeforeUnmount(() => {
    const spans = N.getAll(".bio__wrapper p .highlight", wrapperRef.value)
    for (const span of spans) {
        span.removeEventListener("mouseenter", highlightSpan)
        span.removeEventListener("mouseleave", leaveSpan)
    }
})

function highlightSpan(e: Event) {
    // e.stopPropagation()
    console.log('test');
    highlight.value = true
}
function leaveSpan(e: Event) {
    highlight.value = false
}

useResetLenis()

const wrapperRef = ref() as Ref<HTMLElement>

usePageFlow({
    props: { wrapperRef },
    flowOut: defaultFlowOut,
    flowInCrossfade: defaultFlowIn,
    enableCrossfade: 'TOP'
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.info__wrapper {
    min-height: 100vh;
    width: 100vw;
    color: $black;
    padding-left: 30rem;
    padding-right: 1rem;
    position: relative;
}

.social__wrapper {
    position: fixed;
    bottom: 2.4rem;
    left: 2.4rem;
    font-size: 1.3rem;
    font-weight: 500;
    line-height: 1.5rem;
    /* 115.385% */

    display: flex;
    flex-direction: column;
    row-gap: .8rem;

    z-index: 20;
}

.bio__wrapper {
    position: relative;
    padding-top: 16.4rem;

    display: flex;
    flex-direction: column;
    // row-gap: 2.4rem;

    &.highlight {
        p>span {
            opacity: 0;

            &.highlight:hover {
                opacity: 1;
                z-index: 200;
            }
        }
    }

    p {
        font-size: 7.2rem;
        font-weight: 500;
        line-height: 7.6rem;
        letter-spacing: -.072rem;

        text-indent: 9rem;

        /* Adjust the value according to your preference */

        span {
            transition: opacity 200ms;
        }

        >span {
            position: relative;
        }
    }


}

img {
    width: 55.3rem;
    height: 63.2rem;
    object-fit: cover;
    border-radius: 0.4rem;
    margin-top: 4.8rem;
    margin-bottom: 36.5rem;
}

.list__wrapper {
    position: absolute;
    bottom: 2.4rem;
    left: 0;
    width: 100%;

    .list__item {
        position: absolute;
        display: flex;
        flex-direction: column;
        row-gap: .8rem;
        bottom: 0;

        >div,
        a {
            font-size: 1.3rem;
            font-weight: 500;
            line-height: 1.5rem;
        }


        &:first-child {
            left: 30rem;
        }

        &:nth-child(2) {
            left: 87rem;
        }

        &:nth-child(3) {
            left: 101.2rem;
        }

        &:nth-child(4) {
            left: 130.7rem;
        }
    }
}
</style>

