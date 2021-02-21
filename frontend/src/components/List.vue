<template>
  <div>
    <template v-for="item in realEstates">
      <ListItem v-bind:key="item.id" :item="item"></ListItem>
      <hr class="mt-4 mb-6" />
    </template>
  </div>
</template>

<script>
import ListItem from './ListItem';

export default {
  name: 'List',
  data() {
    return {
      loading: true,
    };
  },
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
