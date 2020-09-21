<template>
  <div class="justify-center flex-1">
    <div class="container pt-8 mx-auto">
      <div class="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
        <data-table class="w-full divide-y divide-gray-200" :data="artistList">
          <table-head class="rounded-t-md">
            <th-item
              class="px-6 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-600 uppercase bg-gray-100"
              >Name</th-item
            >
            <th-item
              class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-600 uppercase bg-gray-100"
              :hidden-below="2"
              >Subscription</th-item
            >
            <th-item
              class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-600 uppercase bg-gray-100"
              >VIP</th-item
            >
            <th-item
              class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-600 uppercase bg-gray-100"
              >Created</th-item
            >
            <th-item
              class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-600 uppercase bg-gray-100"
              >&nbsp;</th-item
            >
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
        <table-pagination> </table-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import DataTable from './components/DataTable.vue'
import TableHead from './components/TableHead.vue'
import TableRow from './components/TableRow.vue'
import TablePagination from './components/TablePagination.vue'
import ThItem from './components/ThItem.vue'
import TdItem from './components/TdItem.vue'

import dayjs from 'dayjs'

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
    const formatDate = (dateStr: string): string => {
      return dayjs(dateStr).format('MMMM D, YYYY')
    }

    return {
      formatDate,
      artistList: [
        {
          name: 'Danacat',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/maxlinderman/128.jpg',
          eventsPlayed: 1,
          subscriptionType: 'Rockstar',
          isVip: false,
          created: '2020-09-15T11:50:04+0300',
        },
        {
          name: 'DJ Satai',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/reabo101/128.jpg',
          eventsPlayed: 23,
          subscriptionType: 'Superstar',
          isVip: true,
          created: '2020-03-11T11:50:04+0300',
        },
        {
          name: 'dj Haavi',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/madcampos/128.jpg',
          eventsPlayed: 173,
          subscriptionType: null,
          isVip: false,
          created: '2018-02-05T11:50:04+0300',
        },
        {
          name: 'DJ Janek',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/lonesomelemon/128.jpg',
          eventsPlayed: 56,
          subscriptionType: 'Pro',
          isVip: false,
          created: '2019-11-12T11:50:04+0300',
        },
        {
          name: 'Rude-O-Matic',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/caspergrl/128.jpg',
          eventsPlayed: 45,
          subscriptionType: null,
          isVip: false,
          created: '2016-06-01T11:50:04+0300',
        },
        {
          name: 'Marky J',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/turkutuuli/128.jpg',
          eventsPlayed: 191,
          subscriptionType: 'Pro',
          isVip: false,
          created: '2018-08-23T11:50:04+0300',
        },
        {
          name: 'Tuulipukukoodi',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/smaczny/128.jpg',
          eventsPlayed: 163,
          subscriptionType: null,
          isVip: false,
          created: '2017-04-05T11:50:04+0300',
        },
        {
          name: 'digitizedsoul',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/bagawarman/128.jpg',
          eventsPlayed: 376,
          subscriptionType: 'Superstar',
          isVip: false,
          created: '2019-10-05T11:50:04+0300',
        },
        {
          name: 'Fidget Radio',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/joelcipriano/128.jpg',
          eventsPlayed: 29,
          subscriptionType: 'Rockstar',
          isVip: false,
          created: '2019-07-01T11:50:04+0300',
        },
        {
          name: 'Phoole',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/ssiskind/128.jpg',
          eventsPlayed: 143,
          subscriptionType: 'Rockstar',
          isVip: false,
          created: '2019-07-02T11:50:04+0300',
        },
        {
          name: 'Giorgio Blanco',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/saschamt/128.jpg',
          eventsPlayed: 0,
          subscriptionType: null,
          isVip: false,
          created: '2020-05-25T11:50:04+0300',
        },
      ],
    }
  },
})
</script>
