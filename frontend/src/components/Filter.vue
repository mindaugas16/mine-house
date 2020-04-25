<template>
  <div>
    <div class="flex flex-col mb-4">
      <p class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Grupuoti pagal</p>
      <div class="flex">
        <div class="relative w-full">
          <select id="sort" v-model="groupBy" @change="onChangeGroupBy">
            <option :value="null">Nesugrupuota</option>
            <option value="createdAt">Pridėjimo datą</option>
            <option value="updatedAt">Atnaujinimo datą</option>
            <option value="lastSeenAt">Paskutinio peržiūrėjimo datą</option>
            <option value="portalId">Portalą</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <span class="icon fill-current h-4 w-4 justify-center flex">
              <i class="fa fa-angle-down" aria-hidden="true"></i>
            </span>
          </div>
        </div>
        <button v-if="groupBy" class="px-2 ml-2 text-gray-600 hover:text-gray-800" aria-label="Close" @click="onClearGrouping">
          <span class="icon is-small">
            <i class="fa fa-close" aria-hidden="true"></i>
          </span>
        </button>
      </div>
    </div>
    <div class="flex flex-col">
      <p class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Portalai</p>
      <label v-for="portal in portals" :key="portal.id" class="text-gray-500 hover:text-gray-700 cursor-pointer" :for="portal.id">
        <input :id="portal.id" v-model="selectedPortals" type="checkbox" :value="portal.name" @change="onChange" />
        <span class="text-sm ml-2">{{ portal.title }} ({{ portal.realEstatesCount }})</span>
      </label>
    </div>
  </div>
</template>

<script>
import router from '../router';
import axios from 'axios';

export default {
  name: 'ListFilter',
  filters: {
    join(values, limit) {
      const items = [...values];
      if (items.length > limit) {
        return items.splice(0, limit).join(', ').concat('...');
      }
      return items.join(', ');
    },
  },
  data() {
    return {
      portals: [],
      selectedPortals: [],
      groupBy: null,
    };
  },
  async created() {
    try {
      const { data } = await axios.get(`${process.env.VUE_APP_API_HOST}/api/portals`);
      this.portals = data;
    } catch (err) {
      console.error(err);
    }
    const query = this.$route.query;
    if (query.portals) {
      this.selectedPortals = query.portals.split(',');
    } else {
      this.resetFilters();
    }
    if (query.groupBy) {
      this.groupBy = query.groupBy;
    }
  },
  methods: {
    onClearGrouping() {
      router.replace({
        query: { ...this.$route.query, groupBy: undefined },
      });
      this.groupBy = null;
    },
    onChangeGroupBy() {
      router.replace({
        query: { ...this.$route.query, groupBy: this.groupBy },
      });
    },
    resetFilters() {
      this.selectedPortals = this.portals.map(({ name }) => name);
    },
    onChange() {
      const portals = this.selectedPortals.join();
      this.appendToRoute(portals);
    },
    appendToRoute(portals) {
      router.replace({
        query: { ...this.$route.query, page: undefined, portals },
      });
    },
  },
};
</script>

<style scoped lang="scss">
button.is-text {
  text-decoration: none;
}
</style>
