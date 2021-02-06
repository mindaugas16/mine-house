<template>
  <div class="flex flex-col justify-center items-center">
    <nav class="flex" role="navigation" aria-label="pagination">
      <button
        class="order-first btn btn--page mr-3"
        :disabled="+meta.currentPage === 1"
        aria-label="Prev"
        @click="onPrev"
      >
        <span class="icon is-small">
          <i class="fa fa-arrow-left" aria-hidden="true"></i>
        </span>
      </button>

      <button
        class="order-last btn btn--page ml-3"
        :disabled="+meta.currentPage === +meta.totalPages"
        aria-label="Next"
        @click="onNext"
      >
        <span class="icon is-small">
          <i class="fa fa-arrow-right" aria-hidden="true"></i>
        </span>
      </button>

      <ul class="order-2 flex-grow-0 flex">
        <li v-for="page in pages" :key="page">
          <button
            v-if="!!page"
            class="btn btn--page mx-1"
            :class="{ selected: page === +meta.currentPage }"
            aria-label="Page"
            @click="onChangePage(page)"
          >
            {{ page }}
          </button>
          <span v-else class="flex items-end h-full">&hellip;</span>
        </li>
      </ul>
    </nav>
    <small class="mt-4 text-gray-500"> Iš viso {{ meta.totalCount }} rezultatų </small>
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

<style scoped lang="scss">
.btn {
  &--page {
    @apply p-0 w-8 h-8 text-sm bg-gray-200;

    &:hover,
    &.selected {
      @apply bg-gray-700 text-white;
    }
  }
}
</style>
