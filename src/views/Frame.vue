<template>
  <div
    class="justify-center flex-1 overflow-y-scroll"
    :class="{
      'bg-dark-700': $route.path === '/remote/',
    }"
  >
    <div
      class="w-full px-2 py-2 mb-8 text-blue-100 bg-gradient-to-b from-blue-600 via-blue-800 to-dark-800 sm:py-6 sm:px-8"
    >
      <div class="flex items-center justify-center pb-2 sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Datatable experiment</h1>
          <nav class="flex items-center h-8 space-x-2 text-sm sm:text-base">
            <router-link to="/">Local data</router-link> <span>|</span>
            <router-link to="/remote/">Remote data</router-link>
            <span class="hidden sm:block">|</span>
            <router-link to="/unstyled/" class="hidden sm:block">No markup</router-link>
          </nav>
        </div>
        <div id="download-button" class="hidden md:block"></div>
      </div>
    </div>
    <div class="container pb-8 mx-auto">
      <div class="flex flex-col items-start sm:flex-row">
        <div class="flex-1" id="datatable-filters-left"></div>
        <div class="flex-1" id="datatable-filters-right"></div>
      </div>
      <router-view v-if="isMounted"></router-view>
      <div>
        <div id="data-export"></div>
      </div>
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
