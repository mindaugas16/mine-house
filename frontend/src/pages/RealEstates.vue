<template>
  <div class="container">
    <div class="section">
      <div class="is-flex justify-content-between">
<!--        @TODO: fix on mobile view-->
        <div class="is-flex">
          <ListSort class="mr-3"></ListSort>
          <ListFilter></ListFilter>
        </div>
        <button class="button is-primary" @click="onRunCrawler" :disabled="loadingCrawler" :class="{ 'is-loading': loadingCrawler }">
          <span class="icon">
            <i class="fa fa-refresh"></i>
          </span>
        </button>
      </div>
    </div>
    <div class="section">
      <Loader v-if="loading"></Loader>
      <List v-else-if="realEstates && realEstates.length" :real-estates="realEstates"></List>
      <div v-else class="is-flex justify-content-center">
        <p><strong>Nieko nerasta</strong></p>
      </div>
    </div>
    <div class="section">
      <Pagination
        v-if="realEstatesMeta && !loading && realEstates && realEstates.length"
        :meta="realEstatesMeta"
        @change="fetchRealEstates"
      ></Pagination>
    </div>
  </div>
</template>

<script>
import ListSort from '../components/ListSort';
import Pagination from '../components/Pagination';
import List from '../components/List';
import axios from 'axios';
import ListFilter from '../components/Filter';
import Loader from '../components/ui/Loader';

export default {
  name: 'RealEstates',
  components: {
    Loader,
    ListSort,
    Pagination,
    List,
    ListFilter,
  },
  methods: {
    fetchRealEstates(route) {
      this.loading = true;
      const { direction, page, property, portals } = route.query;
      axios
        .get('http://localhost:3000/api/real-estate', { params: { direction, page, property, portals } })
        .then(({ data }) => {
          this.realEstates = data.data;
          this.realEstatesMeta = data.meta;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.error(err);
        });
    },
    onRunCrawler() {
      this.loadingCrawler = true;
      axios
        .post('http://localhost:3000/api/run-crawler', {})
        .then(() => {
          this.fetchRealEstates(this.$route);
          this.loadingCrawler = false;
        })
        .catch(err => {
          this.loadingCrawler = false;
          console.error(err);
        });
    },
  },
  data() {
    return {
      realEstates: [],
      realEstatesMeta: null,
      loadingCrawler: false,
      loading: false,
    };
  },
  mounted() {
    this.fetchRealEstates(this.$route);
  },
  watch: {
    $route: 'fetchRealEstates',
  },
};
</script>

<style scoped lang="scss"></style>
