import Vue from 'vue';
import VueDarkMode from 'vuedarkmode';
import App from './App.vue';
import createProvider from './vue-apollo';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueDarkMode, {
  components: [
    'heading',
    'input',
    'checkbox',
    'divider',
    'icon',
    'spinner',
  ],
});

new Vue({
  apolloProvider: createProvider(),
  store,
  render: h => h(App),
}).$mount('#app');
