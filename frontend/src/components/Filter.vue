<template>
  <div class="is-flex align-items-center">
    <Dropdown>
      <template v-slot:button>
        <p>
          <span>Portalai</span>
          <span v-if="selectedPortals.length">: {{ selectedPortalsNames | join(3) }}</span>
        </p>
      </template>
      <template v-slot:content>
        <label v-for="portal in portals" :key="portal.id" class="checkbox dropdown-item">
          <input v-model="selectedPortals" type="checkbox" :value="portal.name" @change="onChange" />
          {{ portal.title }} ({{ portal.realEstatesCount }})
        </label>
      </template>
    </Dropdown>
    <button v-if="isFiltersChanged" class="button is-text ml-3 is-small" @click="onClearFilters()">
      <span class="icon is-small">
        <i class="fa fa-remove" aria-hidden="true"></i>
      </span>
      <span>Išvalyti filtrus</span>
    </button>
  </div>
</template>

<script>
import Dropdown from './ui/Dropdown';
import router from '../router';
import axios from 'axios';

export default {
  name: 'ListFilter',
  filters: {
    join(values, limit) {
      if (values.length > limit) {
        return values.splice(0, limit).join(', ').concat('...');
      }
      return values.join(', ');
    },
  },
  components: { Dropdown },
  data() {
    return {
      portals: [],
      selectedPortals: [],
    };
  },
  computed: {
    selectedPortalsNames() {
      return this.selectedPortals.map(portal => {
        const found = this.portals.find(({ name }) => name === portal);
        return found.title;
      });
    },
    isFiltersChanged() {
      return this.selectedPortals.length !== this.portals.length;
    },
  },
  async created() {
    try {
      const { data } = await axios.get('http://localhost:3000/api/portals');
      this.portals = data;
    } catch (err) {
      console.error(err);
    }
    if (this.$route.query.portals) {
      this.selectedPortals = this.$route.query.portals.split(',');
    } else {
      this.resetFilters();
    }
  },
  methods: {
    onClearFilters() {
      this.resetFilters();
      this.appendToRoute();
    },
    resetFilters() {
      this.selectedPortals = this.portals.map(({ name }) => name);
    },
    onChange() {
      this.debounce(() => {
        this.appendToRoute(this.selectedPortals.join());
      });
    },
    appendToRoute(portals) {
      router.replace({
        path: '',
        query: { ...this.$route.query, page: undefined, portals },
      });
    },
    debounce: function (callback) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        callback();
      }, 500);
    },
  },
};
</script>

<style scoped lang="scss">
button.is-text {
  text-decoration: none;
}
</style>
