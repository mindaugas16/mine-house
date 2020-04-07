<template>
  <div id="app">
    <div class="container">
      <div class="section">
        <ListFilter></ListFilter>
      </div>
      <div class="section">
        <List :real-estates="realEstates"></List>
      </div>
      <div class="section">
        <Pagination v-if="realEstatesMeta" :meta="realEstatesMeta" @change="fetchRealEstates"></Pagination>
      </div>
    </div>
  </div>
</template>

<script>
import List from './components/List.vue';
import axios from 'axios';
import Pagination from './components/Pagination';
import ListFilter from './components/Filter';

export default {
  name: 'App',
  components: {
    ListFilter,
    Pagination,
    List,
  },
  methods: {
    fetchRealEstates(page = 1) {
      axios.get('http://localhost:3000/api/real-estate', { params: { page } }).then(response => {
        this.realEstates = response.data.data;
        this.realEstatesMeta = response.data.meta;
      });
    },
  },
  data() {
    return {
      realEstates: [],
      realEstatesMeta: null,
    };
  },
  mounted() {
    this.fetchRealEstates();
  },
};
</script>

<style lang="scss">
  body {
    background-color: #f6f9fc;
  }
</style>
