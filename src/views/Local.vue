<template>
  <div>
    <data-table
      class="hidden sm:block"
      v-if="artistList.length > 0"
      :data="artistList"
    ></data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import DataTable from '../components/datatable/DataTable.vue'
import artists from '../utils/fixtures/artists.mirage.db.json'

export default defineComponent({
  components: {
    DataTable,
  },

  setup() {
    const artistList: any = artists.artists
    console.log('artists: ', artists)

    return {
      artistList,
    }
  },
})
</script>