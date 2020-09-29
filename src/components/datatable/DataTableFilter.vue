<template>
  <teleport to="#datatable-filters">
    <div class="mx-4 mb-4 sm:mx-0 sm:mb-6">
      <label for="email" class="block text-sm font-bold leading-5 text-gray-600">Search</label>
      <div class="flex mt-1 rounded-md shadow-sm">
        <div class="relative flex-grow focus-within:z-10">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <!-- Heroicon name: users -->
            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            id="search"
            name="datatable-search"
            v-model="searchTerm"
            class="block w-full pl-10 transition duration-150 ease-in-out rounded-md form-input sm:text-sm sm:leading-5"
            @input="search"
          />
        </div>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, inject, ref, watchEffect } from 'vue'
import { Emitter } from 'mitt'
import { debounce } from 'lodash-es'

export default defineComponent({
  setup() {
    const tableId = inject('tableId') as string
    const bus = inject('bus') as Emitter

    const searchTerm = ref<string>('')

    function searchTermChange() {
      console.log('searchterm changed to: ', searchTerm.value)
      if (searchTerm.value.length !== 1) {
        console.log('emitting search')
        bus.emit(`search-${tableId}`, searchTerm.value)
      }
    }

    const search = debounce(
      function (inputEvent) {
        searchTermChange()
      },
      300,
      {
        maxWait: 500,
      }
    )

    watchEffect(() => {
      if (searchTerm.value.length === 0 || searchTerm.value.length === 2) {
        search.flush()
      }
    })

    return {
      searchTerm,
      search,
    }
  },
})
</script>
