<template>
  <div class="container mx-auto my-10 sm:my-6 lg:grid grid-flow-col grid-cols-main gap-4">
    <div class="flex justify-content-between flex-col lg:sticky top-20">
      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full lg:hidden mb-4"
        aria-label="Filter"
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
      </div>
    </div>
    <div>
      <div class="section">
        <Loader v-if="loading"></Loader>
        <div
          v-for="group in groupedRealEstates"
          v-else-if="groupedRealEstates && groupedRealEstates.length"
          :key="group[0]"
        >
          <h1 v-if="group[0]" class="text-3xl mb-4 font-semibold">{{ group[0] }}</h1>
          <List :real-estates="group[1]"></List>
        </div>
        <div v-else class="flex justify-center">
          <p><strong>Nieko nerasta</strong></p>
        </div>
      </div>
      <div class="section">
        <Pagination
          v-if="realEstatesMeta && !loading && realEstates && realEstates.length"
          :meta="realEstatesMeta"
        ></Pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ListSort from '../components/Sort';
import Pagination from '../components/Pagination';
import List from '../components/List';
import ListFilter from '../components/Filter';
import Loader from '../components/ui/Loader';
import { mapActions, mapGetters } from 'vuex';
import Search from '../components/Search';
import moment from 'moment';
import router from '../router';

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
      filtersVisible: true,
    };
  },
  computed: {
    ...mapGetters(['realEstates', 'realEstatesMeta', 'loading']),
    groupedRealEstates() {
      const groupByKey = this.$route.query.groupBy;
      if (!(this.realEstates && this.realEstates.length)) {
        return [];
      }
      if (!groupByKey) {
        return [[null, this.realEstates]];
      }
      const keyGetter = () => {
        switch (groupByKey) {
          case 'portalId':
            return item => item.portal.title;
          case 'crawlerId':
            return item => item.crawler.name;
          default:
            return item => moment(item['createdAt']).startOf('day').format('MMMM DD');
        }
      };
      return Object.entries(groupBy(this.realEstates, keyGetter()));
    },
  },
  watch: {
    $route: 'getRealEstates',
  },
  async created() {
    this.getRealEstates();
  },
  methods: {
    ...mapActions(['fetchRealEstates']),
    getRealEstates(route = this.$route) {
      const { direction, page, property, portals, groupBy, term } = route.query;
      const queryParams = { direction, page, property, portals, groupBy, term };
      this.fetchRealEstates(queryParams);
    },

    onClearFilters() {
      router.replace({ path: '', params: undefined }).catch(() => {});
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
