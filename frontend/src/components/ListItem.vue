<template>
  <div class="box is-shadowless" v-bind:class="{ 'box--new': item.new }">
    <div class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <img v-if="item.provider === 0" src="../assets/images/aruodas.png" alt="Image" />
          <img v-else-if="item.provider === 1" src="../assets/images/domoplius.svg" alt="Image" />
          <img v-else-if="item.provider === 2" src="../assets/images/skelbiu.png" alt="Image" />
          <img v-else-if="item.provider === 3" src="../assets/images/kampas.svg" alt="Image" />
        </figure>
      </div>
      <div class="media-content is-flex-tablet justify-content-between align-items-center">
        <div class="content">
          <h5>
            {{ item.title }}
          </h5>

          <div>
            <div class="is-flex">
              <div class="details-block">
                <span class="icon">
                  <i class="fa fa-money"></i>
                </span>
                <span>
                  {{ item.price | currency }}
                </span>
                <span v-if="item.priceChangePercentage && item.priceChange != null">
                  <span class="icon">
                    <i
                      class="fa"
                      v-bind:class="item.priceChange ? ['fa-arrow-up', 'has-text-success'] : ['fa-arrow-down', 'has-text-danger']"
                    ></i>
                  </span>
                  {{ item.priceChangePercentage | percentage }}
                </span>
              </div>
              <div class="details-block">
                <span class="icon">
                  <i class="fa fa-square-o"></i>
                </span>
                {{ item.area | squareMeters }}
              </div>
              <div class="details-block" v-if="item.buildingStatus">
                <span class="icon">
                  <i class="fa fa-paint-brush"></i>
                </span>
                {{ item.buildingStatus }}
              </div>
            </div>
            <div class="is-flex flex-column">
              <small class="is-size-7 has-text-grey"> Pridėta: {{ item.createdAt | date }} </small>
              <small class="is-size-7 has-text-grey" v-if="!isSameDates()"> Paskutinį kartą atnaujinta: {{ item.updatedAt | date }} </small>
            </div>
          </div>
        </div>
        <div class="is-flex flex-column">
          <div class="field has-addons">
            <p class="control">
              <a class="button" :href="item.link" target="_blank" rel="noreferrer" @click="onMarkAsSeen()">Peržiūrėti</a>
            </p>
            <div class="control">
              <div class="dropdown is-right" :class="{ 'is-active': isOpenDropdown }">
                <div class="dropdown-trigger">
                  <button class="button" aria-haspopup="true" aria-controls="dropdown-menu2" @click="isOpenDropdown = !isOpenDropdown" disabled>
                    <span class="icon is-small">
                      <i class="fa fa-angle-down" aria-hidden="true"></i>
                    </span>
                  </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu2" role="menu">
                  <div class="dropdown-content">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <small class="is-size-7 has-text-grey-light">
            {{ item.lastSeenAt | date }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'ListItem',
  props: {
    item: Object,
  },
  data() {
    return {
      isOpenDropdown: false,
    };
  },
  filters: {
    squareMeters: function (value) {
      return `${value} m²`;
    },
    percentage: function (value) {
      return `${value} %`;
    },
    currency: function (value) {
      return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`;
    },
    date: function (value) {
      if (value) {
        return moment(String(value)).format('MM/DD/YYYY hh:mm');
      }
    },
  },
  methods: {
    onMarkAsSeen() {
      // @TODO; avoid prop mutation, but have to solve issue when trying update item from response
      axios.patch(`http://localhost:3000/api/real-estate/${this.item._id}`, {}).then();
    },
    isSameDates() {
      return moment(this.item.createdAt).isSame(moment(this.item.updatedAt));
    },
  },
};
</script>

<style scoped lang="scss">
.box {
  border-radius: 0;

  &--new {
    background-color: #e2eff1;
  }

  .details-block:not(:last-child) {
    margin-right: 20px;
  }
}
</style>
