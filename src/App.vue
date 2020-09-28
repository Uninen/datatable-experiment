<template>
  <div class="justify-center flex-1">
    <div class="container pt-8 pb-8 mx-auto">
      <data-table-filter v-if="false"></data-table-filter>
      <data-table
        :axios-instance="api"
        class="overflow-hidden border-b border-gray-200 divide-y divide-gray-200 shadow sm:rounded-lg"
      >
        <template #loader>
          <div class="p-4 text-base bg-gray-200">Loading data...</div>
        </template>
        <table-head class="rounded-t-md">
          <th-item order-key="name">Name</th-item>
          <th-item :hidden-below="2">Subscription</th-item>
          <th-item>VIP</th-item>
          <th-item>Created</th-item>
          <th-item>&nbsp;</th-item>
        </table-head>

        <table-row
          class="text-xs text-gray-700 divide-y divide-gray-200 sm:text-base"
          v-slot="{ item }"
        >
          <td-item>
            <div class="flex items-center px-6">
              <img class="w-6 h-6 rounded-full" :src="item.photo" alt="" />
              <span class="ml-2">{{ item.name }}</span>
            </div>
          </td-item>
          <td-item :hidden-below="2" class="px-6">
            {{ item.subscriptionType }}
          </td-item>
          <td-item class="px-6">
            <t-icon v-if="item.isVip" name="badge-check" class="w-5 h-5 text-indigo-600" />
          </td-item>
          <td-item class="px-6">{{ formatDate(item.created) }}</td-item>
          <td-item class="px-6">
            <button class="flex items-center hidden leading-5 text-indigo-700 sm:block">
              Edit
            </button>
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

      <hr class="my-8" />

      <data-table
        class="hidden sm:block"
        v-if="artistList.length > 0"
        :data="artistList"
      ></data-table>

      <hr class="my-8" />

      <p>
        <button
          class="px-3 py-2 text-sm text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-md"
          type="button"
          @click="downloadMirageJson"
        >
          Download Mirage DB
        </button>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount } from 'vue'

import dayjs from 'dayjs'
import axios from 'axios'

import DataTable from './components/datatable/DataTable.vue'
import DataTableFilter from './components/datatable/DataTableFilter.vue'
import TableHead from './components/datatable/TableHead.vue'
import TableRow from './components/datatable/TableRow.vue'
import TablePagination from './components/datatable/TablePagination.vue'
import ThItem from './components/datatable/ThItem.vue'
import TdItem from './components/datatable/TdItem.vue'

import { downloadMirageJson } from './utils/mirage-devserver'

export default defineComponent({
  components: {
    DataTable,
    TableHead,
    ThItem,
    TdItem,
    TableRow,
    TablePagination,
    DataTableFilter,
  },

  setup() {
    const loadingDone = ref(true)
    const isFetchingData = ref(true)
    const artistList = ref([])
    const perPage = ref(10)
    const currentPage = ref(1)
    const ordering = ref('')

    const api = axios.create({
      baseURL: '/api',
    })

    function queryData(): void {
      // console.log('queryData', page)
      isFetchingData.value = true
      let url = `/artists?page=${currentPage.value}&limit=${perPage.value}`
      if (ordering.value.length > 0) {
        url += `&ordering=${ordering.value}`
      }
      api.get(url).then((response) => {
        artistList.value = response.data.results
        isFetchingData.value = false
        loadingDone.value = true
      })
    }

    const formatDate = (dateStr: string): string => {
      return dayjs(dateStr).format('MMMM D, YYYY')
    }

    onBeforeMount(() => {
      window.setTimeout(() => {
        queryData()
      }, 1000)
    })

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
    }
  },
})
</script>
