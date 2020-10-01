<template>
  <div>
    <data-table v-if="unstyledArtistList.length > 0" :data="unstyledArtistList"></data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import DataTable from '../components/datatable/DataTable.vue'
import artists from '../mirage/fixtures/artists.mirage.db.json'

export default defineComponent({
  components: {
    DataTable,
  },

  setup() {
    const unstyledArtistList: any = JSON.parse(JSON.stringify(artists.artists))
    console.log('Loading unstyled artists: ', unstyledArtistList)

    return {
      unstyledArtistList,
    }
  },
})
</script>
