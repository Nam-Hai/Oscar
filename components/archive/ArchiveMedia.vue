<template>
    <div ref="wrapperRef" class="archive-media" :data-src="data.src" @mouseover="over()" @mouseleave="leave()"
        :class="{ hide: hoverIndex != index && isHover, 'flip-init': !flow }">

    </div>
</template>

<script lang="ts" setup>
import { useArchiveCanvas } from '~/scene/Pages/ArchiveCanvas';
import { scaleMatrix } from '~/scene/shaders/matrixRotation';
import { onFlow, onSwap } from '~/waterflow/composables/onFlow';

const { data, index } = defineProps<{ data: ArchiveCopyType, index: number }>()

const { setHoverCopy, hoverIndex, isHover } = useStoreArchive()
const { vh } = useStoreView()

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

const flow = onFlow(async () => {
    await nextTick()
    const archive = useArchiveCanvas()
    const m = archive.addMedia(wrapperRef.value)

    const tl = useTL()
    const pos = m.pixelPosition.y
    tl.from({
        d: 1000,
        e: 'o2',
        update: ({ progE }) => {
            if (!m) return
            m.pixelPosition.y = pos - progE * vh.value * 0.5
        },
        cb: () => {
            if (!m) return
            m.onResize(m.canvasSize)
        }
    }).play()
})
// const emits = defineEmits([])

const store = useStore()

const wrapperRef = ref() as Ref<HTMLElement>

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.archive-media {
    height: 20rem;
    width: 15rem;
    // background-color: $placeholder-grey;
    border-radius: 4px;

    position: relative;
    z-index: 2;

    &.flip-init {
        transform: translateY(-50vh);
    }

    transition: transform 1000ms $easeOutQuart;
    transform: translateY(0);

    // &.hide {
    //     opacity: 0;
    // }
    opacity: 0;

    // background-color: transparent;
    // border: 2px solid rgba(20, 20, 20, 0.20);

    border: 2px solid rgba(20, 20, 20, 0.20);

    &:hover {
        opacity: 1;
    }
}
</style>

