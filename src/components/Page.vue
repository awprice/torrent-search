<template>
  <div>
    <header-panel/>
    <controls/>
    <dm-divider/>
    <torrent-list
      :torrents="filteredTorrents"
      :loading="$apolloData.loading > 0"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { mapGetters } from 'vuex';
import HeaderPanel from './HeaderPanel';
import Controls from './Controls';
import TorrentList from './TorrentList';

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
    }),

    filteredTorrents() {
      return this.torrents.filter((torrent) => {
        // Filter out torrents with no seeders
        return !(this.onlyTorrentsWithSeeders && torrent.seeders <= 0);
      });
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
    HeaderPanel,
    TorrentList,
    Controls,
  },
};
</script>

<style scoped>
  .dm-base-divider {
    margin: 30px auto !important;
  }
</style>
