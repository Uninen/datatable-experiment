<template>
  <div class="justify-center flex-1">
    <div class="container pt-2 pb-2 mx-auto sm:pt-8 sm:pb-8">
      <div
        class="flex items-center justify-center w-full px-2 pb-2 mb-8 border-b border-gray-300 sm:justify-between"
      >
        <div class="flex items-center h-8 space-x-2 text-sm sm:text-base">
          <router-link to="/">Remote</router-link> <span>|</span>
          <router-link to="/local/">Local</router-link> <span class="hidden sm:block">|</span>
          <router-link to="/unstyled/" class="hidden sm:block">Unstyled</router-link>
        </div>
        <div id="download-button" class="hidden md:block"></div>
      </div>
      <div id="datatable-filters"></div>

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
