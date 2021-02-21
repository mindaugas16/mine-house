<template>
  <div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <CrawlerForm></CrawlerForm>
      </div>
      <div class="flex flex-col mb-4">
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

export default {
  name: 'Home',
  components: {
    Crawlers,
    CrawlerForm,
    List,
  },
  data() {
    return {
      favorites: [],
    };
  },
  async created() {
    const { data } = await ApiService.get(`/favorite`);
    this.favorites = data.map(item => item.realEstate);
  },
};
</script>

<style scoped></style>
