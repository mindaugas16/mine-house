<template>
  <div class="w-full">
    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="sort">
      Rušiuoti pagal
    </label>
    <div class="flex">
      <div class="relative w-full">
        <select id="sort" v-model="sort.property" @change="onChangeProperty">
          <option value="newest">Naujausi viršuje</option>
          <option value="update">Atnaujinti viršuje</option>
          <option value="cheapest">Pigiausi viršuje</option>
          <option value="expensive">Brangiausi viršuje</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <span class="icon fill-current h-4 w-4 justify-center flex">
            <i class="fa fa-angle-down" aria-hidden="true"></i>
          </span>
        </div>
      </div>
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
        property: 'newest',
      },
    };
  },
  created() {
    const { property } = this.$route.query;
    if (property) {
      this.sort.property = property;
    }
  },
  methods: {
    onChangeProperty(event) {
      this.sort.property = event.target.value;
      this.onChangeQueryParams(this.sort);
    },
    onChangeQueryParams(sort) {
      const { property } = sort;

      router.replace({ path: '', query: { ...this.$route.query, page: undefined, property } });
    },
  },
};
</script>

<style scoped lang="scss"></style>
