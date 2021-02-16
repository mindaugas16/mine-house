<template>
  <div>
    <CrawlerModal></CrawlerModal>
    <ul class="mb-4">
      <CrawlerItem
        v-for="crawler in crawlers"
        :key="crawler.id"
        :crawler="crawler"
        :selected="selectedCrawlers.includes(crawler.id)"
        @toggle="onToggle($event)"
      ></CrawlerItem>
    </ul>
    <div class="flex justify-center">
      <button class="btn btn--primary" @click="$bvModal.show('crawler-modal')">
        <span>Sukurti paiešką</span>
        <span class="ml-2 inline-block icon">
          <i class="fa fa-plus"></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import CrawlerItem from '@/components/CrawlerItem';
import CrawlerModal from '../components/CrawlerModal';
import router from '@/router';
import ApiService from '@/services/api.service';

export default {
  name: 'Crawlers',
  components: { CrawlerItem, CrawlerModal },
  data() {
    return {
      selectedCrawlers: [],
      crawlers: [],
    };
  },
  async created() {
    try {
      const { data } = await ApiService.get(`/crawlers/`);
      this.crawlers = data;
    } catch (err) {
      console.error(err);
    }

    const query = this.$route.query;

    if (query.crawlers) {
      this.selectedCrawlers = query.crawlers.split(',').map(v => +v);
    } else {
      this.reset();
    }
  },
  methods: {
    onToggle(crawlerId) {
      const foundIndex = this.selectedCrawlers.indexOf(crawlerId);
      if (foundIndex > -1) {
        this.selectedCrawlers.splice(foundIndex, 1);
      } else {
        this.selectedCrawlers.push(crawlerId);
      }
      const crawlers = this.selectedCrawlers.sort((a, b) => a - b).join();
      this.appendToRoute({ crawlers });
    },
    reset() {
      this.selectedCrawlers = this.crawlers.map(({ id }) => id);
    },
    appendToRoute(params) {
      router.replace({
        query: { ...this.$route.query, ...params, page: undefined },
      });
    },
  },
};
</script>

<style scoped></style>
