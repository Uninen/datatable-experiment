<template>
  <div>
    <data-table
      v-if="localConfig.data.length > 0"
      :config="localConfig"
      id="dark-artists-table"
      class="overflow-hidden border-b border-collapse border-gray-200 divide-y divide-gray-200 shadow sm:rounded-lg"
    >
      <template #loader>
        <div class="p-4 text-base bg-gray-200">Loading data...</div>
      </template>

      <template #default>
        <table-search
          v-slot="{
            updateSearchTerm,
            searchTerm,
            search,
          }"
        >
          <teleport to="#datatable-filters-left">
            <div class="mx-4 mb-4 sm:mx-0 sm:mb-6">
              <label for="email" class="block text-sm font-bold leading-5 text-gray-600"
                >Search</label
              >
              <div class="flex mt-1 rounded-md">
                <div class="relative flex-grow focus-within:z-10">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <t-icon name="search" class="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="datatable-search"
                    :value="searchTerm"
                    class="block w-full pl-10 transition duration-150 ease-in-out rounded-md form-input sm:text-sm sm:leading-5"
                    @keyup="search"
                  />
                </div>
              </div>
            </div>
          </teleport>
        </table-search>

        <table-filter property="isVip" v-slot="{ filter, statusChoices, currentVal, changeFn }">
          <teleport to="#datatable-filters-right">
            <div class="ml-6">
              <h3 class="block text-sm font-bold leading-5 text-gray-600">VIP Status</h3>

              <div class="text-gray-600">
                <div class="flex items-center justify-star">
                  <div class="mr-4" v-for="(choice, index) in statusChoices" :key="index">
                    <div>
                      <label class="inline-flex items-center">
                        <input
                          type="radio"
                          class="text-indigo-600 cursor-pointer form-radio localradio"
                          name="localradio"
                          :value="choice.value"
                          @change="changeFn($event)"
                          :checked="currentVal === choice.value"
                        />
                        <span class="ml-2 cursor-pointer">{{ choice.label }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </teleport>
        </table-filter>

        <table-head class="rounded-t-md">
          <th-item
            class="items-center px-1 py-3 pl-4 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200 select-none sm:px-3 md:px-6"
            order-key="name"
            id="sortby-name"
          >
            <div class="flex items-center justify-between">
              <span>Name</span>
              <th-ordering-icon class="text-gray-400" />
            </div>
          </th-item>
          <th-item
            class="items-center px-1 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200 select-none sm:px-3 md:px-6"
            :hidden-below="2"
            >Subscription</th-item
          >
          <th-item
            class="items-center py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200 select-none sm:px-3 md:px-6"
            >VIP</th-item
          >
          <th-item
            class="items-center py-3 pl-2 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200 select-none sm:px-3 md:px-6"
            order-key="created"
            id="sortby-created"
          >
            <div class="flex items-center justify-between">
              <span>Created</span>
              <th-ordering-icon class="text-gray-500" />
            </div>
          </th-item>
          <th-item
            class="items-center px-1 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200 select-none sm:px-3 md:px-6"
            >&nbsp;</th-item
          >
        </table-head>

        <table-row
          class="items-center text-sm text-gray-700 divide-y divide-gray-200 md:text-base"
          v-slot="{ item, breakpoint }"
        >
          <td-item class="py-1">
            <div class="flex items-center px-1 sm:px-3 md:px-6">
              <img class="w-10 h-10 rounded-full" :src="item.photo" alt="" />
              <div class="ml-2">
                <span class="block text-sm sm:text-base datatable-name">{{ item.name }}</span>
                <span class="block text-gray-500 sm:text-sm">@{{ item.username }}</span>
              </div>
            </div>
          </td-item>
          <td-item :hidden-below="2" class="sm:px-3 md:px-6">
            {{ item.subscriptionType }}
          </td-item>
          <td-item class="px-0 sm:px-3 md:px-6">
            <div class="sm:flex sm:items-center sm:flex-1">
              <t-icon v-if="item.isVip" name="badge-check" class="w-5 h-5 text-indigo-600" />
            </div>
          </td-item>
          <td-item class="px-0 pl-2 sm:px-3 md:px-6">{{
            responsiveDate(breakpoint, item.created)
          }}</td-item>
          <td-item class="px-2 sm:px-6">
            <button class="items-center hidden leading-5 text-indigo-700 sm:flex">Edit</button>
            <button class="flex items-center leading-5 text-gray-400 sm:hidden">
              <svg
                class="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </td-item>
        </table-row>
      </template>

      <template #pagination>
        <table-pagination
          v-slot="{
            hasPreviousPage,
            changePageTo,
            previousPage,
            isFetchingData,
            pagination,
            hasNextPage,
            nextPage,
            pageList,
            currentPage,
          }"
          ><div
            class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
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
                <div v-if="pagination.totalItems > 0" class="text-sm leading-5">
                  Showing
                  <span class="font-medium">{{ pagination.startIndex + 1 }}</span>
                  to
                  <span class="font-medium">{{ pagination.endIndex + 1 }}</span>
                  of
                  <span class="font-medium">{{ pagination.totalItems }}</span>
                  results
                </div>
                <div v-else>No results found.</div>
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
                    v-for="page in pageList"
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
            </div></div
        ></table-pagination>
      </template>
    </data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import DataTable from '../components/datatable/DataTable.vue'
import TableHead from '../components/datatable/TableHead.vue'
import TableRow from '../components/datatable/TableRow.vue'
import TablePagination from '../components/datatable/TablePagination.vue'
import TableSearch from '../components/datatable/TableSearch.vue'
import TableFilter from '../components/datatable/TableFilter.vue'
import ThItem from '../components/datatable/ThItem.vue'
import TdItem from '../components/datatable/TdItem.vue'
import ThOrderingIcon from '../components/datatable/ThOrderingIcon.vue'
import { LocalTableProps } from '../components/datatable/types'
import { responsiveDate } from '../components/datatable/contrib'

import artists from '../mirage/fixtures/artists.mirage.db.json'

export default defineComponent({
  components: {
    DataTable,
    TableHead,
    ThItem,
    TdItem,
    TableRow,
    TablePagination,
    TableSearch,
    TableFilter,
    ThOrderingIcon,
  },

  setup() {
    const localConfig: LocalTableProps = {
      mode: 'local',
      data: artists.artists,
      itemsPerPage: 12,
      searchFields: ['name', 'username'],
      filters: [
        {
          property: 'isVip',
          type: 'boolean',
        },
      ],
    }

    return {
      localConfig,
      responsiveDate,
    }
  },
})
</script>
