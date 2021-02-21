<template>
  <div>
    <Loader v-if="crawlersLoading"></Loader>
    <template v-else>
      <ul v-if="crawlers.length" class="mb-4">
        <CrawlerItem
          v-for="crawler in crawlers"
          :key="crawler.id"
          :crawler="crawler"
          :selected="selectedCrawlers.includes(crawler.id)"
          @delete="onDelete($event)"
        ></CrawlerItem>
      </ul>
      <span v-else class="text-sm text-gray-600">Nieko nerasta.</span>
    </template>
  </div>
</template>

<script>
import CrawlerItem from '@/components/CrawlerItem';
import router from '@/router';
import { mapActions, mapGetters } from 'vuex';
import Loader from '@/components/ui/Loader';

export default {
  name: 'Crawlers',
  components: { Loader, CrawlerItem },
  data() {
    return {
      selectedCrawlers: [],
    };
  },
  computed: {
    ...mapGetters(['crawlers', 'crawlersLoading']),
  },
  async created() {
    await this.fetchCrawlers();
    const query = this.$route.query;

    if (query.crawlers) {
      this.selectedCrawlers = query.crawlers.split(',').map(v => +v);
    } else {
      this.reset();
    }
  },
  methods: {
    ...mapActions(['fetchCrawlers', 'deleteCrawler']),
    reset() {
      this.selectedCrawlers = this.crawlers.map(({ id }) => id);
    },
    appendToRoute(params) {
      router.replace({
        query: { ...this.$route.query, ...params, page: undefined },
      });
    },
    onDelete(id) {
      this.deleteCrawler(id);
    },
  },
};
</script>

<style scoped></style>
