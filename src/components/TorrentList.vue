<template>
  <div>
    <div v-if="loading" class="text-center">
      <dm-spinner color="blue" size="large"/>
    </div>
    <div v-if="!loading">
      <torrent
        v-for="torrent in torrents"
        :key="torrent.download"
        :torrent="torrent"
      />
      <div v-if="!torrents.length" class="text-center no-results">
        <p>No results found</p>
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
      required: true,
      type: Boolean,
    },
  },
};
</script>

<style scoped>
  .no-results p {
    color: #999;
  }
</style>
