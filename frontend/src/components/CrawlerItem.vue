<template>
  <li>
    <div>
      <div class="flex justify-between py-2">
        <router-link :to="'/search/' + crawler.id" class="text-sm hover:underline">
          {{ crawler.name }}
        </router-link>
        <div>
          <router-link :to="'/search/' + crawler.id" class="bg-green-500 hover:bg-green-600 badge py-1">
            <span>{{ crawler.realEstatesCount }}</span>
          </router-link>
          <button
            class="px-2 text-gray-500 hover:text-gray-700"
            :class="{ 'is-loading': loadingCrawler, spinning: loadingCrawler }"
            :disabled="loadingCrawler"
            @click="onRunCrawler()"
          >
            <span class="icon is-small">
              <i class="fa fa-refresh" aria-hidden="true"></i>
            </span>
          </button>
          <button
            :id="itemId"
            class="px-2 text-gray-500 hover:text-gray-700"
            @click="visibleDetails = !visibleDetails"
            :class="{ 'text-gray-700': visibleDetails }"
          >
            <span class="icon is-small">
              <i class="fa fa-info" aria-hidden="true"></i>
            </span>
          </button>
          <button class="px-2 text-gray-500 hover:text-gray-700" @click="onCopy()">
            <span class="icon is-small">
              <i class="fa fa-pencil" aria-hidden="true"></i>
            </span>
          </button>
          <button class="px-2 text-red-500 hover:text-red-700" @click="onDelete()">
            <span class="icon is-small">
              <i class="fa fa-times" aria-hidden="true"></i>
            </span>
          </button>
        </div>
      </div>
      <div v-if="visibleDetails" class="my-2">
        <div class="grid grid-cols-2 gap-2">
          <span class="text-sm font-medium text-gray-400">Būsto tipas</span>
          <span class="text-sm text-gray-900">
            {{ crawler.realEstateType === 'house' ? 'Namas' : 'Butas' }}
          </span>

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
          <template v-if="crawler.crawledAt">
            <span class="text-sm font-medium text-gray-400">Paskutinį kartą vykdyta</span>
            <span class="text-sm text-gray-900">{{ crawler.crawledAt | date }}</span>
          </template>
        </div>
      </div>
    </div>
    <hr class="mt-2 mb-4" />
  </li>
</template>

<script>
import { mapActions } from 'vuex';
import moment from 'moment';

export default {
  name: 'CrawlerItem',
  props: { crawler: null },
  filters: {
    date: function (value) {
      if (value) {
        return moment(String(value)).format('YYYY [m.] MMMM DD [d.] HH:mm');
      }
    },
  },
  data() {
    return {
      loadingCrawler: false,
      visibleDetails: false,
    };
  },
  computed: {
    itemId: function () {
      return `popover_${this.crawler.id}`;
    },
  },
  methods: {
    ...mapActions(['runCrawler', 'selectCrawler']),
    async onRunCrawler() {
      if (this.loadingCrawler) {
        return;
      }
      this.loadingCrawler = true;
      await this.runCrawler(this.crawler.id);
      this.loadingCrawler = false;
    },
    onDelete() {
      this.$emit('delete', this.crawler.id);
    },
    onCopy() {
      this.selectCrawler(this.crawler);
    },
  },
};
</script>

<style scoped></style>
