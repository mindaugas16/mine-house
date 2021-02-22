<template>
  <div class="overflow-hidden mb-4">
    <div class="flex sm:flex-col">
      <div class="relative w-1/4 sm:w-full">
        <div class="absolute top-10 left-10 flex align-items-start">
          <button
            class="btn btn--favorite"
            :class="item.favorite ? 'text-yellow-500' : 'text-white'"
            aria-label="Favorite"
            @click="onFavorite()"
          >
            <span class="icon">
              <i class="fa fa-star fa-lg"></i>
            </span>
          </button>
          <div>
            <span v-if="!item.lastSeenAt && item.new" class="bg-green-500 badge py-1 ml-2">Naujas</span>
            <span v-if="!item.lastSeenAt && item.updatedAt" class="bg-yellow-500 badge py-1 ml-2">
              Atnaujintas
            </span>
          </div>
        </div>
        <img
          class="sm:w-full rounded"
          :src="item.imagePath ? item.imagePath : require('@/assets/placeholder.png')"
          alt="Image"
        />
      </div>
      <div class="flex justify-between flex-1 lg:pl-4 px-0 sm:py-4 md:px-4">
        <div class="flex flex-col justify-between w-full">
          <div class="flex justify-between sm:mb-4">
            <div class="flex-grow">
              <a
                :href="item.link"
                class="text-xl hover:underline"
                target="_blank"
                rel="noreferrer"
                @click="onMarkAsSeen()"
              >
                {{ item.title }}
              </a>
            </div>
            <div class="ml-4 flex flex-col items-end flex-shrink-0">
              <router-link
                :to="'/real-estate/' + item.id"
                class="text-gray-600 text-lg"
                @click="$bvModal.show('price-change-modal')"
              >
                {{ item.price | currency }}
              </router-link>
              <div v-if="item.lastPriceChangeDiffPercentage">
                <i
                  class="fa mr-1"
                  :class="
                    item.lastPriceChangeDiffPercentage > 0 ? 'fa-arrow-up text-red-500' : 'fa-arrow-down text-green-500'
                  "
                ></i>
                <span class="text-gray-500">{{ Math.abs(item.lastPriceChangeDiffPercentage) | percentage }}</span>
              </div>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="text-sm self-end flex">
              <div class="mr-4">
                <span class="icon">
                  <i class="fa fa-square-o"></i>
                </span>
                {{ item.area | squareMeters }}
              </div>
              <div v-if="item.buildingStatus">
                <span class="icon">
                  <i class="fa fa-paint-brush"></i>
                </span>
                {{ item.buildingStatus }}
              </div>
            </div>
            <div>
              <p class="text-right text-gray-700 text-md flex flex-col">
                <small> Pridėta {{ item.createdAt | ago }} </small>
                <small v-if="item.updatedAt"> Paskutinį kartą atnaujinta {{ item.updatedAt | ago }} </small>
                <small v-if="item.lastSeenAt"> Paskutinį kartą žiūrėta {{ item.lastSeenAt | ago }} </small>
              </p>
            </div>
          </div>
        </div>
        <!--          <img-->
        <!--            v-if="item.portal.imagePath"-->
        <!--            :src="'http://backend:3000/api/assets/' + item.portal.imagePath"-->
        <!--            alt="Image"-->
        <!--            class="portal-image"-->
        <!--          />-->
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions } from 'vuex';

export default {
  name: 'ListItem',
  filters: {
    squareMeters: function (value) {
      return `${value} m²`;
    },
    percentage: function (value) {
      return `${value}%`;
    },
    currency: function (value) {
      return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`;
    },
    date: function (value) {
      if (value) {
        return moment(String(value)).format('MM/DD/YYYY HH:mm');
      }
    },
    ago: function (value) {
      if (value) {
        const date = moment(value);
        if (date.diff(moment(), 'days') > 1) {
          return !date.isSame(moment(), 'year') ? date.format('MMMM DD [d.]') : date.format('YYYY [m.] MMMM DD [d.]');
        }
        return date.fromNow();
      }
    },
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isOpenDropdown: false,
    };
  },
  methods: {
    ...mapActions(['markAsSeen', 'favorite']),
    onMarkAsSeen() {
      this.markAsSeen(this.item.id);
    },
    onFavorite() {
      this.favorite({ id: this.item.id, favorite: !this.item.favorite });
    },
  },
};
</script>

<style scoped lang="scss">
.btn {
  &--favorite {
    @apply flex justify-center border-0 rounded-full;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.2);
    transition: background 200ms;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
}

.portal-image {
  @apply h-12;
  max-width: 100px;
}
</style>
