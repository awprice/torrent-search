<template>
  <div>
    <dm-heading class="header" tag="h3">Torrent Search</dm-heading>
    <controls/>
    <torrent-list
      :torrents="filteredTorrents"
      :loading="$apolloData.loading > 0"
    />
    <dm-divider/>
    <dm-heading class="header" tag="h3">Queue</dm-heading>
    <queue-controls/>
    <torrent-list
      :torrents="queue"
      :showLimitText="false"
      mode="queue"
      empty-text="No torrents in queue"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { mapGetters } from 'vuex';
import Controls from './Controls';
import TorrentList from './TorrentList';
import QueueControls from './QueueControls';

export default {
  name: 'Page',
  data() {
    return {
      torrents: [],
    };
  },
  computed: {
    ...mapGetters({
      keywords: 'app/keywords',
      onlyTorrentsWithSeeders: 'app/onlyTorrentsWithSeeders',
      queue: 'app/queue',
    }),

    filteredTorrents() {
      return this.torrents.filter(torrent =>
      // Filter out torrents with no seeders
        !(this.onlyTorrentsWithSeeders && torrent.seeders <= 0));
    },
  },
  apollo: {
    torrents: {
      query: gql`
          query torrents($keywords: String!) {
            torrents(keywords: $keywords) {
              title
              category
              download
              seeders
              leechers
              size
              info_page
            }
          }
        `,
      variables() {
        return {
          keywords: this.keywords,
        };
      },
    },
  },
  components: {
    QueueControls,
    TorrentList,
    Controls,
  },
};
</script>

<style scoped>
  .dm-base-divider {
    margin: 30px auto !important;
  }

  .header {
    margin-bottom: 20px;
  }
</style>
