<template>
    <main ref="wrapperRef">
        <p>
            A digital designer originally from Spain and based in Madrid, specialised in visual and interface design.
            Always
            willing to create meaningful pieces where creativity and excitement harmonise as the main driving engine.
            Additionally, a curious individual constantly exploring new skills and interests, including art direction,
            branding, and motion design. Also, passionate about various forms of design, such as editorial and fashion.
        </p>
        <p>
            Worked for different studios and agencies - Hanzo Studio, The Cocktail, Acute Brand.<br> Currently seeking
            new
            opportunities and willing to relocate.
        </p>
        <div class="menu">
            <div class="link__container">
                <span ref="emailRef" @mouseenter="hoverMenu($event, 'email')" @mouseleave="leave()">
                    <NuxtLink to="" v-cursor-hover>EMAIL</NuxtLink>
                </span>
                <span ref="linkedinRef" @mouseenter="hoverMenu($event, 'linkedin')" @mouseleave="leave()">
                    <NuxtLink to="" v-cursor-hover>Linkedin</NuxtLink>
                </span>
                <span ref="twitterRef" @mouseenter="hoverMenu($event, 'twitter')" @mouseleave="leave()">
                    <NuxtLink to="" v-cursor-hover>Twitter</NuxtLink>
                </span>
                <span ref="instaRef" @mouseenter="hoverMenu($event, 'insta')" @mouseleave="leave()">
                    <NuxtLink to="" v-cursor-hover>Instagram</NuxtLink>
                </span>
            </div>
            <div class="footer">
                <span>@2024</span>
                <div>
                    <span>Design by
                        <span ref="oscarRef" @mouseenter="hoverMenu($event, 'oscar')" @mouseleave="leave()">
                            <NuxtLink v-cursor-hover to="/">Oscar Pico.</NuxtLink>
                        </span>
                    </span>
                    <span>Code by
                        <span ref="namRef" @mouseenter="hoverMenu($event, 'nam')" @mouseleave="leave()">
                            <NuxtLink v-cursor-hover to="https://twitter.com/_NamHai">Nam Hai.</NuxtLink>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { vCursorHover } from '~/directives/cursorActive';
import { defaultFlowIn, defaultFlowOut } from '~/pages_transitions/default.transition';
import { onFlow } from '~/waterflow/composables/onFlow';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

const emailRef = ref() as Ref<HTMLElement>
const linkedinRef = ref()
const twitterRef = ref()
const instaRef = ref()
const oscarRef = ref()
const namRef = ref()
const bounds = {
    email: { x: 0, y: 0, width: 0, height: 0 },
    linkedin: { x: 0, y: 0, width: 0, height: 0 },
    twitter: { x: 0, y: 0, width: 0, height: 0 },
    insta: { x: 0, y: 0, width: 0, height: 0 },
    nam: { x: 0, y: 0, width: 0, height: 0 },
    oscar: { x: 0, y: 0, width: 0, height: 0 },
}

useRO(() => {
    bounds.email = emailRef.value.getBoundingClientRect()
    bounds.linkedin = linkedinRef.value.getBoundingClientRect()
    bounds.twitter = twitterRef.value.getBoundingClientRect()
    bounds.insta = instaRef.value.getBoundingClientRect()
    bounds.nam = namRef.value.getBoundingClientRect()
    bounds.oscar = oscarRef.value.getBoundingClientRect()
})
onFlow(async () => {
    await nextTick()
    useDelay(700, () => {
        bounds.email = emailRef.value.getBoundingClientRect()
        bounds.linkedin = linkedinRef.value.getBoundingClientRect()
        bounds.twitter = twitterRef.value.getBoundingClientRect()
        bounds.insta = instaRef.value.getBoundingClientRect()
        bounds.nam = namRef.value.getBoundingClientRect()
        bounds.oscar = oscarRef.value.getBoundingClientRect()
    })
})

const { overhide, target } = useCursorStore()
function hoverMenu(e: MouseEvent, to: keyof typeof bounds) {
    overhide.value = true

    const b = bounds[to]
    target.value.x = b.x + b.width / 2
    target.value.y = b.y + b.height / 2
}
function leave() {
    overhide.value = false
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

main {
    position: absolute;
    inset: 0;
    background-color: $black;
    color: $white;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4rem $side-margin $side-margin;

    @include breakpoint(mobile) {
        // padding: 3.6rem 1.6rem 1.6rem ;
        // padding: 3.6rem $side-margin-mobile $side-margin-mobile;
    }

    line-height: 100%;

    font-size: 1.4rem;

    line-height: 1.8rem;

    p:first-child {
        width: 112rem;

        @include breakpoint(mobile) {
            width: 100%;
            text-align: justify;
        }
    }

    p:nth-child(2) {
        @include breakpoint(mobile) {
            width: 100%;
            text-align: justify;
        }
    }

    .menu {
        font-size: 1.2rem;

        display: flex;
        flex-direction: column;
        row-gap: 5.6rem;
        text-transform: uppercase;

        .link__container {
            display: flex;
            flex-direction: column;
            row-gap: 1.2rem;
            line-height: 1rem;
            width: min-content;

            span {
                width: min-content;
            }
        }

        .footer {
            @include breakpoint(mobile) {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            }

            >div {
                display: inline;

                @include breakpoint(mobile) {
                    display: flex;
                    text-align: right;
                    flex-direction: column;
                }
            }

            span:first-child {
                margin-right: 24rem;

                @include breakpoint(mobile) {
                    margin: unset;
                }
            }

            span:nth-child(2) {
                @include breakpoint(desktop) {
                    margin-right: 3.4rem;
                }
            }
        }
    }
}

a {
    transition: color 500ms;
}

a:hover {
    color: transparent;
}
</style>
