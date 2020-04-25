<template>
  <div class="w-full">
    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="sort">
      Rušiuoti pagal
    </label>
    <div class="flex">
      <div class="relative w-full">
        <select id="sort" v-model="sort.property" @change="onChangeProperty">
          <option value="createdAt">Pridėjimo data</option>
          <option value="updatedAt">Atnaujinimo data</option>
          <option value="lastSeenAt">Paskutinio peržiūrėjimo data</option>
          <option value="price">Kaina</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <span class="icon fill-current h-4 w-4 justify-center flex">
            <i class="fa fa-angle-down" aria-hidden="true"></i>
          </span>
        </div>
      </div>
      <button class="px-2 ml-2 text-gray-600 hover:text-gray-800" @click="onChangeDirection" aria-label="Sort Direction">
        <span class="icon is-small">
          <i class="fa" :class="sort.direction === 'asc' ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc'" aria-hidden="true"></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import router from '../router';

export default {
  name: 'ListSort',
  data: () => {
    return {
      sort: {
        direction: 'desc',
        property: 'updatedAt',
      },
    };
  },
  created() {
    const { direction, property } = this.$route.query;
    if (direction) {
      this.sort.direction = direction;
    }
    if (property) {
      this.sort.property = property;
    }
  },
  methods: {
    onChangeProperty(event) {
      this.sort.property = event.target.value;
      this.onChangeQueryParams(this.sort);
    },
    onChangeDirection() {
      if (this.sort.direction === 'asc') {
        this.sort.direction = 'desc';
      } else {
        this.sort.direction = 'asc';
      }
      this.onChangeQueryParams(this.sort);
    },
    onChangeQueryParams(sort) {
      const { direction, property } = sort;

      router.replace({ path: '', query: { ...this.$route.query, page: undefined, direction, property } });
    },
  },
};
</script>

<style scoped lang="scss"></style>
