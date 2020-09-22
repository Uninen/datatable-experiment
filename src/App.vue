<template>
  <div class="justify-center flex-1">
    <div v-if="!isLoading" class="container pt-8 pb-8 mx-auto">
      <data-table-filter></data-table-filter>

      <div class="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
        <data-table class="w-full divide-y divide-gray-200" :data="artistList">
          <table-head class="rounded-t-md">
            <th-item>Name</th-item>
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
              <svg
                v-if="item.isVip"
                class="w-5 h-5 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </td-item>
            <td-item class="px-6">{{ formatDate(item.created) }}</td-item>
            <td-item class="px-6">
              <button class="flex items-center leading-5 text-indigo-700">Edit</button>
            </td-item>
          </table-row>
        </data-table>
        <table-pagination :pagination="pagination" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import dayjs from 'dayjs'

import DataTable from './components/datatable/DataTable.vue'
import DataTableFilter from './components/datatable/DataTableFilter.vue'
import TableHead from './components/datatable/TableHead.vue'
import TableRow from './components/datatable/TableRow.vue'
import TablePagination from './components/datatable/TablePagination.vue'
import ThItem from './components/datatable/ThItem.vue'
import TdItem from './components/datatable/TdItem.vue'

import { api } from './utils/api'
import { paginate } from './utils'
import { PaginationObject } from './utils'

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
    const isLoading = ref(true)
    const artistList = ref([])
    const artistsCount = ref(0)
    const perPage = ref(30)
    const currentPage = ref(1)
    const pagination = ref<PaginationObject>()

    const formatDate = (dateStr: string): string => {
      return dayjs(dateStr).format('MMMM D, YYYY')
    }

    api.get(`/artists?page=${currentPage}&limit=${perPage}`).then((response) => {
      artistList.value = response.data.results
      artistsCount.value = response.data.count
      pagination.value = paginate(artistsCount.value, currentPage.value, perPage.value)
      isLoading.value = false
    })

    return {
      isLoading,
      formatDate,
      artistList,
      pagination,
    }
  },
})
</script>
