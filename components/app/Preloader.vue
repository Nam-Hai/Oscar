<template>
  <div ref="wrapperRef" class="preloader__wrapper" v-if="!killPreloader">
    <div class="left overflow">
      <svg class="overflow-content" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 9" fill="none">
        <path
          d="M4.08958 9C1.48958 9 0 7.37714 0 4.49735C0 1.61756 1.48958 0 4.08958 0C6.68958 0 8.17917 1.62286 8.17917 4.49735C8.17917 7.37714 6.695 9 4.08958 9ZM1.70625 4.49735C1.70625 6.69299 2.58375 7.70065 4.08958 7.70065C5.60083 7.70065 6.47833 6.68768 6.47833 4.49735C6.47833 2.30701 5.60083 1.29935 4.08958 1.29935C2.58375 1.29935 1.70625 2.30701 1.70625 4.49735Z"
          fill="currentColor" />
        <path
          d="M12.8773 9C11.106 9 9.90895 8.41131 9.35645 7.05893L10.5427 6.31114C10.9869 7.27107 11.7398 7.74308 12.9152 7.74308C13.9714 7.73777 14.6377 7.28167 14.6377 6.57631C14.6377 5.81791 14.1502 5.54213 13.0885 5.29287L12.276 5.10725C10.6131 4.72009 9.62186 3.97761 9.62186 2.51385C9.62186 0.970537 10.8352 0 12.9585 0C14.6106 0 15.786 0.604596 16.2519 1.88804L15.0656 2.61461C14.6864 1.68651 14.0148 1.26223 12.9152 1.26223C11.7669 1.26223 11.2523 1.6759 11.2523 2.42899C11.2523 3.18739 11.7777 3.45787 12.731 3.68061L13.5435 3.87154C15.0981 4.23217 16.2464 4.74131 16.2464 6.42781C16.2464 8.01886 14.9952 9 12.8773 9Z"
          fill="currentColor" />
        <path
          d="M21.689 9C18.8236 9 17.6211 7.08014 17.6211 4.49204C17.6211 1.90395 18.8236 0 21.689 0C23.6932 0 24.8578 0.848556 25.2965 2.68886L23.6878 3.03889C23.3953 1.81909 22.7669 1.28344 21.689 1.28344C20.1073 1.28344 19.3382 2.41839 19.3382 4.49204C19.3382 6.57101 20.1073 7.72186 21.689 7.72186C22.8103 7.72186 23.4494 7.15439 23.704 5.91868L25.2586 6.24219C24.8903 8.13553 23.574 9 21.689 9Z"
          fill="currentColor" />
        <path
          d="M26.3038 8.83029L29.0663 0.169711H31.3901L34.1526 8.83029H32.4843L31.8559 6.80436H28.6005L27.9722 8.83029H26.3038ZM29.0122 5.4944H31.4443L31.1301 4.48144C30.8105 3.45256 30.5559 2.53506 30.2472 1.41603H30.2147C29.9005 2.53506 29.6405 3.45256 29.3263 4.48144L29.0122 5.4944Z"
          fill="currentColor" />
        <path
          d="M35.5396 8.83029V0.169711H39.1417C41.2813 0.169711 42.0342 1.17207 42.0342 2.69417C42.0342 3.93518 41.4925 4.83147 40.3658 5.20801L42.2779 8.83029H40.4904L38.8167 5.40424H37.1321V8.83029H35.5396ZM37.1321 4.20035H39.0225C40.0246 4.20035 40.4254 3.68592 40.4254 2.72068C40.4254 1.90925 40.0571 1.42133 39.0225 1.42133H37.1321V4.20035Z"
          fill="currentColor" />
        <path
          d="M43.8296 8.83029V0.169711H47.1717C49.3709 0.169711 50.0805 1.23571 50.0805 2.83206C50.0805 4.49735 49.3221 5.56865 47.1717 5.56865H45.4221V8.83029H43.8296ZM45.4221 4.30112H47.1013C48.1142 4.30112 48.4771 3.75486 48.4771 2.81615C48.4771 1.94638 48.1413 1.46376 47.1013 1.46376H45.4221V4.30112Z"
          fill="currentColor" />
        <path d="M51.5484 8.83029V0.169711H53.1409V8.83029H51.5484Z" fill="currentColor" />
        <path
          d="M58.8101 9C55.9447 9 54.7422 7.08014 54.7422 4.49204C54.7422 1.90395 55.9447 0 58.8101 0C60.8143 0 61.9789 0.848556 62.4176 2.68886L60.8089 3.03889C60.5164 1.81909 59.888 1.28344 58.8101 1.28344C57.2284 1.28344 56.4593 2.41839 56.4593 4.49204C56.4593 6.57101 57.2284 7.72186 58.8101 7.72186C59.9314 7.72186 60.5705 7.15439 60.8251 5.91868L62.3797 6.24219C62.0114 8.13553 60.6951 9 58.8101 9Z"
          fill="currentColor" />
        <path
          d="M67.7312 9C65.1312 9 63.6416 7.37714 63.6416 4.49735C63.6416 1.61756 65.1312 0 67.7312 0C70.3312 0 71.8208 1.62286 71.8208 4.49735C71.8208 7.37714 70.3366 9 67.7312 9ZM65.3479 4.49735C65.3479 6.69299 66.2253 7.70065 67.7312 7.70065C69.2424 7.70065 70.1199 6.68768 70.1199 4.49735C70.1199 2.30701 69.2424 1.29935 67.7312 1.29935C66.2253 1.29935 65.3479 2.30701 65.3479 4.49735Z"
          fill="currentColor" />
        <path
          d="M76.4081 5.89279C74.7516 5.89279 73.4042 4.58301 73.4042 2.95548C73.4042 1.34344 74.7516 0.018167 76.4081 0.018167C78.0647 0.018167 79.4042 1.34344 79.4042 2.95548C79.4042 4.58301 78.0647 5.89279 76.4081 5.89279ZM74.1334 2.95548C74.1334 4.1955 75.1479 5.17977 76.4081 5.17977C77.6684 5.17977 78.6829 4.1955 78.6829 2.95548C78.6829 1.7232 77.6684 0.731182 76.4081 0.731182C75.1479 0.731182 74.1334 1.7232 74.1334 2.95548ZM75.2985 4.40476V1.45195H76.638C77.3513 1.45195 77.6763 1.7852 77.6763 2.38197C77.6763 2.78497 77.5098 3.07948 77.1928 3.24223L77.7952 4.40476H76.9709L76.4557 3.37399H76.0515V4.40476H75.2985ZM76.0515 2.78497H76.5429C76.8044 2.78497 76.9154 2.67647 76.9154 2.38972C76.9154 2.11846 76.7965 2.02546 76.5508 2.02546H76.0515V2.78497Z"
          fill="currentColor" />
      </svg>
    </div>
    <div class="preloader__placeholder" ref="placeholderRef">

    </div>
    <div class="right overflow">
      <span class="overflow-content">
        Digital designer
      </span>
    </div>

    <div class="counter overflow">
      <span class="overflow-content">
        {{ counter }}
      </span>
    </div>
  </div>
  <slot v-if="preloaderComplete" />
