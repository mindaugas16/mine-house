<template>
  <nav class="pagination is-small" role="navigation" aria-label="pagination">
    <a class="pagination-previous" :disabled="+meta.currentPage === 1" @click="onPrev">Previous</a>
    <a class="pagination-next" :disabled="+meta.currentPage === +meta.totalPages" @click="onNext">Next page</a>
    <ul class="pagination-list">
      <li v-for="page in pages" v-bind:key="page">
        <a class="pagination-link" @click="onChangePage(page)" v-bind:class="{ 'is-current': page === +meta.currentPage }">
          {{ page }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    meta: {
      totalPages: 0,
      showPerPage: 0,
      totalCount: 0,
      currentPage: 0,
    },
  },
  data() {
    return {
      pages: [],
    };
  },
  methods: {
    onChangePage(page) {
      window.scrollTo(0, 0);
      this.$emit('change', page);
    },
    onPrev() {
      this.onChangePage(+this.meta.currentPage - 1);
    },
    onNext() {
      this.onChangePage(+this.meta.currentPage + 1);
    },
  },
  mounted() {
    this.pages = Array.from({ length: this.meta.totalPages }, (v, k) => k + 1); // create array of pages and increment values
  },
};
</script>

<style scoped lang="scss"></style>
