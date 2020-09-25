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
          <p class="text-sm leading-5 text-gray-700">
            Showing
            <span class="font-medium">{{ pagination.startIndex + 1 }}</span>
            to
            <span class="font-medium">{{ pagination.endIndex + 1 }}</span>
            of
            <span class="font-medium">{{ pagination.totalItems }}</span>
            results
          </p>
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
              {{ page }}
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
import { defineComponent, computed, inject, Ref } from 'vue'
import { PaginationObject } from './types'

export default defineComponent({
  emits: ['pagechange'],
  setup(_, { emit }) {
    const pagination = inject('pagination') as Ref<PaginationObject>

    function changePageTo(page: number) {
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
    }
  },
})
</script>
