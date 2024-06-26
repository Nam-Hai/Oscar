<template>
  <div class="menu__wrapper"
    :class="{ dark: (route !== 'index' && route !== 'info') && !atEnd, init: menuInit, hide: menuHide }"
    ref="wrapperRef">
    <div class="home">
      <NuxtLink to="/" @mouseenter="hoverMenu($event, 'home')" @mouseleave="leave()" v-cursor-hover>
        <span ref="homeRef" class="overflow">
          <span class="overflow-content">
            {{ "Oscar Pico" }}
          </span>
        </span>
      </NuxtLink>
    </div>
    <div class="menu-grid">
      <NuxtLink to="/info" :class="{ currentRoute: route == 'info' }" v-cursor-hover
        @mouseenter="hoverMenu($event, 'info')" @mouseleave="leave()">
        <span ref="infoRef" class="overflow">
          <span class="overflow-content">
            {{ "info" }}
          </span>
        </span>
      </NuxtLink>
      ,
      <NuxtLink to="/" :class="{ currentRoute: route === 'index' || route === 'project-page-id' }" v-cursor-hover
        @mouseenter="hoverMenu($event, 'projects')" @mouseleave="leave()">

        <span ref="projectsRef" class="overflow">
          <span class="overflow-content">
            {{ "Projects" }}
          </span>
        </span>
      </NuxtLink>
      ,
      <NuxtLink to="/playground" :class="{ currentRoute: route == 'playground' }" v-cursor-hover
        @mouseenter="hoverMenu($event, 'playground')" @mouseleave="leave()">
        <span ref="playgroundRef" class="overflow">
          <span class="overflow-content">
            {{ "Playground" }}
          </span>
        </span>
      </NuxtLink>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { vCursorHover } from '~/directives/cursorActive';
import { useFlowProvider } from '~/waterflow/FlowProvider';
const { routeRef } = useFlowProvider()
const route = ref(routeRef.value)
watch(routeRef, (r, old) => {
  console.log(r);
  if (old === "index") {
    useDelay(1000, () => {
      route.value = r
    })
  } else {
    route.value = r
  }
})

// const { isHover: archiveHover } = useStoreArchive()
const { overhide, target } = useCursorStore()
const { atEnd } = useStoreProject()
// const { preloaderComplete } = useStore()
const { manifestLoaded, menuHide, menuInit } = useStore();

const wrapperRef = ref()
const infoRef = ref() as Ref<HTMLElement>
const projectsRef = ref()
const playgroundRef = ref()
const homeRef = ref()
const bounds = {
  info: { x: 0, y: 0, width: 0, height: 0 },
  home: { x: 0, y: 0, width: 0, height: 0 },
  playground: { x: 0, y: 0, width: 0, height: 0 },
  projects: { x: 0, y: 0, width: 0, height: 0 },

}

useRO(() => {
  bounds.info = infoRef.value.getBoundingClientRect()
  bounds.home = homeRef.value.getBoundingClientRect()
  bounds.projects = projectsRef.value.getBoundingClientRect()
  bounds.playground = playgroundRef.value.getBoundingClientRect()
})

function hoverMenu(e: MouseEvent, to: keyof typeof bounds) {
  overhide.value = true

  const b = bounds[to]
  target.value.x = b.x + b.width / 2
  target.value.y = b.y + b.height / 2
}
function leave() {
  overhide.value = false
}

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.overflow {
  height: 100%;
}

.overflow-content {
  transform: translateY(-115%);

  line-height: 100%;
}

svg.overflow-content {
  transform: translateY(-145%);
}

a {
  padding: unset;
  margin: unset;
}

.menu__wrapper {
  &.init .overflow-content {
    transform: translateY(0) !important;
  }

  .overflow-content {
    transform: translateY(-100%);
  }

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  z-index: $z-menu;

  transition: color 0ms;
  font-size: 1.2rem;
  font-weight: 500;
  text-transform: uppercase;

  display: flex;
  justify-content: space-between;

  &.init {
    color: $white;
  }

  color: transparent;
  // color: red;

  &.dark.init {
    color: $black;

    a:before {
      background-color: $black;
    }
  }

  a:before {
    background-color: $white;
  }

  transition: opacity 150ms;

  &.hide {
    pointer-events: none;
    opacity: 0;
  }

  padding: 1.6rem $side-margin;

  @include breakpoint(mobile) {
    padding: 1.6rem $side-margin-mobile;
  }

  .menu-grid,
  .home {

    position: relative;

    @include breakpoint(mobile) {
      justify-content: unset;
    }

    position: relative;

    a {
      transition: color 250ms;
    }

    @media (hover: hover) and (pointer: fine) {
      a:hover {
        color: transparent;
      }
    }
  }
}

// .overflow-content {
//   animation: 1s ease-out 0s 1 slideInFromLeft;
// }

@keyframes slideInFromLeft {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
  }
}

.currentRoute {
  &::after {
    content: '';
    display: block;
    height: 1px;
    width: 100%;
    position: absolute;
    left: 0;
    top: 1.5rem;
    background-color: currentColor;
  }
}
</style>