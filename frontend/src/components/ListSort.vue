<template>
  <div>
    <div class="field has-addons">
      <div class="control">
        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="onChangeDirection">
          <span class="icon is-small">
            <i class="fa" :class="sort.direction === 'asc' ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc'" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="control">
        <div class="select">
          <select v-model="sort.property" @change="onChangeProperty">
            <option value="createdAt">Pridėjimo data</option>
            <option value="updatedAt">Atnaujinimo data</option>
            <option value="lastSeenAt">Paskutinio peržiūrėjimo data</option>
            <option value="price">Kaina</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router';

export default {
  name: 'ListSort',
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

      router.replace({ path: '', query: { ...this.$route.query, direction, property } });
    },
  },
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
      this.sort.direction = property;
    }
  },
};
</script>

<style scoped lang="scss"></style>
