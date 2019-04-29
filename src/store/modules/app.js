/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import types from '../types';

const initialState = () => ({
  keywords: '',
  onlyTorrentsWithSeeders: false,
  queue: [],
  delugeUrl: '',
  delugePassword: '',
});

const state = initialState();
const getters = {
  keywords: state => state.keywords,
  onlyTorrentsWithSeeders: state => state.onlyTorrentsWithSeeders,
  queue: state => state.queue,
  delugeUrl: state => state.delugeUrl,
  delugePassword: state => state.delugePassword,
};
const actions = {};
const mutations = {

  /**
   * @param state
   * @param keywords
   */
  [types.SET_KEYWORDS](state, keywords) {
    state.keywords = keywords;
  },

  /**
   * @param state
   * @param onlyTorrentsWithSeeders
   */
  [types.SET_ONLY_TORRENTS_WITH_SEEDERS](state, onlyTorrentsWithSeeders) {
    state.onlyTorrentsWithSeeders = onlyTorrentsWithSeeders;
  },

  /**
   * @param state
   * @param torrent
   */
  [types.ADD_TORRENT_TO_QUEUE](state, torrent) {
    // Determine if the torrent is already in the queue
    const found = state.queue.find(item => item.download === torrent.download);
    if (typeof found !== 'undefined') {
      return;
    }
    state.queue.push(torrent);
  },

  /**
   * @param state
   * @param torrent
   */
  [types.REMOVE_TORRENT_FROM_QUEUE](state, torrent) {
    state.queue = state.queue.filter(item => item.download !== torrent.download);
  },

  /**
   * @param state
   * @param delugeUrl
   */
  [types.SET_DELUGE_URL](state, delugeUrl) {
    state.delugeUrl = delugeUrl;
  },

  /**
   * @param state
   * @param delugePassword
   */
  [types.SET_DELUGE_PASSWORD](state, delugePassword) {
    state.delugePassword = delugePassword;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
