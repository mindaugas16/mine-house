<template>
  <form class="relative w-full search" @submit="onSubmit">
    <label class="m-0">
      <input
        v-model="value"
        class="search__input"
        type="text"
        placeholder="Skelbimų paieška"
        @input="onValueChanges"
        @keyup.up="onFocusPrev"
        @keyup.down="onFocusNext"
        @keyup.enter="onSelectFocused"
        @keyup.esc="onEscape"
        @keyup.tab="onFocusNext"
        @blur="onSelect(focusedSuggestionIndex)"
        @focus="onValueChanges"
      />
    </label>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <span class="icon fill-current h-4 w-4 justify-center flex">
        <i class="fa fa-search" aria-hidden="true"></i>
      </span>
    </div>
    <div class="search__suggestions rounded bg-white shadow" :class="{ show: isSuggestionsAvailable }">
      <ul>
        <li
          v-for="(item, index) in suggestions"
          :key="index"
          :class="{ focused: focusedSuggestionIndex === index }"
          @mouseenter="focusedSuggestionIndex = index"
          @mouseleave="focusedSuggestionIndex = -1"
          @click="onSelect(index)"
          v-html="item"
        ></li>
      </ul>
    </div>
  </form>
</template>

<script>
import debounce from 'debounce';
import router from '../router';
import ApiService from '../services/api.service';

export default {
  name: 'Search',
  data() {
    return {
      value: '',
      focusedSuggestionIndex: -1,
      suggestions: [],
      prevValue: '',
    };
  },
  computed: {
    isSuggestionsAvailable() {
      return this.suggestions && this.suggestions.length;
    },
    trimmedValue() {
      return this.value ? this.value.trim() : this.value;
    },
    inputField() {
      return document.querySelector('.search__input');
    },
  },
  created() {
    const { term } = this.$route.query;
    this.value = term;
  },
  methods: {
    getSuggestions(term) {
      return ApiService.get(`/real-estates/autocomplete`, { term });
    },
    onValueChanges: debounce(async function () {
      if (!this.trimmedValue) {
        this.onClose();
        return;
      }
      if (this.trimmedValue === this.prevValue) {
        return;
      }
      this.prevValue = this.trimmedValue;
      const { data } = await this.getSuggestions(this.trimmedValue);
      this.suggestions = data;
    }, 250),
    onFocusPrev(event) {
      event.preventDefault();
      this.focusSuggestion(-1);
    },
    onFocusNext(event) {
      event.preventDefault();
      this.focusSuggestion(1);
    },
    focusSuggestion(step) {
      let nextIndex = this.focusedSuggestionIndex;
      nextIndex += step;
      if (nextIndex >= this.suggestions.length) {
        nextIndex = 0;
      } else if (nextIndex < 0) {
        nextIndex = -1;
      }
      this.focusedSuggestionIndex = nextIndex;
    },
    onSelectFocused() {
      if (!this.value) {
        return;
      }
      if (this.focusedSuggestionIndex > -1) {
        this.onSelect(this.focusedSuggestionIndex);
      }
      this.onClose();
    },
    onClose() {
      this.suggestions = [];
      this.focusedSuggestionIndex = -1;
    },
    onSubmit(event) {
      event.preventDefault();
      this.inputField.blur();
    },
    search() {
      const term = this.trimmedValue;
      router
        .replace({
          query: { ...this.$route.query, term: term || undefined },
        })
        .catch(() => {});
      this.inputField.blur();
      this.onClose();
    },
    onSelect(index) {
      if (index > -1) {
        this.value = this.suggestions[index];
      }
      this.search();
      this.onClose();
    },
    onEscape() {
      this.value = '';
      this.inputField.blur();
      this.onClose();
    },
  },
};
</script>

<style scoped lang="scss">
.search {
  position: relative;

  &__input {
    padding-right: 30px !important;
  }

  &__suggestions {
    position: absolute;
    margin-top: 10px;
    width: 100%;
    z-index: 1;
    display: none;

    &.show {
      animation: fade-in 0.3s;
      display: block;
    }

    ul {
      li {
        @apply px-3 py-2 cursor-pointer text-gray-700;

        &.focused {
          @apply bg-gray-200;
        }
      }
    }
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: scale(0);
      -webkit-transform: scale(0);
    }

    100% {
      opacity: 1;
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
}
</style>
