<template>
  <div class="box" :class="{ 'box--new': item.new }">
    <div class="is-flex">
      <div class="media-left is-relative">
        <div class="buttons align-items-start">
          <button class="button button--favorite" :class="{ starred: item.starred }" @click="onMarkAsStarred()">
            <span class="icon">
              <i class="fa fa-star fa-lg"></i>
            </span>
          </button>
          <span v-if="!item.lastSeenAt" class="tag is-success">Naujas</span>
        </div>
        <figure class="real-estate-image image">
          <img v-if="item.imagePath" :src="'http://localhost:3000/api/assets/' + item.imagePath" alt="Image" />
          <img v-else src="@/assets/placeholder.png" alt="Image" />
        </figure>
      </div>
      <div class="media-content is-flex-tablet justify-content-between align-items-center">
        <div class="content">
          <div>
            <a :href="item.link" target="_blank" rel="noreferrer" class="link" @click="onMarkAsSeen()">
              {{ item.title }}
            </a>
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
                      :class="item.priceChange ? ['fa-arrow-up', 'has-text-success'] : ['fa-arrow-down', 'has-text-danger']"
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
              <div v-if="item.buildingStatus" class="details-block">
                <span class="icon">
                  <i class="fa fa-paint-brush"></i>
                </span>
                {{ item.buildingStatus }}
              </div>
            </div>
          </div>

          <div class="is-flex flex-column justify-content-between">
            <div class="is-flex flex-column">
              <small class="is-size-7 has-text-grey"> Pridėta {{ item.createdAt | ago }} </small>
              <small v-if="item.updatedAt" class="is-size-7 has-text-grey"> Paskutinį kartą atnaujinta {{ item.updatedAt | ago }} </small>
              <small v-if="item.lastSeenAt" class="is-size-7 has-text-grey"> Paskutinį kartą žiūrėta {{ item.lastSeenAt | ago }} </small>
            </div>
          </div>
        </div>
        <div class="is-flex">
          <figure class="image">
            <img
              v-if="item.portal.imagePath"
              :src="'http://localhost:3000/api/assets/' + item.portal.imagePath"
              alt="Image"
              class="portal-image"
            />
          </figure>
        </div>
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
.box {
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 7px 10px rgba(0, 0, 0, 0.05);

  .real-estate-image {
    img {
      height: 200px;
      width: auto;
    }
  }

  .link {
    font-size: 1.2em;
    color: black;

    &:hover {
      text-decoration: underline;
    }
  }

  .portal-image {
    height: 35px;
    width: auto;
    max-width: 100px;
  }

  &--new {
  }

  .details-block:not(:last-child) {
    margin-right: 20px;
  }

  .media-left {
    margin: -1.25rem;
    margin-right: 1rem;
  }

  .media-content {
    .content {
      width: 100%;
      height: 100%;
      margin: 0;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
    }
  }

  .buttons {
    top: 10px;
    left: 10px;
    position: absolute;
    z-index: 1;

    .button {
      border: 0;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 50%;
      color: white;

      &--favorite {
        transition: background 200ms;

        &.starred {
          color: yellow;
        }
      }

      &:hover {
        background: rgba(0, 0, 0, 0.4);
      }
    }
  }
}
</style>
