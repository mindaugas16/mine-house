<template>
  <div class="dropdown" :class="{ 'is-active': isOpen }" v-click-outside="hide">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="isOpen = !isOpen">
        <slot name="button"></slot>
        <span class="icon is-small">
          <i class="fa fa-angle-down" aria-hidden="true"></i>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  data() {
    return {
      isOpen: false,
      clickOutsideFn: {},
    };
  },
  methods: {
    hide() {
      this.isOpen = false;
    },
  },
  directives: {
    clickOutside: (() => {
      let state = {};
      return {
        bind: function (el, binding, vnode) {
          state = function (event) {
            if (!(el === event.target || el.contains(event.target))) {
              vnode.context[binding.expression](event);
            }
          };
          document.body.addEventListener('click', state);
        },
        unbind: function () {
          document.body.removeEventListener('click', state);
        },
      };
    })(),
  },
};
</script>

<style scoped lang="scss"></style>
