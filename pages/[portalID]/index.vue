<script setup lang="ts">
import { type IMediaStatus } from "@/type.ts/MediaStatus";
import QrcodeVue from "qrcode.vue";
const route = useRoute();
const portalID = ref<string>(route.params.portalID.toString());
const qrCode = computed(() => {
  const uri = useRuntimeConfig().public.preUri;
  return `${uri}${portalID.value}`;
});
let state = ref<IMediaStatus>();
// 视频元素的引用
let videoRef = ref();
const videoSuffix = [
  "mp4",
  "avi",
  "mov",
  "wmv",
  "flv",
  "mkv",
  "webm",
  "3gp",
  "mpeg",
];
const imgSuffix = [
  "jpg",
  "png",
  "jpeg",
  "tiff",
  "gif",
  "psd",
  "eps",
  "svg",
  "pdf",
];
let playPath = computed(() => {
  const uri = useRuntimeConfig().public.playUri;
  return `${uri}${state.value?.currentSrc}`;
});
let isVideo = computed(() => {
  return videoSuffix.some((suffix) => playPath.value.endsWith(suffix));
});
let isImg = computed(() => {
  return imgSuffix.some((suffix) => playPath.value.endsWith(suffix));
});
let waitState = computed(() => {
  return state.value === null ? true : false;
});
// 创建定时器，每秒调用一次 fetchData 函数
onMounted(() => {
  //videoRef.value.style.height = `${window.innerHeight}px`;
  //videoRef.value.style.width = `${window.innerWidth}px`;
  removeStatus();
  setInterval(() => {
    // 执行定时任务的代码
    getMediaStatus();
    //console.log(playPath.value);
  }, 1000);
});
async function removeStatus() {
  const baseUrl = useRuntimeConfig().public.apiBase;
  const uri = `MediaState/RemoveMediaState?portalid=${portalID.value}`;
  await $fetch(baseUrl + uri, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
async function getMediaStatus() {
  const baseUrl = useRuntimeConfig().public.apiBase;
  const uri = `MediaState/GetMediaState?portalid=${portalID.value}`;
  await $fetch(baseUrl + uri, {
    // 请求失败的回调函数
    onRequestError({ error }) {
      console.log(`请求失败，失败原因：${error}`);
    },
    onResponse({ response }) {
      if (!response.ok) {
        console.log(`响应失败: ${response.statusText}`);
      } else {
        state.value = response._data.data;
        console.log(`获取成功: ${JSON.stringify(state.value)}`);
      }
    },
  });
}
//监视state的数据变化
watch(
  state,
  (newValue, oldValue) => {
    console.log(`视频对象${JSON.stringify(videoRef.value)}`);
    if (isImg.value || !videoRef.value) {
      return;
    }
    console.log(
      `检测到值发生变化,新值${JSON.stringify(newValue)},旧值${JSON.stringify(
        oldValue
      )}`
    );
    if (newValue?.looped != oldValue?.looped) {
      newValue?.looped
        ? (videoRef.value.loop = true)
        : (videoRef.value.loop = false);
    }
    if (newValue?.muted != oldValue?.muted) {
      newValue?.muted
        ? (videoRef.value.muted = true)
        : (videoRef.value.muted = false);
    }
    if (newValue?.currentTime != oldValue?.currentTime) {
      videoRef.value.currentTime = newValue?.currentTime;
    }
    if (newValue?.volume != oldValue?.volume) {
      videoRef.value.volume = newValue?.volume;
    }
    if (newValue?.played != videoRef.value.played) {
      newValue?.played ? videoRef.value.play() : videoRef.value.pause();
    }
    // if (newValue?.muted != videoRef.value.muted) {
    //   setTimeout(() => {
    //     videoRef.value.muted = newValue?.muted;
    //   }, 150);
    // }
  },
  { deep: true }
);
</script>
<template>
  <div
    v-if="waitState"
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      width: 100vw;
    "
  >
    <qrcode-vue :value="qrCode" style="width: auto; height: 20vh" />
  </div>
  <div class="bgcolor" v-else>
    <div v-if="isVideo">
      <video
        :src="playPath"
        class="video"
        autoplay
        muted
        playsinline
        ref="videoRef"
      >
        <source :src="playPath" type="video/webm" />
        <source :src="playPath" type="video/mp4" />
      </video>
    </div>
    <div v-else-if="isImg"><img class="imgClass" :src="playPath" /></div>
    <div v-else>
      <h1
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        "
      >
        已识别，等待进入
      </h1>
    </div>
  </div>
</template>
<style scoped>
.bgcolor {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: coral;
}
.imgClass {
  z-index: 1000;
  position: absolute;
  object-fit: contain; /* 保持图片比例同时填充 */
  width: 100vw; /* 宽度铺满整个视口 */
  height: 100vh; /* 高度铺满整个视口 */
  top: 0; /* 图片顶部对齐 */
  left: 0; /* 图片左侧对齐 */
}
.video {
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 50%;
  min-height: 50%;
  object-fit: cover;
  width: 100vw;
  height: 100vh;
  -ms-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
}
</style>
