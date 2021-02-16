<template>
  <b-modal id="crawler-modal" ref="crawler-modal">
    <template #modal-title> Sukurti naują paiešką</template>
    <form id="create-crawler-form" @submit="onSubmit">
      <div class="px-4 py-5 bg-white sm:p-6">
        <div class="grid grid-cols-6 gap-6">
          <div class="col-span-6 sm:col-span-3">
            <label for="name" class="block text-sm font-medium text-gray-700">Pavadinimas</label>
            <input id="name" v-model="name" type="text" placeholder="Paieškos pavadinimas" />
          </div>

          <div class="col-span-6 sm:col-span-3">
            <label for="realEstateType" class="block text-sm font-medium text-gray-700">Būsto tipas</label>
            <select id="realEstateType" v-model="realEstateType">
              <option :value="null">Pasirinkite būsto tipą...</option>
              <option value="house">Namas</option>
              <option value="apartment">Butas</option>
            </select>
          </div>

          <template v-if="realEstateType === 'apartment'">
            <div class="col-span-6 sm:col-span-6 lg:col-span-2">
              <label for="rooms-min" class="block text-sm font-medium text-gray-700">Kambariai nuo</label>
              <input id="rooms-min" v-model="roomsMin" type="number" placeholder="Nuo" min="0" max="5" />
            </div>

            <div class="col-span-6 sm:col-span-6 lg:col-span-2">
              <label for="rooms-max" class="block text-sm font-medium text-gray-700">Kambariai iki</label>
              <input id="rooms-max" v-model="roomsMax" type="number" placeholder="Iki" min="0" max="5" />
            </div>
            <div class="clear"></div>
          </template>

          <div class="col-span-6 sm:col-span-6 lg:col-span-2">
            <label for="price-min" class="block text-sm font-medium text-gray-700">Kaina nuo</label>
            <input id="price-min" v-model="priceMin" type="number" placeholder="Nuo" min="0" />
          </div>

          <div class="col-span-6 sm:col-span-6 lg:col-span-2">
            <label for="price-max" class="block text-sm font-medium text-gray-700">Kaina iki</label>
            <input id="price-max" v-model="priceMax" type="number" placeholder="Iki" min="0" />
          </div>
          <div class="clear"></div>

          <div class="col-span-6 sm:col-span-6 lg:col-span-2">
            <label for="area-min" class="block text-sm font-medium text-gray-700">Plotas nuo</label>
            <input id="area-min" v-model="areaMin" type="number" placeholder="Nuo" min="0" />
          </div>
          <div class="col-span-6 sm:col-span-6 lg:col-span-2">
            <label for="area-max" class="block text-sm font-medium text-gray-700">Plotas iki</label>
            <input id="area-max" v-model="areaMax" type="number" placeholder="Iki" min="0" />
          </div>
        </div>
      </div>
    </form>
    <template #modal-footer>
      <button class="btn btn--default" @click="hideModal">Atšaukti</button>
      <button class="btn btn--primary" type="submit" form="create-crawler-form">Išsaugoti</button>
    </template>
  </b-modal>
</template>

<script>
import ApiService from '@/services/api.service';

export default {
  name: 'CrawlerModal',
  data: () => {
    return {
      errors: [],
      realEstateType: 'apartment',
      name: 'Butas Vilnius',
      roomsMin: '1',
      roomsMax: '2',
      areaMin: null,
      areaMax: null,
      priceMin: '100000',
      priceMax: '800000',
    };
  },
  methods: {
    hideModal() {
      this.$refs['crawler-modal'].hide();
    },
    async onSubmit(e) {
      e.preventDefault();

      this.errors = [];

      if (!this.realEstateType) {
        this.errors.push('realEstatesType required');
      }

      if (!this.name) {
        this.errors.push('name required');
      }

      if (this.errors.length) {
        return;
      }

      const body = {
        realEstateType: this.realEstateType,
        name: this.name,
        roomsMin: +this.roomsMin,
        roomsMax: +this.roomsMax,
        areaMin: +this.areaMin,
        areaMax: +this.areaMax,
        priceMin: +this.priceMin,
        priceMax: +this.priceMax,
      };
      await ApiService.put(`/crawlers/`, body);
      this.hideModal();
    },
  },
};
</script>

<style scoped></style>