</template>

<script lang="ts" setup>
import { useFlowProvider } from '~/waterflow/FlowProvider';


const { setBounds } = usePreloaderStore()
const flowProvider = useFlowProvider()
const wrapperRef = ref()
const counter = ref('00')

const manifestLoaded = ref(false)
const { preloaderComplete, fromPreloader } = useStore()
const killPreloader = ref(false)
const percentageRef = ref(0)
const route = useRoute()

const canvas = useCanvas()

const placeholderRef = ref()
setBounds(placeholderRef)

// is set to True in preloader at the end of its animation
watch(preloaderComplete, async () => {

  fromPreloader.value = false

  canvas.onChange(flowProvider.getRouteTo())
  canvas.resolveOnChange()

  await nextTick()

  killPreloader.value = true
  // useDelay(1000, () => {
  // }).run()
})


onMounted(() => {
  const manifest = useManifest()

  manifest.init()

  const percentage = manifest.percentage
  watch(percentage, (next, old) => {
    percentageRef.value = next
    counter.value = N.ZL(Math.floor(next * 100))
  })

  manifest.loadManifest().then(() => {
    manifestLoaded.value = true
    endLoading()
  })
  // if (manifest.length == 0) return endPreloader()
})

function endLoading() {
  canvas.preloader()

  N.Class.add(wrapperRef.value, 'hide')
}

</script>

<style scoped lang="scss">
@use "@/styles/shared.scss" as *;

.preloader__wrapper {
  pointer-events: none;
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  line-height: 100%;
  height: 100%;
  width: 100%;

  color: $black;

  &.hide {

    .overflow-content {
      transform: translateY(105%);
    }
  }

  .preloader__placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 26.8rem;
    height: 24rem;
    // background-color: $placeholder-grey;
    // border-radius: 0.4rem;
  }

  .left {
    height: .9rem;
    width: 7.9404rem;
    position: absolute;
    left: 2.4rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .right {
    text-align: right;

    font-size: 1.3rem;
    font-weight: 500;
    line-height: 1.5rem;
    /* 115.385% */
    position: absolute;
    right: 2.4rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .overflow-content {
    transform: translateY(0%);
    transition: transform 1000ms $easeOutQuart;
  }
}

.counter {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 4rem;
  font-size: 1.4rem;
  opacity: 0.25;
}
</style>
