<template>
  <div class="contentContainer">
    <div class="contentsTitle">
      <el-link :href="contentLink" target="_blank" type="primary" :icon="Link" class="title">
        <span>{{ contentTitle }}</span>
      </el-link>
      <div class="expandOrFold">
        <el-button type="primary" @click="handleFullScreen" plain :icon="FullScreen" size="small" circle />
      </div>
    </div>
    <el-scrollbar style="flex: 1">
      <div class="contentsInfo"></div>
    </el-scrollbar>

  <el-dialog
    v-model="dialogVisible"
    fullscreen
  >
  <template #header>
    <el-link :href="contentLink" target="_blank" type="primary" :icon="Link" class="fullScreenTitle">{{ contentTitle }}</el-link>
  </template>
    <div class="contentFullScreen"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="success" @click="dialogVisible = false"
          >关闭</el-button
        >
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref,watch} from "vue"
import { FullScreen, Link } from "@element-plus/icons-vue";
import x2js from 'x2js'
import emitter from '../../utils/mybus.js';

const rssParser = new x2js(); //实例

let contentTitle = ref("")
let contentLink = ref("")

let contentDescription = ref()

emitter.on("content",(val:any) => {
  // console.log(val)
  contentTitle.value = val.title
  contentLink.value = val.link
  contentDescription.value = val.description

  let parentNode = document.querySelector('.contentsInfo')

  parentNode!.innerHTML = rssParser.xml2dom(contentDescription.value).childNodes

  for(let i = 0;i < rssParser.xml2dom(contentDescription.value).childNodes.length; i++){
    if(parentNode!.childNodes[i].align === 'center'){
      parentNode!.childNodes[i].style.textIndent = '0em'
      // console.log(parentNode!.childNodes[i])
    }
  }

})

let dialogVisible = ref(false)

const handleFullScreen = () => {
  dialogVisible.value = true
  
  nextTick(() => {
    let parentNode = document.querySelector('.contentFullScreen')

     parentNode!.innerHTML = rssParser.xml2dom(contentDescription.value)

    for(let i = 0;i < rssParser.xml2dom(contentDescription.value).childNodes.length; i++){
      if(parentNode!.childNodes[i].align === 'center'){
        parentNode!.childNodes[i].style.textIndent = '0em'
        // console.log(parentNode!.childNodes[i])
      }
    }
  })
}

</script>

<style scoped lang="scss">
.contentContainer{
  max-width: 60%;
  min-width:60%;
  width: 60%;
  display: flex;
  flex-direction: column;
  margin: 20px;
  // flex:2;
  // transition: 2s;
  background: #fff;
  border: 1px solid white;
  border-radius: 7px;
  box-shadow: 0px 0px 10px 0px rgba(212, 212, 221, 0.75);
  -webkit-box-shadow: 0px 0px 10px 0px rgba(212, 212, 221, 0.75);
  -moz-box-shadow: 0px 0px 10px 0px rgba(212, 212, 221, 0.75);

  overflow-y: scroll;
    /* 隐藏滚动条 */
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */

  .contentsTitle{
    // position: fixed;
    padding: 10px;
    border-bottom: 1px solid #e4e7ec;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title{
      span{
        font-size: 18px;
        // color: #777ab8;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        font-weight: 400;
      }
    }
  }

  .contentsInfo{
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: center;
    flex: 1;
    margin: 5%;
    color: #606266;
    overflow: scroll;
    /* 隐藏滚动条 */
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */

    :deep img{
      max-width: 90%;
      max-height: 90%;
      margin: 10px;
      border-radius: 7px;
      object-fit: cover;
    }

    :deep h1,:deep h2, :deep h3,:deep h4,:deep h5{
      margin: 20px 0;
    }

    :deep #text{
      margin: 20px 0;
    }

    :deep p,:deep blockquote{
      text-indent: 2em;
      margin: 10px 0;
    }

    :deep ul{
      list-style-position:inside;
      list-style-type: decimal !important;
    }

    :deep li{
      margin: 10px 0;
      padding: 10px;
      border-radius: 7px;
      background-color: #eee;
    }

    :deep li::marker{
      font-weight: 500;
    }

    :deep table{
      border: 2px solid #eee;
      border-radius: 7px;
      border-collapse:collapse;

      th,td{
        border-right: 2px solid #eee;
        border-bottom: 2px solid #eee;
      }

      th:last-child,td:last-child{
        border-right: 0;
      }

      td{
        text-align: center;
      }

      tr:last-child{
        td{
          border-bottom: 0;
        }
      }
    }

    :deep a{
      // text-decoration: none;
      text-align: center;
      color: #000;
      font-weight: 500;

      img{
        margin: 0 auto;
        display: block;
      }

      span{
        font-size: 12px;
      }
    }

    :deep figure{
      text-align: center;
      img{
        margin:0 auto;
      }
    }

    :deep pre{
      padding: 20px;
      border-radius: 7px;
      background-color: #eee;

      code{
        padding: 0px;
        border-radius: 0px;
      }
    }

    :deep code{
      background-color: #eee;
      padding: 3px;
      border-radius: 7px;
    }
  }
  .contentsInfo::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }

  :deep .contentsInfo>img{
    max-width: 100%;
    max-height: 100%;
    margin: 0;
    border-radius: 7px;
    object-fit: cover;
  }
}

.contentContainer::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }

.contentFullScreen{
  margin: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;

  :deep img{
    max-width: 80%;
    max-height: 80%;
    margin: 10px;
    border-radius: 7px;
    object-fit: cover;
  }
  :deep h1,:deep h2, :deep h3,:deep h4,:deep h5{
    margin: 20px 0;
  }

  :deep #text{
    margin: 20px 0;
  }

  :deep p,:deep blockquote{
    text-indent: 2em;
    font-size: 18px;
    margin: 10px 0;
  }

  :deep ul{
    list-style-position:inside;
    list-style-type: decimal !important;
  }

  :deep li{
    margin: 10px 0;
    padding: 10px;
    border-radius: 7px;
    background-color: #eee;
  }

  :deep li::marker{
    font-weight: 500;
  }

  :deep table{
    border: 2px solid #eee;
    border-radius: 7px;
    border-collapse:collapse;

    th,td{
      border-right: 2px solid #eee;
      border-bottom: 2px solid #eee;
    }

    th:last-child,td:last-child{
      border-right: 0;
    }

    td{
      text-align: center;
    }

    tr:last-child{
      td{
        border-bottom: 0;
      }
    }
  }

  :deep a{
    // text-decoration: none;
    text-align: center;
    color: #000;
    font-weight: 500;

    img{
      margin: 0 auto;
      display: block;
    }

    span{
      font-size: 12px;
    }
  }

  :deep figure{
    text-align: center;
    img{
      margin:0 auto;
    }
  }

  :deep pre{
    padding: 20px;
    border-radius: 7px;
    background-color: #eee;

    code{
      padding: 0px;
      border-radius: 0px;
    }
  }

  :deep code{
    background-color: #eee;
    padding: 3px;
    border-radius: 7px;
  }
}

:deep .contentFullScreen>img{
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  border-radius: 7px;
  object-fit: cover;
}

.fullScreenTitle{
    font-size: 18px;
}
</style>
