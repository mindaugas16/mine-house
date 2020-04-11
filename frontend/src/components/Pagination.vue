<template>
  <div class="is-flex align-items-center flex-column">
    <nav class="pagination mb-2 is-small is-centered justify-content-center" role="navigation" aria-label="pagination">
      <a class="pagination-previous is-hidden-mobile" :disabled="+meta.currentPage === 1" @click="onPrev">
        <span class="icon is-small">
          <i class="fa fa-arrow-left" aria-hidden="true"></i>
        </span>
      </a>
      <a class="pagination-next is-hidden-mobile" :disabled="+meta.currentPage === +meta.totalPages" @click="onNext">
        <span class="icon is-small">
          <i class="fa fa-arrow-right" aria-hidden="true"></i>
        </span>
      </a>
      <ul class="pagination-list flex-grow-0">
        <li v-for="page in pages" :key="page">
          <a v-if="!!page" class="pagination-link" :class="{ 'is-current': page === +meta.currentPage }" @click="onChangePage(page)">
            {{ page }}
          </a>
          <span v-else class="pagination-ellipsis">&hellip;</span>
        </li>
      </ul>
    </nav>
    <small class="is-size-7 has-text-grey"> Iš viso {{ meta.totalCount }} rezultatų </small>
  </div>
</template>

<script>
import router from '../router';

export default {
  name: 'Pagination',
  props: {
    meta: {
      type: Object,
      default: function () {
        return {
          totalPages: 0,
          showPerPage: 0,
          totalCount: 0,
          currentPage: 0,
        };
      },
    },
  },
  computed: {
    pages: function () {
      return generatePagination(this.meta);
    },
  },
  methods: {
    onChangePage(page) {
      router.replace({ path: '', query: { ...this.$route.query, page } });
    },
    onPrev() {
      this.onChangePage(+this.meta.currentPage - 1);
    },
    onNext() {
      this.onChangePage(+this.meta.currentPage + 1);
    },
  },
};

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
</script>

<style scoped lang="scss"></style>
