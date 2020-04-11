<template>
  <div>
    <ListItem v-for="item in realEstates" :key="item._id" :item="item"></ListItem>
  </div>
</template>

<script>
import ListItem from './ListItem';

export default {
  name: 'List',
  components: {
    ListItem,
  },
  props: {
    realEstates: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped lang="scss"></style>
