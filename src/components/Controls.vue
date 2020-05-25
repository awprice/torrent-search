<template>
  <div>
    <dm-checkbox
      v-model="onlyTorrentsWithSeeders"
      class="only-seeders-checkbox"
      name="only-seeders"
      label="Only torrents with seeders"
    ></dm-checkbox>
    <dm-input
      v-model="keywords"
      class="torrent-search-input"
      name="torrent-search"
      placeholder="Search for torrents..."
      size="small"
    ></dm-input>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import mutationTypes from '../store/types';

export default {
  name: 'Controls',
  computed: {
    keywords: {
      get() {
        return this.$store.state.app.keywords;
      },
      set: debounce(function (value) { // eslint-disable-line
        this.$store.commit(`app/${mutationTypes.SET_KEYWORDS}`, value);
      }, 350),
    },
    onlyTorrentsWithSeeders: {
      get() {
        return this.$store.state.app.onlyTorrentsWithSeeders;
      },
      set(value) {
        this.$store.commit(`app/${mutationTypes.SET_ONLY_TORRENTS_WITH_SEEDERS}`, value);
      },
    },
  },
};
</script>

<style scoped>
  .only-seeders-checkbox {
    margin-bottom: 15px;
  }

  .torrent-search-input {
    margin-bottom: 15px;
    width: 500px;
  }
</style>
