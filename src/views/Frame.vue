<template>
  <div
    class="justify-center flex-1 overflow-y-scroll"
    :class="{
      'bg-dark-700': $route.path === '/local/',
    }"
  >
    <div class="container pb-8 mx-auto">
      <div class="w-full px-2 py-2 mb-8 bg-white sm:py-8">
        <div
          class="flex items-center justify-center pb-2 border-b border-gray-300 sm:justify-between"
        >
          <div class="flex items-center h-8 space-x-2 text-sm sm:text-base">
            <router-link to="/">Remote</router-link> <span>|</span>
            <router-link to="/local/">Local</router-link> <span class="hidden sm:block">|</span>
            <router-link to="/unstyled/" class="hidden sm:block">Unstyled</router-link>
          </div>
          <div id="download-button" class="hidden md:block"></div>
        </div>
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
