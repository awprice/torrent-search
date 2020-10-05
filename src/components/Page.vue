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
import Controls from './Controls.vue';
import TorrentList from './TorrentList.vue';
import QueueControls from './QueueControls.vue';

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
      if (typeof this.torrents === 'undefined') {
        return [];
      }
      let tmp = this.torrents;
      // Filter out torrents with no seeders
      if (this.onlyTorrentsWithSeeders) {
        tmp = tmp.filter(torrent => torrent.seeders > 0);
      }

      // Sort torrents by seeders
      tmp = tmp.sort((a, b) => (a.seeders < b.seeders ? 1 : -1));

      return tmp;
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
