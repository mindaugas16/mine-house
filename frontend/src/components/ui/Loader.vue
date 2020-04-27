<template>
  <div class="loader-wrapper">
    <div class="loader is-loading"></div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
};
</script>

<style scoped lang="scss">
.loader-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  .loader {
    height: 50px;
    width: 50px;
    background: url('../../assets/loader.svg') no-repeat center;
  }

  &.is-active {
    opacity: 1;
    z-index: 1;
  }
}
</style>
