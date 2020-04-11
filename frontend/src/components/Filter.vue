<template>
  <div class="is-flex align-items-center">
    <Dropdown>
      <template v-slot:button>
        <p>
          <span>Portalai</span>
          <span v-if="isSomeSelected">: {{ portals.filter(item => item.isSelected).map(item => item.label) | join(3) }}</span>
        </p>
      </template>
      <template v-slot:content>
        <label v-for="portal in portals" :key="portal._id" class="checkbox dropdown-item">
          <input type="checkbox" @change="onChange" />
          {{ portal.title }}
        </label>
      </template>
    </Dropdown>
    <button v-if="!isEverySelected" class="button is-text ml-3 is-small" @click="onClearFilters()">
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
    };
  },
  computed: {
    isSomeSelected: function () {
      return this.portals.some(({ isSelected }) => !!isSelected);
    },
    isEverySelected: function () {
      return this.portals.every(({ isSelected }) => !!isSelected);
    },
  },
  created() {
    axios
      .get('http://localhost:3000/api/portals')
      .then(({ data }) => {
        this.portals = data;
      })
      .catch(err => console.error(err));
  },
  methods: {
    onClearFilters() {
      this.portals.forEach(portal => (portal.isSelected = true));
      this.appendToRoute();
    },
    onChange() {
      this.debounce(() => {
        const selectedPortals = this.portals.filter(portal => portal.isSelected);
        const reducedPortals = selectedPortals.length ? selectedPortals.map(({ id }) => id).join() : undefined;

        this.appendToRoute(reducedPortals);
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
