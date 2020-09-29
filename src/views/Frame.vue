<template>
  <div class="justify-center flex-1">
    <div class="container pt-8 pb-8 mx-auto">
      <div class="flex items-center justify-between w-full pb-2 mb-8 border-b border-gray-300">
        <div class="flex items-center h-8 space-x-2">
          <router-link to="/">Remote</router-link> <span>|</span>
          <router-link to="/local/">Local</router-link> <span>|</span>
          <router-link to="/unstyled/">Unstyled</router-link>
        </div>
        <div id="download-button"></div>
      </div>
      <router-view v-if="isMounted"></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      isMounted: false,
    }
  },
  mounted() {
    this.isMounted = true
  },
})
</script>
