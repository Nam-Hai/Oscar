<template>
  <div id="app" v-if="waitBeforeMount">
    <NuxtLayout v-if="!refreshPls">
      <NuxtPage></NuxtPage>
    </NuxtLayout>
    <Refresh v-else />

  </div>
</template>

<script setup lang="ts">
import { FlowProvider, provideFlowProvider, useFlowProvider } from './waterflow/FlowProvider';
import Index from './pages/index.vue';
import ProjectPage from './pages/project-page/[...id].vue';
import Info from './pages/info.vue';
import Playground from './pages/playground.vue';

provideFlowProvider()
const flowProvider = useFlowProvider()

flowProvider.registerPage('index', Index)
flowProvider.registerPage('project-page-id', ProjectPage)
flowProvider.registerPage('playground', Playground)
flowProvider.registerPage('info', Info)

const { flowIsHijacked } = useStore()
watch(flowProvider.flowIsHijacked, (flow) => {
  flowIsHijacked.value = flow
})

const matcher = window.matchMedia('(prefers-color-scheme: dark)');
if (matcher.matches) {
  const els = N.getAll('link.light')
  for (const el of els) {
    el.remove()
  }
} else {
  const els = N.getAll('link.dark')
  for (const el of els) {
    el.remove()
  }
}

let waitBeforeMount = ref(false)

onBeforeMount(() => {
  useStoreView().init()
  const { isMobile, firstRedirect, menuHide } = useStore()

  const m = window.matchMedia('(pointer: coarse)').matches
  isMobile.value = m

  waitBeforeMount.value = true
})

useRO(() => {
  const m = window.matchMedia('(pointer: coarse)').matches
  const { isMobile, firstRedirect, menuHide } = useStore()
  isMobile.value = m
})

const { isMobile } = useStore()
const refreshPls = ref(false)
watch(isMobile, (newValue, oldValue) => {
  if (oldValue === undefined) return
  refreshPls.value = true
})

</script>
