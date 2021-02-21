<template>
  <div>
    <div v-if="!loading && crawler" class="flex gap-4 mb-4">
      <span v-if="crawler.name" class="border border-blue-400 badge py-1 m-0 text-blue-400 font-bold">
        {{ crawler.name }}
      </span>
      <span v-if="crawler.createdAt" class="border border-blue-400 badge py-1 m-0 text-blue-400">
        {{ crawler.createdAt | date }}
      </span>
      <span v-if="crawler.realEstateType" class="border border-blue-400 badge py-1 m-0 text-blue-400">
        {{ crawler.realEstateType === 'house' ? 'Namas' : 'Butas' }}
      </span>
      <span v-if="crawler.priceMin || crawler.priceMax" class="border border-blue-400 badge py-1 m-0 text-blue-400">
        nuo {{ (crawler.priceMin || 0) | currency }} iki {{ (crawler.priceMax || 0) | currency }}
      </span>
      <span v-if="crawler.areaMin || crawler.areaMax" class="border border-blue-400 badge py-1 m-0 text-blue-400">
        nuo {{ (crawler.areaMin || 0) | area }} iki {{ (crawler.areaMax || 0) | area }}
      </span>
      <span v-if="crawler.roomsMin || crawler.roomsMax" class="border border-blue-400 badge py-1 m-0 text-blue-400">
        nuo {{ (crawler.roomsMin || 0)}} iki {{ (crawler.roomsMax || 0) }} kamb.
      </span>
    </div>
    <div class="lg:grid grid-flow-col grid-cols-main gap-4">
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
  filters: {
    currency: function (value) {
      return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`;
    },
    area: function (value) {
      return `${value} \u33A1`;
    },
    date: function (value) {
      if (value) {
        return moment(String(value)).format('YYYY [m.] MMMM DD [d.]');
      }
    },
  },
  computed: {
    ...mapGetters(['realEstates', 'realEstatesMeta', 'loading']),
    groupedRealEstates() {
      const { groupBy: groupByKey } = this.$route.query;
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
    crawler() {
      if (!(this.realEstates && this.realEstates.length)) {
        return null;
      }
      return this.realEstates[0].crawler;
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
      const { id } = this.$route.params;
      const queryParams = { direction, page, property, portals, groupBy, term, searchId: id };
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
