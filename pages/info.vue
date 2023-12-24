<template>
    <div ref="wrapperRef" class="info__wrapper">
        <div class="social__wrapper" ref="socialsRef">
            <NuxtLink to="#?a=email" v-cursor-hover>Email</NuxtLink>
            <NuxtLink to="#?a=linkedin" v-cursor-hover>Linkedin</NuxtLink>
            <NuxtLink to="#?a=twitter" v-cursor-hover>Twitter</NuxtLink>
            <NuxtLink to="#?a=insta" v-cursor-hover>Instagram</NuxtLink>
        </div>


        <div class="bio__wrapper" :class="{ highlight, animationDone }">
            <p>
                <span class="highlight"><span>Oscar&nbsp;</span><span>Pico.</span></span>
            </p>
            <p>
                <span><span>A&nbsp;</span></span>
                <span class="highlight"><span>digital&nbsp;</span><span>designer,&nbsp;</span></span>
                <span><span>originally&nbsp;</span></span><span><span>from&nbsp;</span></span><span
                    class="highlight"><span>Madrid,&nbsp;</span></span><span><span>specialised&nbsp;</span></span><span><span>in&nbsp;</span></span><span
                    class="highlight"><span>visual&nbsp;</span><span>design.&nbsp;</span></span><span><span>Also,&nbsp;</span></span><span><span>an&nbsp;</span></span><span><span>art&nbsp;</span></span><span><span>direction&nbsp;</span></span><span><span>and&nbsp;</span></span><span><span>branding&nbsp;</span></span><span><span>lover.&nbsp;</span></span>
            </p>
            <p>
                <span><span>Always&nbsp;</span></span><span><span>looking&nbsp;</span></span><span><span>forward&nbsp;</span></span><span><span>to&nbsp;</span></span><span
                    class="highligh"><span>grow&nbsp;</span></span><span><span>my&nbsp;</span></span><span><span>skillset&nbsp;</span></span><span><span>and&nbsp;</span></span><span><span>get&nbsp;</span></span><span
                    class="highlight"><span>better.&nbsp;</span></span><span><span>Now,&nbsp;</span></span><span><span>polishing&nbsp;</span></span><span
                    class="highlight"><span>motion&nbsp;</span></span><span><span>skills&nbsp;</span></span><span><span>and&nbsp;</span></span><span><span>getting&nbsp;</span></span><span><span>the&nbsp;</span></span><span><span>hang&nbsp;</span></span><span><span>of&nbsp;</span></span><span
                    class="highlight"><span>3D&nbsp;</span><span>design.&nbsp;</span></span>
            </p>
            <p>
                <span><span>Currently&nbsp;</span></span><span><span>seeking&nbsp;</span></span><span><span>new&nbsp;</span></span><span><span>professional&nbsp;</span></span><span><span>challenges&nbsp;</span></span><span><span>and&nbsp;</span></span><span><span>looking&nbsp;</span></span><span><span>to&nbsp;</span></span><span><span>relocate.&nbsp;</span></span>
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
import { DURATION, defaultFlowIn, defaultFlowOut } from '~/pages_transitions/default.transition';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { vCursorHover } from '~/directives/cursorActive';
import { onFlow } from '~/waterflow/composables/onFlow';

const highlight = ref(false)
const socialsRef = ref()

const { computeBounds, resize } = usePin({
    el: socialsRef,
    start: 100,
    eStart: 100,
})

onMounted(() => {
    highlight.value = false
})
onBeforeUnmount(() => {
    const spans = N.getAll(".bio__wrapper p .highlight", wrapperRef.value)
    for (const span of spans) {
        span.removeEventListener("mouseenter", highlightSpan)
        span.removeEventListener("mouseleave", leaveSpan)
    }
})

const animationDone = ref(false)
const flow = onFlow(() => {
    const spans = N.getAll(".bio__wrapper p > span > span")
    // console.log(spans);
    const tl = useTL()
    for (let index = 0; index < spans.length; index++) {
        const span = spans[index]
        N.O(span as HTMLElement, 0)
        N.T(span as HTMLElement, 0, -10, 'rem')

        tl.from({
            el: span,
            d: 1000,
            delay: 15 * index,
            e: "o4",
            p: {
                y: [-10, 0, "rem"],
            }
        }).from({
            el: span,
            d: 1000,
            delay: 15 * index,
            p: {
                o: [0, 1]
            }

        })
    }
    tl.from({
        el: N.get("img", wrapperRef.value),
        d: 1000,
        delay: 15 * spans.length,
        e: "o4",
        p: {
            y: [-10, 0, 'rem'],
            o: [0, 1]
        }
    })
    useDelay(spans.length * 20 + 200, () => {
        animationDone.value = true
    })
    useDelay(DURATION / 2 + 50, resize)
    tl.play()

    const spansh = N.getAll(".bio__wrapper p .highlight", wrapperRef.value)
    for (const span of spansh) {
        span.addEventListener("mouseenter", highlightSpan, { passive: true })
        span.addEventListener("mouseleave", leaveSpan, { passive: true })
    }
})

function highlightSpan(e: Event) {
    if (!flow.value) return
    highlight.value = true
}
function leaveSpan(e: Event) {
    if (!flow.value) return
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

// const aRef = ref()
// useSplitWord(aRef)
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.info__wrapper {
    width: 100vw;
    color: $black;
    padding-left: 30rem;
    padding-right: 1rem;
    position: relative;
    padding-bottom: 2.4rem;
}

.social__wrapper {
    position: absolute;
    // position: fixed;
    height: 100vh;
    padding-bottom: 2.4rem;
    top: 0;
    left: 2.4rem;
    font-size: 1.3rem;
    font-weight: 500;
    line-height: 1.5rem;
    /* 115.385% */

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    row-gap: .8rem;

    z-index: 20;
}

.bio__wrapper {
    position: relative;
    padding-top: 16.4rem;

    display: flex;
    flex-direction: column;
    // row-gap: 2.4rem;

    &.highlight.animationDone {
        p>span {
            >span {
                opacity: 0 !important;
            }

            &.highlight:hover {
                >span {
                    opacity: 1 !important;
                }
            }
        }
    }

    &.animationDone {
        span {
            transition: opacity 200ms;
        }
    }

    p {
        font-size: 7.2rem;
        font-weight: 500;
        line-height: 7.6rem;
        letter-spacing: -.072rem;

        >span:first-child>span:first-child {
            text-indent: 9rem;
        }

        &:nth-child(2)>span:first-child>span:first-child {
            text-indent: 0rem;
        }

        /* Adjust the value according to your preference */


        >span>span {
            display: inline-block;
            position: relative;
            transform: translateY(-10rem);
            opacity: 0;
        }
    }


}

img {
    opacity: 0;
    width: 55.3rem;
    height: 63.2rem;
    object-fit: cover;
    border-radius: 0.4rem;
    margin-top: 4.8rem;
    margin-bottom: 36.5rem;
}

.list__wrapper {
    // position: absolute;
    position: relative;
    // bottom: 5rem;
    left: 0;
    width: 100%;

    // height: 2.6rem;

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
            position: relative;
            // left: 30rem;
        }

        &:nth-child(2) {
            left: 57rem;
        }

        &:nth-child(3) {
            left: 71.2rem;
        }

        &:nth-child(4) {
            left: 100.7rem;
            // justify-content: flex-end;
            align-items: flex-end;

        }
    }
}
</style>

