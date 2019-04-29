<template>
  <div class="torrent">
    <dm-button
      class="add-button"
      size="mini"
      type="button"
      leftIcon="add_circle"
      color="blue"
      v-on:click="queueAdd"
      v-if="mode === 'search'"
    >Add to Queue</dm-button>
    <dm-button
      class="add-button"
      size="mini"
      type="button"
      leftIcon="remove_circle"
      color="red"
      v-on:click="queueRemove"
      v-if="mode === 'queue'"
    >Remove</dm-button>
    <p class="title-link"><a :href="torrent.info_page" target="_blank">{{ torrent.title }}</a></p>
    <div class="details-holder">
      <p class="magnet-link">
        <a :href="torrent.download">
          <dm-icon name="link" size="20px"></dm-icon>
          Magnet Link
        </a>
      </p>
      <p class="seeders">
        <dm-icon name="arrow_drop_up" size="20px"></dm-icon>
        {{ torrent.seeders }} Seeders
      </p>
      <p class="leechers">
        <dm-icon name="arrow_drop_down" size="20px"></dm-icon>
        {{ torrent.leechers }} Leechers
      </p>
      <p class="size">{{ size }}</p>
      <p>
        <dm-badge size="mini" color="purple">{{ torrent.category }}</dm-badge>
      </p>
    </div>
  </div>
</template>

<script>
import prettyBytes from 'pretty-bytes';
import mutationTypes from '../store/types';

export default {
  name: 'Torrent',
  props: {
    torrent: {
      required: true,
      type: Object,
    },
    mode: {
      type: String,
      default: 'search',
    },
  },
  methods: {
    queueAdd() {
      this.$store.commit(`app/${mutationTypes.ADD_TORRENT_TO_QUEUE}`, this.torrent);
    },
    queueRemove() {
      this.$store.commit(`app/${mutationTypes.REMOVE_TORRENT_FROM_QUEUE}`, this.torrent);
    },
  },
  computed: {
    size() {
      return prettyBytes(this.torrent.size);
    },
  },
};
</script>

<style scoped>
  .torrent {
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid #323e4f;
    border-radius: 6px;
  }

  .title-link {
    margin: 0;
  }

  .title-link a {
    color: #FFF;
    text-decoration: none;
  }

  .details-holder {
    margin: 5px 0 0;
    font-size: 14px;
  }

  .details-holder > p {
    display: inline-block;
    margin: 0 15px 0 0;
  }

  .magnet-link a {
    text-decoration: none;
    color: #A9C7DF;
  }

  .details-holder .dm-base-icon {
    vertical-align: middle;
  }

  .seeders {
    color: #4FCF3F;
  }

  .leechers {
    color: #E1112C;
  }

  .size {
    color: #0194EF;
  }

  .add-button {
    float: right;
    margin: 8px 10px 0 0;
  }
</style>
