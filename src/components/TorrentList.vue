<template>
  <div>
    <div v-if="loading" class="text-center">
      <dm-spinner color="blue" size="large"/>
    </div>
    <div v-if="!loading">
      <div v-if="torrents.length">
        <torrent
          v-for="torrent in torrents"
          :key="torrent.download"
          :torrent="torrent"
          :mode="mode"
        />
        <p class="results-limit" v-if="showLimitText">Results limited to 100 entries</p>
      </div>
      <div v-if="!torrents.length" class="text-center no-results">
        <p>{{ emptyText }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Torrent from './Torrent';

export default {
  name: 'TorrentList',
  components: { Torrent },
  props: {
    torrents: {
      required: true,
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showLimitText: {
      type: Boolean,
      default: true,
    },
    emptyText: {
      type: String,
      default: 'No results found',
    },
    mode: {
      type: String,
      default: 'search',
    },
  },
};
</script>

<style scoped>
  .no-results p {
    color: #999;
  }

  .results-limit {
    color: #999;
  }
</style>
