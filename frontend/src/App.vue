<template>
  <div id="app">
    <div class="container mx-auto py-10 sm:py-6">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
body {
  min-height: 100vh;
  background-color: #f6f9fc;
}
</style>
