<template>
  <li>
    <div class="flex justify-between">
      <label :key="crawler.id" class="text-gray-500 hover:text-gray-700 cursor-pointer" :for="crawler.id">
        <input :id="crawler.id" v-model="isSelected" type="checkbox" @change="$emit('toggle', crawler.id)" />
        <span class="text-sm ml-2">{{ crawler.name }}</span>
      </label>
      <div>
        <button
          class="px-2"
          :class="{ 'is-loading': loadingCrawler, spinning: loadingCrawler }"
          :disabled="loadingCrawler"
          @click="onRunCrawler(crawler.id)"
        >
          <span class="icon is-small">
            <i class="fa fa-refresh" aria-hidden="true"></i>
          </span>
        </button>
        <button :id="itemId" class="px-2">
          <span class="icon is-small">
            <i class="fa fa-info" aria-hidden="true"></i>
          </span>
        </button>
        <b-popover :target="itemId" triggers="hover focus" placement="top">
          <div class="grid grid-cols-2 gap-4">
            <span class="text-sm font-medium text-gray-400">Pavadinimas</span>
            <span class="text-sm text-gray-900">{{ crawler.name }}</span>

            <span class="text-sm font-medium text-gray-400">Būsto tipas</span>
            <span class="text-sm text-gray-900">{{ crawler.realEstateType }}</span>

            <template v-if="crawler.priceMin && crawler.priceMax">
              <span class="text-sm font-medium text-gray-400">Kaina</span>
              <span class="text-sm text-gray-900">
                {{ crawler.priceMin || 'Nenustatyta' }} - {{ crawler.priceMax || 'Nenustatyta' }}
              </span>
            </template>

            <template v-if="crawler.areaMin && crawler.areaMax">
              <span class="text-sm font-medium text-gray-400">Plotas</span>
              <span class="text-sm text-gray-900">
                {{ crawler.areaMin || 'Nenustatyta' }} - {{ crawler.areaMax || 'Nenustatyta' }}
              </span>
            </template>

            <template v-if="crawler.realEstateType === 'apartment'">
              <template v-if="crawler.roomsMin && crawler.roomsMax">
                <span class="text-sm font-medium text-gray-400">Kambarių skaičius</span>
                <span class="text-sm text-gray-900">
                  {{ crawler.roomsMin || 'Nenustatyta' }} - {{ crawler.roomsMax || 'Nenustatyta' }}
                </span>
              </template>
            </template>
          </div>
        </b-popover>
      </div>
    </div>
  </li>
</template>

<script>
import ApiService from '@/services/api.service';

export default {
  name: 'CrawlerItem',
  props: { crawler: Object, selected: Boolean },
  data() {
    return {
      loadingCrawler: false,
      isSelected: this.selected,
    };
  },
  computed: {
    itemId: function () {
      return `popover_${this.crawler.id}`;
    },
  },
  methods: {
    async onRunCrawler(crawlerId) {
      this.loadingCrawler = true;
      try {
        await ApiService.post(`/crawlers/run`, { crawlerId });
      } catch (err) {
        console.error(err);
      }
      this.loadingCrawler = false;
    },
  },
};
</script>

<style scoped></style>
