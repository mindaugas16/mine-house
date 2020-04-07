<template>
  <div>
    <ListItem v-for="item in realEstates" v-bind:key="item._id" v-bind:item="item"></ListItem>
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
    realEstates: Array,
  },
};
</script>

<style scoped lang="scss"></style>
