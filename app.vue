<template>
  <div id="app" v-if="waitBeforeMount">
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>

  </div>
</template>

<script setup lang="ts">
import { FlowProvider, provideFlowProvider } from './waterflow/FlowProvider';
import Index from './pages/index.vue';
import ProjectPage from './pages/project-page/[...id].vue';
import Info from './pages/info.vue';
import Playground from './pages/playground.vue';

const flowProvider = new FlowProvider()
provideFlowProvider(flowProvider)

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

  waitBeforeMount.value = true
})

useRO(() => {
  const m = window.matchMedia('(pointer: coarse)').matches
  const { isMobile, firstRedirect } = useStore()
  isMobile.value = m
})

</script>
