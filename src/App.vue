<template>
  <div class="justify-center flex-1">
    <div class="container pt-8 mx-auto">
      <data-table>
        <table-head>
          <th-item>Heading 1</th-item>
          <th-item>Heading 2</th-item>
        </table-head>
        <table-row>
          <td-item>Col 1</td-item>
          <td-item>Col 2</td-item>
        </table-row>
      </data-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import DataTable from './components/DataTable.vue'
import TableHead from './components/TableHead.vue'
import TableRow from './components/TableRow.vue'
import ThItem from './components/ThItem.vue'

export default defineComponent({
  components: {
    DataTable,
    TableHead,
    ThItem,
    TableRow,
  },

  setup() {
    return {
      artistList: [
        {
          name: 'Danacat',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/maxlinderman/128.jpg',
          eventsPlayed: 1,
          subscriptionType: null,
          isVip: false,
          created: '2019-09-15T11:50:04+0300',
        },
        {
          name: 'DJ Satai',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/reabo101/128.jpg',
          eventsPlayed: 23,
          subscriptionType: null,
          isVip: true,
          created: '2019-09-15T11:50:04+0300',
        },
        {
          name: 'dj Haavi',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/madcampos/128.jpg',
          eventsPlayed: 173,
          subscriptionType: null,
          isVip: false,
          created: '2019-09-15T11:50:04+0300',
        },
        {
          name: 'DJ Janek',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/lonesomelemon/128.jpg',
          eventsPlayed: 56,
          subscriptionType: null,
          isVip: false,
          created: '2019-09-15T11:50:04+0300',
        },
        {
          name: 'Rude-O-Matic',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/caspergrl/128.jpg',
          eventsPlayed: 45,
          subscriptionType: null,
          isVip: false,
          created: '2019-09-15T11:50:04+0300',
        },
        {
          name: 'Marky J',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/turkutuuli/128.jpg',
          eventsPlayed: 191,
          subscriptionType: null,
          isVip: false,
          created: '2019-09-15T11:50:04+0300',
        },
        {
          name: 'Tuulipukukoodi',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/smaczny/128.jpg',
          eventsPlayed: 163,
          subscriptionType: null,
          isVip: false,
          created: '2019-09-15T11:50:04+0300',
        },
        {
          name: 'digitizedsoul',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/bagawarman/128.jpg',
          eventsPlayed: 376,
          subscriptionType: null,
          isVip: false,
          created: '2019-09-15T11:50:04+0300',
        },
        {
          name: 'Fidget Radio',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/joelcipriano/128.jpg',
          eventsPlayed: 29,
          subscriptionType: null,
          isVip: false,
          created: '2019-09-15T11:50:04+0300',
        },
        {
          name: 'Phoole',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/ssiskind/128.jpg',
          eventsPlayed: 143,
          subscriptionType: null,
          isVip: false,
          created: '2019-09-15T11:50:04+0300',
        },
        {
          name: 'Giorgio Blanco',
          photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/saschamt/128.jpg',
          eventsPlayed: 0,
          subscriptionType: null,
          isVip: false,
          created: '2019-09-15T11:50:04+0300',
        },
      ],
    }
  },
})
</script>
