<template>
    <div ref="wrapperRef" class="archive-media" :data-src="data.src" @mouseover="over()" @mouseleave="leave()"
        :class="{ hide: hoverIndex != index && isHover }">

    </div>
</template>

<script lang="ts" setup>
import { onFlow } from '~/waterflow/composables/onFlow';

const { data, index } = defineProps<{ data: ArchiveCopyType, index: number }>()

const { setHoverCopy, hoverIndex, isHover } = useStoreArchive()

function over() {
    setHoverCopy(index)
}
function leave() {
    setHoverCopy(null)
}

onMounted(() => {
    for (const [key, value] of Object.entries(data.bounds)) {
        //@ts-ignore
        wrapperRef.value.style[key] = value
    }
})
// const emits = defineEmits([])

const store = useStore()

const wrapperRef = ref() as Ref<HTMLElement>

onFlow(() => {
    // projectCanvas.addMedia(wrapperRef.value)
})
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.archive-media {
    height: 20rem;
    width: 15rem;
    background-color: $placeholder-grey;
    border-radius: 4px;

    position: relative;
    z-index: 2;

    &.hide {
        opacity: 0;
    }

    &:hover {
        background-color: transparent;
        border: 2px solid rgba(20, 20, 20, 0.20);
    }
}
</style>

