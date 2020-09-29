<template>
  <div>
    <data-table
      v-if="artistList.length > 0"
      :data="artistList"
      :items-per-page="15"
      id="artists-table"
      class="overflow-hidden border-b border-collapse border-gray-900 divide-y divide-gray-800 shadow-dark sm:rounded-lg"
    >
      <template #loader>
        <div class="p-4 text-base bg-gray-800">Loading data...</div>
      </template>
      <table-head class="rounded-t-md">
        <th-item
          class="items-center px-1 py-3 pl-4 text-sm font-medium leading-4 tracking-wider text-left text-gray-400 uppercase select-none bg-dark-400 sm:px-3 md:px-6"
          order-key="name"
          id="sortby-name"
          >Name</th-item
        >
        <th-item
          class="items-center px-1 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-400 uppercase select-none bg-dark-400 sm:px-3 md:px-6"
          :hidden-below="2"
          >Subscription</th-item
        >
        <th-item
          class="items-center py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-400 uppercase select-none bg-dark-400 sm:px-3 md:px-6"
          >VIP</th-item
        >
        <th-item
          class="items-center py-3 pl-2 text-sm font-medium leading-4 tracking-wider text-left text-gray-400 uppercase select-none bg-dark-400 sm:px-3 md:px-6"
          order-key="created"
          id="sortby-created"
          >Created</th-item
        >
        <th-item
          class="items-center px-1 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-400 uppercase select-none bg-dark-400 sm:px-3 md:px-6"
          >&nbsp;</th-item
        >
      </table-head>

      <table-row
        class="items-center text-sm text-gray-400 divide-y divide-dark-400 md:text-base"
        v-slot="{ item, formatDate }"
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
        <td-item class="px-0 pl-2 sm:px-3 md:px-6">{{ formatDate(item.created) }}</td-item>
        <td-item class="px-2 sm:px-6">
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import DataTable from '../components/datatable/DataTable.vue'
import TableHead from '../components/datatable/TableHead.vue'
import TableRow from '../components/datatable/TableRow.vue'
import TablePagination from '../components/datatable/TablePagination.vue'
import ThItem from '../components/datatable/ThItem.vue'
import TdItem from '../components/datatable/TdItem.vue'
import { formatDate } from '../components/datatable/utils'

import artists from '../utils/fixtures/artists.mirage.db.json'

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
    const artistList: any = artists.artists
    console.log('artists: ', artists)

    return {
      artistList,
      formatDate,
    }
  },
})
</script>
