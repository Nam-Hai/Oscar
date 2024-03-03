<template>
  <div class="menu__wrapper"
    :class="{ dark: (router.currentRoute.value.name !== 'index' && router.currentRoute.value.name !== 'info') && !atEnd, init, hide: menuHide }"
    ref="wrapperRef">
    <div class="home">
      <NuxtLink to="/" @mouseenter="hoverMenu($event, 'home')" @mouseleave="leave()" v-cursor-hover>
        <span ref="homeRef">
          {{ "Oscar Pico" }}
        </span>
      </NuxtLink>
    </div>
    <div class="menu-grid">
      <NuxtLink to="/info" :class="{ currentRoute: router.currentRoute.value.name == 'info' }" v-cursor-hover
        @mouseenter="hoverMenu($event, 'info')" @mouseleave="leave()">
        <span ref="infoRef">
          {{ "info" }}
        </span>
      </NuxtLink>
      ,
      <NuxtLink to="/"
        :class="{ currentRoute: router.currentRoute.value.name === 'index' || router.currentRoute.value.name === 'project-page-id' }"
        v-cursor-hover @mouseenter="hoverMenu($event, 'projects')" @mouseleave="leave()">
        <span ref="projectsRef">
          {{ "Projects" }}
        </span>
      </NuxtLink>
      ,
      <NuxtLink to="/playground" :class="{ currentRoute: router.currentRoute.value.name == 'playground' }" v-cursor-hover
        @mouseenter="hoverMenu($event, 'playground')" @mouseleave="leave()">
        <span ref="playgroundRef">
          {{ "Playground" }}
        </span>
      </NuxtLink>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { vCursorHover } from '~/directives/cursorActive';
import { onFlow } from '~/waterflow/composables/onFlow';
const router = useRouter()
// const { isHover: archiveHover } = useStoreArchive()
const { overhide, target } = useCursorStore()
const { atEnd } = useStoreProject()
// const { preloaderComplete } = useStore()
const { manifestLoaded, menuHide } = useStore();

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

const init = ref(false)
watch(manifestLoaded, b => {
  const content = N.getAll('.overflow-content', wrapperRef.value)
  const tl = useTL()
  for (let index = 0; index < content.length; index++) {
    const el = content[index]
    tl.from({
      el,
      d: 1000,
      e: 'o4',
      delay: 5000 + 100 * index,
      p: {
        y: [-115, 0]
      }
    })
  }
  useDelay(6300, () => init.value = true)
  tl.play()
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.overflow-content {
  transform: translateY(-115%);
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

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  z-index: $z-menu;

  transition: color 500ms;
  font-size: 1.2rem;
  text-transform: uppercase;

  display: flex;
  justify-content: space-between;

  color: $white;

  &.dark {
    color: $black;

    a:before {
      background-color: $black;
    }
  }

  a:before {
    background-color: $white;
  }

  &.hide {
    opacity: 0;
  }

  padding: 2rem $side-margin;

  @include breakpoint(mobile) {
    padding: 2rem $side-margin-mobile;
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

    a:hover {
      color: transparent;
    }

    a.currentRoute {
      &::after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 1px;
        background: currentColor;
      }
    }
  }
}
</style>