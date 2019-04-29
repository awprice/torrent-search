<template>
  <div>
    <dm-input
      name="deluge-url"
      v-model="delugeUrl"
      placeholder="Deluge URL"
      size="small"
      class="deluge-input"
    ></dm-input>
    <dm-input
      name="deluge-password"
      v-model="delugePassword"
      placeholder="Deluge Password"
      size="small"
      class="deluge-input"
    ></dm-input>
    <dm-button
      class="start-torrents-button"
      size="small"
      color="green"
      leftIcon="play_arrow"
      v-on:click="startTorrents"
      :loading="startTorrentsLoading"
    >
      Start Torrents in Deluge
    </dm-button>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import get from 'lodash/get';
import mutationTypes from '../store/types';

export default {
  name: 'QueueControls',
  data() {
    return {
      startTorrentsLoading: false,
    };
  },
  methods: {
    async startTorrents() {
      this.startTorrentsLoading = true;
      const { queue } = this.$store.state.app;
      for (const torrent of queue) { // eslint-disable-line
        const res = await this.$apollo.mutate({ // eslint-disable-line
          mutation: gql`
            mutation ($magnetLink: String!, $delugeUrl: String!, $delugePassword: String!) {
              addTorrent(magnetLink: $magnetLink, delugeUrl: $delugeUrl, delugePassword: $delugePassword) {
                success
              }
            }
          `,
          variables: {
            magnetLink: torrent.download,
            delugeUrl: this.delugeUrl,
            delugePassword: this.delugePassword,
          },
        });
        const success = get(res, 'data.addTorrent.success', false);
        if (!success) {
          alert('Unable to start torrent in Deluge'); // eslint-disable-line
          break;
        }
        this.$store.commit(`app/${mutationTypes.REMOVE_TORRENT_FROM_QUEUE}`, torrent);
      }
      this.startTorrentsLoading = false;
    },
  },
  computed: {
    delugeUrl: {
      get() {
        return this.$store.state.app.delugeUrl;
      },
      set(value) {
        this.$store.commit(`app/${mutationTypes.SET_DELUGE_URL}`, value);
      },
    },
    delugePassword: {
      get() {
        return this.$store.state.app.delugePassword;
      },
      set(value) {
        this.$store.commit(`app/${mutationTypes.SET_DELUGE_PASSWORD}`, value);
      },
    },
  },
};
</script>

<style scoped>
  .deluge-input {
    display: inline-block;
    width: 300px;
    margin: 0 15px 15px 0;
  }

  .start-torrents-button {
    float: right;
  }
</style>
