<template>
  <div class="is-flex align-items-center flex-column">
    <nav class="pagination mb-2 is-small is-centered justify-content-center" role="navigation" aria-label="pagination">
      <a class="pagination-previous" :disabled="+meta.currentPage === 1" @click="onPrev">Previous</a>
      <a class="pagination-next" :disabled="+meta.currentPage === +meta.totalPages" @click="onNext">Next page</a>
      <ul class="pagination-list flex-grow-0">
        <li v-for="page in pages" v-bind:key="page">
          <a class="pagination-link" v-if="!!page" @click="onChangePage(page)" v-bind:class="{ 'is-current': page === +meta.currentPage }">
            {{ page }}
          </a>
          <span class="pagination-ellipsis" v-else>&hellip;</span>
        </li>
      </ul>
    </nav>
    <small class="is-size-7 has-text-grey">
      Iš viso {{meta.totalCount}} rezultatų
    </small>
  </div>
</template>

<script>
import router from '../router';

function generatePagination(meta) {
  let { currentPage, totalPages } = meta;
  const maxPages = 5;
  currentPage = +currentPage;

  let startPage, endPage;

  if (totalPages <= maxPages) {
    startPage = 1;
    endPage = totalPages;
  } else {
    let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
    let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrentPage) {
      startPage = 1;
      endPage = maxPages;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      startPage = totalPages - maxPages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(i => startPage + i);
  if (endPage + Math.floor(maxPages / 2) <= totalPages) {
    pages = [...pages, null];
  }
  if (endPage !== totalPages) {
    pages.push(totalPages);
  }
  if (startPage - Math.floor(maxPages / 2) >= 1) {
    pages = [null, ...pages];
  }
  if (startPage !== 1) {
    pages.unshift(1);
  }
  return pages;
}

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
  watch: {
    meta: function () {
      console.log(this.meta);
      this.pages = generatePagination(this.meta);
    },
  },
  data() {
    return {
      pages: [],
    };
  },
  methods: {
    onChangePage(page) {
      router.replace({ path: '', query: { ...this.$route.query, page } });
      this.pages = generatePagination({ ...this.meta, currentPage: page });
    },
    onPrev() {
      this.onChangePage(+this.meta.currentPage - 1);
    },
    onNext() {
      this.onChangePage(+this.meta.currentPage + 1);
    },
  },
  mounted() {
    this.pages = generatePagination(this.meta);
  },
};
</script>

<style scoped lang="scss"></style>
