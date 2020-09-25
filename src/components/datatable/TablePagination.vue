<template>
  <slot>
    <div
      class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
      v-if="pagination"
    >
      <div class="flex justify-between flex-1 sm:hidden">
        <a
          href="#"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700"
          v-if="hasPreviousPage"
          @click.prevent="changePageTo(previousPage)"
        >
          Previous
        </a>
        <div v-if="isFetchingData" class="inline-flex items-center text-sm text-gray-700">
          Loading...
        </div>
        <div v-else class="inline-flex items-center text-sm text-gray-700">
          Page {{ pagination.currentPage }}/{{ pagination.totalPages }}
        </div>
        <a
          href="#"
          class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700"
          v-if="hasNextPage"
          @click.prevent="changePageTo(nextPage)"
        >
          Next
        </a>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <div class="text-sm leading-5 text-gray-700">
            Showing
            <span class="font-medium">{{ pagination.startIndex + 1 }}</span>
            to
            <span class="font-medium">{{ pagination.endIndex + 1 }}</span>
            of
            <span class="font-medium">{{ pagination.totalItems }}</span>
            results
          </div>
        </div>
        <div>
          <nav class="relative z-0 inline-flex shadow-sm">
            <a
              href="#"
              class="relative inline-flex items-center px-2 py-2 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-l-md hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500"
              aria-label="Previous"
              v-if="hasPreviousPage"
              @click.prevent="changePageTo(previousPage)"
            >
              <!-- Heroicon name: chevron-left -->
              <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              class="relative inline-flex items-center px-4 py-2 -ml-px text-sm leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
              v-for="page in pagination.pages"
              :key="page"
              :class="{
                'font-medium': page !== pagination.currentPage,
                'font-bold': page === pagination.currentPage,
              }"
              @click.prevent="changePageTo(page)"
            >
              <svg
                v-if="isFetchingData && page === currentPage"
                class="inline-block w-3 h-3 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clip-rule="evenodd"
                />
              </svg>
              <template v-else>
                <span class="inline-block w-3 text-center">{{ page }}</span>
              </template>
            </a>

            <span
              class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-700 bg-white border border-gray-300"
              v-if="false"
            >
              ...
            </span>

            <a
              href="#"
              class="relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-r-md hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500"
              aria-label="Next"
              v-if="hasNextPage"
              @click.prevent="changePageTo(nextPage)"
            >
              <!-- Heroicon name: chevron-right -->
              <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </div>
  </slot>
</template>
<script lang="ts">
import { defineComponent, computed, inject, Ref, ref } from 'vue'
import { PaginationObject } from './types'

export default defineComponent({
  emits: ['pagechange'],
  setup(_, { emit }) {
    const currentPage = ref(1)
    const pagination = inject('pagination') as Ref<PaginationObject>
    const isFetchingData = inject('isFetchingData') as Ref<boolean>

    function changePageTo(page: number) {
      currentPage.value = page
      emit('pagechange', page)
    }

    const hasPreviousPage = computed(() => {
      return pagination.value.currentPage > 1
    })

    const hasNextPage = computed(() => {
      return pagination.value.currentPage < pagination.value.totalPages
    })

    const previousPage = computed(() => {
      return pagination.value.currentPage - 1
    })

    const nextPage = computed(() => {
      return pagination.value.currentPage + 1
    })

    return {
      pagination,
      previousPage,
      nextPage,
      hasPreviousPage,
      hasNextPage,
      changePageTo,
      isFetchingData,
      currentPage,
    }
  },
})
</script>
