<template>
  <div id="app">
    <page></page>
  </div>
</template>

<script>
import Page from './components/Page';

export default {
  name: 'app',
  components: {
    Page,
  },
};
</script>

<style>
  #app {
    font-family: Heebo,"Helvetica Neue",Source Sans Pro,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    padding: 50px;
  }

  [class^="dm-"]:not(.dm-base-icon) {
    font-family: Heebo,"Helvetica Neue",Source Sans Pro,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: #1c2532;
  }

  .text-center {
    text-align: center;
  }
</style>
