<template>
  <div>
    <div id="datatable-filters"></div>

    <data-table
      :axios-instance="api"
      :filter-options="filterOptions"
      :items-per-page="perPage"
      data-model="artists"
      id="artists-table"
      class="overflow-hidden border-b border-gray-200 divide-y divide-gray-200 shadow sm:rounded-lg"
    >
      <template #filters></template>
      <template #loader>
        <div class="p-4 text-base bg-gray-200">Loading data...</div>
      </template>
      <table-head class="rounded-t-md">
        <th-item
          class="items-center px-1 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200 select-none sm:px-3 md:px-6"
          order-key="name"
          >Name</th-item
        >
        <th-item
          class="items-center px-1 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200 select-none sm:px-3 md:px-6"
          :hidden-below="2"
          >Subscription</th-item
        >
        <th-item
          class="items-center px-1 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200 select-none sm:px-3 md:px-6"
          >VIP</th-item
        >
        <th-item
          class="items-center px-1 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200 select-none sm:px-3 md:px-6"
          order-key="created"
          >Created</th-item
        >
        <th-item
          class="items-center px-1 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200 select-none sm:px-3 md:px-6"
          >&nbsp;</th-item
        >
      </table-head>

      <table-row
        class="text-xs text-gray-700 divide-y divide-gray-200 sm:text-base"
        v-slot="{ item }"
      >
        <td-item class="py-1">
          <div class="flex items-center sm:px-6">
            <img class="w-10 h-10 rounded-full" :src="item.photo" alt="" />
            <div class="ml-2">
              <span class="block text-sm sm:text-base">{{ item.name }}</span>
              <span class="block text-gray-500 sm:text-sm">@{{ item.username }}</span>
            </div>
          </div>
        </td-item>
        <td-item :hidden-below="2" class="sm:px-6">
          {{ item.subscriptionType }}
        </td-item>
        <td-item class="sm:px-3 md:px-6">
          <t-icon v-if="item.isVip" name="badge-check" class="w-5 h-5 text-indigo-600" />
        </td-item>
        <td-item class="px-6">{{ formatDate(item.created) }}</td-item>
        <td-item class="px-6">
          <button class="flex items-center hidden leading-5 text-indigo-700 sm:block">Edit</button>
          <button class="flex items-center block leading-5 text-gray-400 sm:hidden">
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
    </data-table>

    <teleport to="#download-button">
      <button
        class="px-2 py-1 text-sm text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm"
        type="button"
        @click="downloadMirageJson"
      >
        Download Mirage DB
      </button>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import dayjs from 'dayjs'
import axios from 'axios'

import DataTable from '../components/datatable/DataTable.vue'
import TableHead from '../components/datatable/TableHead.vue'
import TableRow from '../components/datatable/TableRow.vue'
import TablePagination from '../components/datatable/TablePagination.vue'
import ThItem from '../components/datatable/ThItem.vue'
import TdItem from '../components/datatable/TdItem.vue'

import { downloadMirageJson } from '../utils/mirage-dev-server'

export default defineComponent({
  components: {
    DataTable,
    TableHead,
    ThItem,
    TdItem,
    TableRow,
    TablePagination,
  },

  setup() {
    const loadingDone = ref(true)
    const isFetchingData = ref(true)
    const artistList = ref([])
    const perPage = ref(12)
    const currentPage = ref(1)
    const ordering = ref('')
    const filterOptions = {
      search: ['name', 'username'],
      filters: {
        isVip: {
          type: Boolean,
          name: 'VIP',
        },
      },
    }

    const api = axios.create({
      baseURL: '/api',
    })

    const formatDate = (dateStr: string): string => {
      return dayjs(dateStr).format('MMMM D, YYYY')
    }

    function changePage(value: number) {
      currentPage.value = value
    }

    function changeOrdering(value: string) {
      ordering.value = value
    }

    return {
      loadingDone,
      changeOrdering,
      changePage,
      isFetchingData,
      formatDate,
      artistList,
      api,
      downloadMirageJson,
      filterOptions,
      perPage,
    }
  },
})
</script>
