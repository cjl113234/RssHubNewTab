<template>
  <div class="feedContainer"  v-loading="loading" element-loading-text="这取决于您连接到部署地址的速度...">
    <div class="feedTitle">
      <span class="title">{{ feedTitle }}</span>
      <div class="expandOrFold">
        <el-button type="danger" @click="handleExpandOrFold" plain :icon="Close" size="small" circle />
      </div>
    </div>
    <el-scrollbar>
      <div class="feedInfo">
        <div v-for="item in feedInfo" @click="handlefeedItemClick(item)" class="feedItem">
          <p>{{ item.title }}</p>
          <p v-if="item.pubDate">{{ moment(item.pubDate).format('YYYY-MM-DD hh:mm') }}</p>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import x2js from 'x2js'
import emitter from '../../utils/mybus.js';
import moment from 'moment'
import { Close } from "@element-plus/icons-vue";

const emits = defineEmits(['feedShow']);

const rssParser = new x2js(); //实例

let feedInfo = ref([])
let feedTitle = ref("")

const loading = ref(true)

emitter.on("loading",(val:any) => {
  loading.value = val
})

emitter.on("feedInfo",(val:any) => {
  console.log(val)
  // console.log(rssParser.xml2js(val).rss.channel)
  feedTitle.value = rssParser.xml2js(val).rss.channel.title
  feedInfo.value = rssParser.xml2js(val).rss.channel.item
  // if(rssParser.xml2js(val).rss.channel.lastBuildDate) feedTime.value = moment(rssParser.xml2js(val).rss.channel.lastBuildDate).format("YYYY-MM-DD hh:mm:ss")
  loading.value = false
})


emitter.on("error",(val:boolean) => {
  handleExpandOrFold()
})


const handleExpandOrFold = () => {
  let feedContainer =  document.querySelector('.feedContainer')
  let subScribeContainer = document.querySelector('.subScribeContainer')
  subScribeContainer!.style.borderRadius="7px";
  subScribeContainer!.style.boxShadow = "0px 0px 10px 0px rgba(212, 212, 221, 0.75);";
  feedContainer!.style.maxWidth='0%';
  feedContainer!.style.minWidth='0%';
  feedContainer!.style.boxShadow='none';
  emits('feedShow',false)
  emitter.off("feedInfo")
}

const handlefeedItemClick = (item:any) => {
  // console.log(item)
  emitter.emit('content',item)
  
}

</script>

<style scoped lang="scss">
.feedContainer{
  max-width: 25%;
  min-width: 20%;
  margin: 20px 20px 20px 0;
  // flex:1;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  background: #fff;
  border: 1px solid white;
  border-radius: 0px 7px 7px 0px;
  box-shadow: 0px 0px 10px 0px rgba(212, 212, 221, 0.75);
  -webkit-box-shadow: 0px 0px 10px 0px rgba(212, 212, 221, 0.75);
  -moz-box-shadow: 0px 0px 10px 0px rgba(212, 212, 221, 0.75);
  /* 隐藏滚动条 */
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  z-index: 1;
  // transition: 1.5s;

  .feedTitle{
    // position: fixed;
    padding: 10px;
    border-bottom: 1px solid #e4e7ec;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title{
      font-size: 18px;
      font-weight: 500;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      white-space: normal !important;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      font-weight: 400;
      // color: #777ab8;
    }
  }

  .feedInfo{
    overflow: scroll;
    flex: 1;
    /* 隐藏滚动条 */
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */

    .feedItem{
      // width: 100%;
      height: 10%;
      margin: 10px;
      padding: 10px;
      transition: 0.5s;
      border: 1px solid #eee;
      border-radius: 7px;
      cursor: pointer;

      p{
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-weight: 400;
      }
    }

    .feedItem:hover{
      background-color: #eee;
    }
  }

  .feedInfo::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}

.feedContainer::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
