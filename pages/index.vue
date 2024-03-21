<script setup lang="ts">
import { type IMediaStatus } from "@/type.ts/MediaStatus";

const route = useRoute();
const portalID = ref<string>("");
// const qrCode = computed(() => {
//   const uri = useRuntimeConfig().public.preUri;
//   return `${uri}${portalID.value}`;
// });
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
  return state.value?.currentSrc === "" ? true : false;
});
let isHome = computed(() => {
  return state.value === null ? true : false;
});
//创建定时器，每秒调用一次 fetchData 函数
onMounted(() => {
  //videoRef.value.style.height = `${window.innerHeight}px`;
  //videoRef.value.style.width = `${window.innerWidth}px`;
  //removeStatus();
  setInterval(() => {
    // 执行定时任务的代码
    getMediaStatus();
    //console.log(playPath.value);
  }, 1000);
});
async function removeStatus() {
  const baseUrl = useRuntimeConfig().public.apiBase;
  const uri = `MediaState/RemoveMediaState?portalid=${"asd"}`;
  await $fetch(baseUrl + uri, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
async function getMediaStatus() {
  const baseUrl = useRuntimeConfig().public.apiBase;
  const uri = `MediaState/GetMediaState`;
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
    if (newValue?.played != oldValue?.played) {
      newValue?.played ? videoRef.value.play() : videoRef.value.pause();
    }
    // if (newValue != oldValue) {
    //   setTimeout(() => {
    //     videoRef.value.muted = newValue?.muted;
    //     console.log("静音播放更改了");
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
      justify-content: center;
      border-radius: 30px;
      height: 100%;
    "
  >
    <div
      style="display: flex; flex-direction: column; height: 100%; width: 80%"
    >
      <div
        style="
          text-align: center;
          background: linear-gradient(135deg, #c850c0, #4158d0);
          color: white;
          font-size: 40px;
          margin: 2px;
          padding: 2px;
        "
      >
        同日集团
      </div>
      <div
        style="
          text-align: center;
          color: #1e32dc;
          font-size: 25px;
          padding-top: 6px;
          padding-bottom: 6px;
          font-weight: bold;
        "
      >
        同日中国-智能板块
      </div>
      <div class="div-class">
        <div style="display: flex; justify-content: space-around">
          <div style="display: flex; justify-content: space-around">
            <div></div>
            <div
              style="
                width: 200px;
                border-radius: 5px;
                background: linear-gradient(
                  135deg,
                  #ff00cc,
                  #ffcc00,
                  #00ffcc,
                  #ff0066
                );
                color: black; /* 字体颜色为白色 */
                writing-mode: vertical-lr; /* 字竖着排列 */
                text-orientation: upright; /* 保持文字正向 */
                padding: 5px;
                text-align: center;
                flex-basis: 20%;
                box-shadow: 5px 5px 5px #191818;
                letter-spacing: 10px;
                font-size: 18px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                font-weight: bold;
              "
            >
              华东区
            </div>
            <div></div>
          </div>

          <div style="display: flex; flex-direction: column; flex-basis: 30%">
            <div class="div-class2">昆山同日工业自动化</div>
            <div class="div-class2">昆山同日机器人智能</div>
            <div class="div-class2">同日交大研究院</div>
          </div>
          <div style="display: flex; flex-direction: column; flex-basis: 30%">
            <div class="div-class2">同日云联</div>
            <div class="div-class2">同日智能技术(agv)</div>
          </div>
        </div>
        <hr style="width: 100%" />
        <div style="display: flex; justify-content: space-around">
          <div style="display: flex; flex-direction: column; flex-basis: 20%">
            <div class="div-class3">华北区</div>
            <div class="div-class3">华中区</div>
          </div>
          <div style="display: flex; flex-direction: column; flex-basis: 30%">
            <div class="div-class2">青岛孚鼎泰</div>
            <div class="div-class2">安徽同日智能技术</div>
          </div>
          <div style="display: flex; flex-direction: column; flex-basis: 30%">
            <div class="div-class3">西南区</div>
            <div class="div-class2">成都同日晟川工业</div>
          </div>
        </div>
      </div>
      <div
        style="
          text-align: center;
          color: #1e32dc;
          font-size: 25px;
          padding-top: 6px;
          padding-bottom: 6px;
          font-weight: bold;
        "
      >
        同日新加坡·自动化设备
      </div>
      <div style="display: flex; flex-direction: column" class="div-class">
        <div style="display: flex; justify-content: space-around">
          <div class="div-class3" style="flex-basis: 20%">新加坡</div>
          <div class="div-class2" style="flex-basis: 30%">SINGAPORE PTE</div>
          <div style="flex-basis: 30%; margin: 10px"></div>
        </div>
        <div style="display: flex; justify-content: space-around">
          <div class="div-class3" style="flex-basis: 20%">深圳</div>
          <div class="div-class2" style="flex-basis: 30%">
            同日工业自动化深圳
          </div>
          <div style="flex-basis: 30%; margin: 10px"></div>
        </div>
        <div style="display: flex; justify-content: space-around">
          <div class="div-class3" style="flex-basis: 20%">青岛</div>
          <div class="div-class2" style="flex-basis: 30%">青岛同日智能技术</div>
          <div class="div-class2" style="flex-basis: 30%">青岛同日机电</div>
        </div>
      </div>
      <div
        style="
          text-align: center;
          color: #1e32dc;
          font-size: 25px;
          padding-top: 6px;
          padding-bottom: 6px;
          font-weight: bold;
        "
      >
        同日中国·农业板块
      </div>
      <div style="display: flex; flex-direction: column" class="div-class">
        <div style="display: flex; justify-content: space-around">
          <div class="div-class3" style="flex-basis: 20%">商贸</div>
          <div class="div-class2" style="flex-basis: 30%">青岛同日商贸</div>
          <div style="flex-basis: 30%; margin: 10px"></div>
        </div>
        <div style="display: flex; justify-content: space-around">
          <div class="div-class3" style="flex-basis: 20%">食品</div>
          <div class="div-class2" style="flex-basis: 30%">青岛同日食品</div>
          <div style="flex-basis: 30%; margin: 10px"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="bgcolor" v-else>
    <div v-if="isVideo">
      <video
        :src="playPath"
        class="video"
        autoplay
        playsinline
        muted
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
          height: 94vh;
        "
      >
        识别到{{ state?.currentSrc }}
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
.div-class {
  background: linear-gradient(
    135deg,
    #c7e9fb,
    #a6defa,
    #80d4f9,
    #5bc9f8,
    #35bef7
  );
  border-radius: 5% 5% 0 0;
  /* 上左、上右的边角是椭圆形，下左、下右保持默认 */
  height: auto;
  padding: 5px;
}
.div-class2 {
  padding: 5px;
  margin: 8px;
  background: linear-gradient(135deg, #c850c0, #4158d0);
  color: rgb(255, 255, 255);
  text-align: center;
  border-radius: 5px;
  font-size: 20px;
}
.div-class3 {
  padding: 5px;
  margin: 8px;
  background-color: #21c2e4;
  background: linear-gradient(135deg, #ff00cc, #ffcc00, #00ffcc, #ff0066);
  text-align: center;
  box-shadow: 5px 5px 5px #191818;
  letter-spacing: 10px;
  font-size: 20px;
  border-radius: 5px;
  font-weight: bold;
}
</style>
