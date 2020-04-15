<template>
  <div class="relative w-full">
    <input type="text" placeholder="Skelbimų paieška" />
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <span class="icon fill-current h-4 w-4 justify-center flex">
        <i class="fa fa-search" aria-hidden="true"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
};
</script>

<style scoped lang="scss"></style>
