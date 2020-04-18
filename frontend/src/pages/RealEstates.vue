<template>
  <div class="container mx-auto my-10 sm:my-6 lg:grid grid-flow-col grid-cols-main gap-4">
    <div class="is-flex justify-content-between flex-column lg:sticky top-20">
      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full lg:hidden mb-4"
        @click="filtersVisible = !filtersVisible"
      >
        Filtrai
      </button>
      <div class="flex flex-col lg:visible mb-4" :class="{ 'md:hidden': filtersVisible }">
        <div class="flex flex-col">
          <Search class="mb-6"></Search>
          <ListSort class="mb-6"></ListSort>
          <ListFilter></ListFilter>
        </div>
        <button class="btn btn--primary mt-8" :class="{ 'is-loading': loadingCrawler }" :disabled="loadingCrawler" @click="onRunCrawler">
          Atnaujinti
          <span class="icon ml-2">
            <i class="fa fa-refresh"></i>
          </span>
        </button>
      </div>
    </div>
    <div>
      <div class="section">
        <Loader v-if="loading"></Loader>
        <div v-for="group in groupedRealEstates" v-else-if="groupedRealEstates && groupedRealEstates.length" :key="group[0]">
          <h1 v-if="group[0]" class="text-3xl mb-4 font-semibold">{{ group[0] }}</h1>
          <List :real-estates="group[1]"></List>
        </div>
        <div v-else class="is-flex justify-content-center">
          <p><strong>Nieko nerasta</strong></p>
        </div>
      </div>
      <div class="section">
        <Pagination v-if="realEstatesMeta && !loading && realEstates && realEstates.length" :meta="realEstatesMeta"></Pagination>
      </div>
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
import Search from '../components/Search';
import moment from 'moment';

export default {
  name: 'RealEstates',
  components: {
    Search,
    Loader,
    ListSort,
    Pagination,
    List,
    ListFilter,
  },
  data() {
    return {
      loadingCrawler: false,
      filtersVisible: true,
    };
  },
  computed: {
    ...mapGetters(['realEstates', 'realEstatesMeta', 'loading']),
    groupedRealEstates() {
      const groupByKey = this.$route.query.groupBy;
      if (!groupByKey) {
        return [[null, this.realEstates]];
      }
      const keyGetter = () => {
        if (groupByKey === 'portalId') {
          return item => item.portal.title;
        } else {
          return item => moment(item['createdAt']).startOf('day').format('MMMM DD');
        }
      };
      return Object.entries(groupBy(this.realEstates, keyGetter()));
    },
  },
  watch: {
    $route: 'getRealEstates',
  },
  created() {
    this.getRealEstates();
  },
  methods: {
    ...mapActions(['fetchRealEstates']),
    getRealEstates(route = this.$route) {
      const { direction, page, property, portals, groupBy } = route.query;
      const queryParams = { direction, page, property, portals, groupBy };
      this.fetchRealEstates(queryParams);
    },
    onRunCrawler() {
      this.loadingCrawler = true;
      axios
        .get(`${process.env.VUE_APP_API_HOST}:3000/api/run-crawler`)
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

function groupBy(list, keyGetter) {
  return list.reduce((rv, x) => {
    const key = keyGetter(x);
    (rv[key] = rv[key] || []).push(x);
    return rv;
  }, {});
}
</script>

<style scoped lang="scss"></style>
