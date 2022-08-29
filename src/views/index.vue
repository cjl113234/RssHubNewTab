<template>
  <div class="globalContainer">
    <SearchBar class="search" />
    <div class="cardContainer">
      <!-- <SubscribeCard /> -->
      <SubscribeCard @feedShow="handleFeedShow" />
      <transition-group
        enter-active-class="animate__animated animate__slideInLeft"
        leave-active-class="animate__animated animate__slideOutLeft"
      >
        <FeedCard v-if="feedShow" @feedShow="handleFeedShow" />
        <ContentCard v-if="feedShow" />
      </transition-group>

    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SearchBar from '../components/SearchBar/index.vue'
import ContentCard from '../components/ContentCard/index.vue'
import SubscribeCard from '../components/SubScribeCard/index.vue'

let feedShow = ref(false)

const handleFeedShow = (show:boolean) => {
  feedShow.value = show
}

</script>

<style scoped lang="scss">
.globalContainer{
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f4f5f7;
  .search{
    margin-top: 100px;
  }

  .cardContainer{
    width: 100%;
    height: 300px;
    margin: 20px;
    flex: 1;
    display: flex;
    // justify-content: space-between;
    overflow: hidden;
  }
}
</style>
