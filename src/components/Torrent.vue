<template>
  <div class="torrent">
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
    </div>
  </div>
</template>

<script>
import prettyBytes from 'pretty-bytes';

export default {
  name: 'Torrent',
  props: {
    torrent: {
      required: true,
      type: Object,
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
</style>
