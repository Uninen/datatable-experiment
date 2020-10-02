<template>
  <div>
    <data-table :config="localConfig"></data-table>
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
    const localConfig = {
      mode: 'local',
      data: JSON.parse(JSON.stringify(artists.artists)),
    }

    return {
      localConfig,
    }
  },
})
</script>
