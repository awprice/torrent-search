/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import types from '../types';

const initialState = () => ({
  keywords: '',
  onlyTorrentsWithSeeders: false,
});

const state = initialState();
const getters = {
  keywords: state => state.keywords,
  onlyTorrentsWithSeeders: state => state.onlyTorrentsWithSeeders,
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
