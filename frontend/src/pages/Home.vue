<template>
  <div>
    <div class="lg:grid grid-cols-2 gap-4 flex flex-col">
      <div class="md:order-2">
        <button
          class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full lg:hidden mb-4"
          :class="{ 'bg-gray-100': formVisible }"
          aria-label="New search"
          @click="formVisible = !formVisible"
        >
          Sukurti paiešką
        </button>
        <CrawlerForm :class="{ 'md:hidden': !formVisible }"></CrawlerForm>
      </div>
      <div class="flex flex-col lg:mb-4">
        <p class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Išsaugotos paieškos</p>
        <Crawlers></Crawlers>
      </div>
    </div>
    <hr class="mt-4 mb-6" />

    <div>
      <p class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Pamėgti skelbimai</p>
      <List v-if="favorites.length" :real-estates="favorites"></List>
      <span v-else class="text-sm text-gray-600">Kolkas neturite pamėgtų skelbimų.</span>
    </div>
  </div>
</template>

<script>
import Crawlers from '@/components/Crawlers';
import CrawlerForm from '@/components/CrawlerForm';
import ApiService from '@/services/api.service';
import List from '@/components/List';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  components: {
    Crawlers,
    CrawlerForm,
    List,
  },
  computed: {
    ...mapGetters(['selectedCrawler']),
  },
  watch: {
    selectedCrawler(crawler) {
      if (crawler) {
        this.formVisible = true;
      }
    },
  },
  data() {
    return {
      favorites: [],
      formVisible: false,
    };
  },
  async created() {
    const { data } = await ApiService.get(`/favorite`);
    this.favorites = data.map(item => item.realEstate);
  },
};
</script>

<style scoped></style>
