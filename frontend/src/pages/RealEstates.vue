<template>
  <div class="container">
    <div class="section">
      <div class="is-flex justify-content-between flex-column-mobile">
        <!--        @TODO: fix on mobile view-->
        <div class="is-flex flex-column-mobile">
          <ListSort class="mr-3"></ListSort>
          <ListFilter></ListFilter>
        </div>
        <button class="button is-primary" :class="{ 'is-loading': loadingCrawler }" :disabled="loadingCrawler" @click="onRunCrawler">
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
      <Pagination v-if="realEstatesMeta && !loading && realEstates && realEstates.length" :meta="realEstatesMeta"></Pagination>
    </div>
  </div>
</template>

<script>
import ListSort from '../components/Sort';
import Pagination from '../components/Pagination';
import List from '../components/List';
import axios from 'axios';
import ListFilter from '../components/Filter';
import Loader from '../components/ui/Loader';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'RealEstates',
  components: {
    Loader,
    ListSort,
    Pagination,
    List,
    ListFilter,
  },
  data() {
    return {
      loadingCrawler: false,
    };
  },
  computed: mapGetters(['realEstates', 'realEstatesMeta', 'loading']),
  watch: {
    $route: 'getRealEstates',
  },
  created() {
    this.getRealEstates();
  },
  methods: {
    ...mapActions(['fetchRealEstates']),
    getRealEstates(route = this.$route) {
      const { direction, page, property, portals } = route.query;
      const queryParams = { direction, page, property, portals };
      this.fetchRealEstates(queryParams);
    },
    onRunCrawler() {
      this.loadingCrawler = true;
      axios
        .post('http://localhost:3000/api/run-crawler', {})
        .then(() => {
          this.getRealEstates();
          this.loadingCrawler = false;
        })
        .catch(err => {
          this.loadingCrawler = false;
          console.error(err);
        });
    },
  },
};
</script>

<style scoped lang="scss"></style>
