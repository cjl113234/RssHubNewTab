<template>
  <div class="searchbar">
    <div class="searchbar-wrapper">
        <div class="searchbar-left">
            <div class="search-icon-wrapper">
                <el-popover
                  popper-class="searchEngienPopover"
                  :width="180"
                  trigger="hover"
                >
                  <template #reference>
                    <el-avatar :src="logo"/>
                  </template>
                  <template #default>
                    <div class="searchEngineList">
                      <p  @click="handleChangeSearchEngine('GoogleLogo','https://www.google.com/search?q=')"><img :src="GoogleLogo" alt="Google">Google</p>
                      <p @click="handleChangeSearchEngine('BingLogo','https://cn.bing.com/search?q=')"><img :src="BingLogo" alt="Google">必应</p>
                      <p @click="handleChangeSearchEngine('DuckDuckGoLogo','https://duckduckgo.com/?q=')"><img :src="DuckDuckGoLogo" alt="Google">DuckDuckGo</p>
                      <p @click="handleChangeSearchEngine('BaiduLogo','https://www.baidu.com/s?wd=')"><img :src="BaiduLogo" alt="Google">百度</p>
                    </div>
                  </template>
                </el-popover>
            </div>
        </div>

        <div class="searchbar-center">
            <div class="searchbar-input-spacer"></div>

            <input type="text" v-model="searchContent"  @keyup.enter="search()" class="searchbar-input" maxlength="2048" autocapitalize="off" autocomplete="off" placeholder="搜索">
        </div>

        <div class="searchbar-right" @click="search()">
            <div class="search-icon-wrapper">
                <span class="search-icon searchbar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">
                        </path>
                    </svg>
                </span>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import GoogleLogo from '../../assets/image/googleLogo.png'
import BingLogo from '../../assets/image/bingLogo.png'
import DuckDuckGoLogo from '../../assets/image/duckDuckGoLogo.png'
import BaiduLogo from '../../assets/image/baiduLogo.png'

if(!window.localStorage.getItem('searchEngine')) window.localStorage.setItem('searchEngine','googleLogo')
if(!window.localStorage.getItem('searchLink')) window.localStorage.setItem('searchLink','https://www.google.com/search?q=')

let logo = ref("/src/assets/image/" +  window.localStorage.getItem("searchEngine") + ".png")

let searchContent = ref("")

const handleChangeSearchEngine = (searchEngine:string,searchLink:string) => {
  logo.value = "/src/assets/image/" + searchEngine + ".png"
  let searchEngienPopover = document.querySelector(".searchEngienPopover")
  searchEngienPopover?.style.setProperty("display","none")
  window.localStorage.setItem("searchEngine",searchEngine)
  window.localStorage.setItem("searchLink",searchLink)
}

const search = () => {
  if(searchContent.value.trim() == "") return
  else window.open(window.localStorage.getItem("searchLink") + searchContent.value, "_blank");
}

</script>

<style scoped lang="scss">
.searchbar {
  font-size: 14px;
  font-family: arial, sans-serif;
  color: #202124;
  display: flex;
  z-index: 3;
  height: 44px;
  background: white;
  border: 1px solid #dfe1e5;
  box-shadow: none;
  border-radius: 24px;
  margin: 0 auto;
  width: 300px;
  max-width: 600px;
  transition: 0.5s;
  z-index: 0;

  .searchbar-wrapper {
    flex: 1;
    display: flex;
    padding: 5px 9px 0 5px;

    .searchbar-left {
      font-size: 14px;
      font-family: arial, sans-serif;
      color: #202124;
      display: flex;
      align-items: center;
      padding-right: 5px;
      margin-top: -5px;
    }

    .searchbar-center {
      display: flex;
      flex: 1;
      flex-wrap: wrap;

      .searchbar-input-spacer {
        color: transparent;
        flex: 100%;
        white-space: pre;
        height: 34px;
        font-size: 16px;
      }

      .searchbar-input {
        background-color: transparent;
        border: none;
        margin: 0;
        padding: 0;
        color: rgba(0, 0, 0, .87);
        word-wrap: break-word;
        outline: none;
        display: flex;
        flex: 100%;
        margin-top: -37px;
        height: 34px;
        font-size: 16px;
        max-width: 100%;
        width: 100%;
      }
    }

    .searchbar-right {
      display: flex;
      flex: 0 0 auto;
      margin-top: -5px;
      align-items: stretch;
      flex-direction: row;
      cursor: pointer;

      .search-icon {
        margin-top: 3px;
        color: #9aa0a6;
        height: 20px;
        line-height: 20px;
        width: 20px;
      }

      .searchbar-icon {
        display: inline-block;
        fill: currentColor;
        height: 28px;
        line-height: 28px;
        position: relative;
        width: 28px;
      }
    }

    .search-icon-wrapper {
      display: flex;
      margin: auto;

      .el-avatar{
        transition: 0.5s;
        --el-avatar-bg-color:rgba(0,0,0,0);
      }

      .el-avatar:hover{
        box-shadow: 0px 0px 5px 2px rgb(236, 234, 234);
        -webkit-box-shadow: 0px 0px 5px 2px rgb(236, 234, 234);
        -moz-box-shadow: 0px 0px 5px 2px rgb(236, 234, 234);
      }
      ::v-deep .el-avatar>img {
        display: block;
        height: 50%;
      }
    }
  }
}

.searchbar:hover {
  box-shadow: 0 1px 6px rgb(32 33 36 / 28%);
  border-color: rgba(223,225,229,0);
}


.searchEngineList{
  list-style: none;

  p{
    margin: 0;
    padding: 8px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    border-radius: 5px;
    transition: 0.5s;
  }

  p:hover{
    cursor: pointer;
    background-color: rgb(228, 226, 226);
  }

  p img{
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}

</style>
