import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import createLogger from 'vuex/dist/logger';
import cloneDeep from 'lodash/cloneDeep';
import app from './modules/app';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';
const plugins = [
  createPersistedState({
    key: 'vuex/torrent-search',
    reducer: state => cloneDeep(state),
  }),
];

if (debug) {
  plugins.push(createLogger());
}

export default new Vuex.Store({
  plugins,
  modules: {
    app,
  },
  strict: debug,
});
