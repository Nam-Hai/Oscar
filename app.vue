<template>
  <div id="app" v-if="true">
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { FlowProvider, provideFlowProvider } from './waterflow/FlowProvider';
import Index from './pages/index.vue';
import ProjectPage from './pages/project-page/[...id].vue';
import Archive from './pages/archive.vue';
import Info from './pages/info.vue';

const flowProvider = new FlowProvider()
provideFlowProvider(flowProvider)

flowProvider.registerPage('index', Index)
flowProvider.registerPage('project-page-id', ProjectPage)
flowProvider.registerPage('archive', Archive)
flowProvider.registerPage('info', Info)
// flowProvider.registerPage('playground', Playground)

const { flowIsHijacked } = useStore()
watch(flowProvider.flowIsHijacked, (flow) => {
  flowIsHijacked.value = flow
})


if (process.client) {
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
}

let waitBeforeMount = ref(false)

onBeforeMount(() => {
  useStoreView().init()

  const m = window.matchMedia('(pointer: coarse)').matches
  const { isMobile } = useStore()
  isMobile.value = m
  waitBeforeMount.value = true
})

useRO(() => {
  const m = window.matchMedia('(pointer: coarse)').matches
  const { isMobile } = useStore()
  isMobile.value = m
})

onMounted(() => {
})


</script>
