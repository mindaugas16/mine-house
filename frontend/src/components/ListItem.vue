<template>
  <div class="bg-white shadow-md rounded overflow-hidden mb-4">
    <div class="flex sm:flex-col">
      <div class="relative w-1/4 sm:w-full">
        <div class="absolute top-10 left-10 flex align-items-start">
          <button
            class="btn btn--favorite"
            :class="item.starred ? 'text-yellow-500' : 'text-white'"
            aria-label="Favorite"
            @click="onMarkAsStarred()"
          >
            <span class="icon">
              <i class="fa fa-star fa-lg"></i>
            </span>
          </button>
          <div>
            <span v-if="!item.lastSeenAt && item.new" class="bg-green-500 badge py-1 ml-2">Naujas</span>
            <span v-if="!item.lastSeenAt && item.updatedAt" class="bg-orange-500 badge py-1 ml-2">
              Atnaujintas
            </span>
          </div>
        </div>
        <img v-if="item.imagePath" class="sm:w-full" :src="item.imagePath" alt="Image" />
        <img v-else src="@/assets/placeholder.png" alt="Image" />
      </div>
      <div class="flex justify-between flex-1 pl-4 pr-8 py-5 sm:px-4">
        <div class="flex flex-col justify-between w-full">
          <div class="flex justify-between sm:mb-4">
            <div class="flex-grow">
              <a
                :href="item.link"
                target="_blank"
                rel="noreferrer"
                class="text-xl hover:underline"
                @click="onMarkAsSeen()"
                v-html="$options.filters.highlight(item.title, $route.query.term)"
              ></a>
            </div>
            <div class="ml-4 flex items-start justify-end flex-shrink-0">
              <button
                v-if="item.lastPriceChanges.length"
                class="badge"
                :class="item.lastPriceChanges[0].priceChangePercentage > 0 ? 'bg-green-500' : 'bg-red-500'"
                aria-label="Price Change"
              >
                {{ item.lastPriceChanges[0].priceChangePercentage | percentage }}
              </button>
              <span class="text-gray-600 text-lg">
                {{ item.price | currency }}
              </span>
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
        return moment(String(value)).format('MM/DD/YYYY hh:mm');
      }
    },
    ago: function (value) {
      if (value) {
        return moment(value).fromNow();
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
    ...mapActions(['markAsSeen', 'markAsStarred']),
    onMarkAsSeen() {
      this.markAsSeen(this.item.id);
    },
    onMarkAsStarred() {
      this.markAsStarred({ id: this.item.id, starred: !this.item.starred });
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
