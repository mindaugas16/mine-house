<template>
  <div class="is-flex align-items-center">
    <Dropdown>
      <template v-slot:button>
        <p>
          <span>Portalai</span>
          <span v-if="isSomeSelected()">: {{ portals.filter(item => item.isSelected).map(item => item.label) | join(3) }}</span>
        </p>
      </template>
      <template v-slot:content>
        <label class="checkbox dropdown-item" v-for="portal in portals" :key="portal.id">
          <input type="checkbox" v-model="portal.isSelected" @change="onChange" />
          {{ portal.label }}
        </label>
      </template>
    </Dropdown>
    <button class="button is-text ml-3 is-small" v-if="!isEverySelected()" @click="onClearFilters()">
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

export default {
  name: 'ListFilter',
  components: { Dropdown },
  data() {
    return {
      portals: [
        { id: 0, label: 'Aruodas', isSelected: true },
        { id: 1, label: 'Domoplius', isSelected: true },
        { id: 2, label: 'Skelbiu', isSelected: true },
        { id: 3, label: 'Kampas', isSelected: true },
      ],
    };
  },
  created() {
    const { portals } = this.$route.query;
    if (portals == null) {
      return;
    }
    const portalsId = portals.split(',').map(id => +id);
    this.portals.forEach(portal => (portal.isSelected = portalsId.indexOf(portal.id) > -1));
  },
  methods: {
    isSomeSelected() {
      return this.portals.some(({ isSelected }) => !!isSelected);
    },
    isEverySelected() {
      return this.portals.every(({ isSelected }) => !!isSelected);
    },
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
      router.replace({ path: '', query: { ...this.$route.query, page: undefined, portals } });
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
  filters: {
    join(values, limit) {
      if (values.length > limit) {
        return values.splice(0, limit).join(', ').concat('...');
      }
      return values.join(', ');
    },
  },
};
</script>

<style scoped lang="scss">
button.is-text {
  text-decoration: none;
}
</style>
