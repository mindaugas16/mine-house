<template>
  <div v-if="realEstate">
    <div class="flex">
      <a @click="$router.go(-1)" class="py-2 px-3 cursor-pointer mb-3 block">
        <i class="fa fa-arrow-circle-left mr-1"></i>
        <span>Grįžti į sąrašą</span>
      </a>
    </div>

    <ListItem :item="realEstate"></ListItem>

    <hr class="mt-4 mb-6" />
    <h2 class="block uppercase tracking-wide text-gray-700 font-bold mb-2">Kainų pokyčiai</h2>

    <div class="lg:grid grid-flow-col grid-cols-2 gap-4">
      <table class="rounded shadow-sm min-w-full divide-y divide-gray-200 border-collapse w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
            >
              Kaina
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
            >
              Data
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
            >
              Pokytis
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="priceChange in realEstate.priceChanges"
            v-bind:key="priceChange.id"
            class="bg-white flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
          >
            <td
              class="px-6 py-4 whitespace-nowrap w-full lg:w-auto p-3 text-gray-800 text-center border-b flex lg:table-cell items-center justify-between"
            >
              <span class="lg:hidden font-medium text-gray-500 uppercase">Kaina</span>
              {{ priceChange.price | currency }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap w-full lg:w-auto p-3 text-gray-800 text-center border-b flex lg:table-cell items-center justify-between"
            >
              <span class="lg:hidden font-medium text-gray-500 uppercase">Data</span>

              <div class="text-sm text-gray-900">
                {{ priceChange.createdAt | date }}
              </div>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap w-full lg:w-auto p-3 text-gray-800 text-center border-b flex lg:table-cell items-center justify-between"
            >
              <span class="lg:hidden font-medium text-gray-500 uppercase">Pokytis</span>

              <div v-if="+priceChange.diffPercentage">
                <i
                  class="fa mr-1"
                  :class="priceChange.diffPercentage > 0 ? 'fa-arrow-up text-red-500' : 'fa-arrow-down text-green-500'"
                ></i>
                <span class="text-gray-500">{{ Math.abs(priceChange.diffPercentage) | percentage }}</span>
              </div>
              <div v-else>
                -
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-white rounded shadow-sm md:mt-4">
        <apexchart v-if="series.length" width="100%" type="line" :options="options" :series="series"></apexchart>
        <div v-else class="h-full flex items-center justify-center">
          <span class="font-medium text-gray-500 uppercase">Jokių kainų pokyčių šiuo metu nėra užregistruota.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ListItem from '@/components/ListItem';
import moment from 'moment';

export default {
  name: 'RealEstate',
  components: { ListItem },
  filters: {
    currency: function (value) {
      return formatCurrency(value);
    },
    date: function (value) {
      if (value) {
        return moment(String(value)).format('YYYY [m.] MMMM DD [d.] HH:mm');
      }
    },
    percentage: function (value) {
      return `${value}%`;
    },
  },
  data: function () {
    return {
      options: {
        chart: {
          id: 'vuechart-example',
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        tooltip: {
          y: {
            show: true,
            formatter: value => formatCurrency(value),
          },
        },
        xaxis: {
          type: 'category',
          labels: {
            formatter: function (value) {
              return moment(value).format('YYYY-MM-DD');
            },
          },
          categories: this.realEstate?.priceChanges.map(item => {
            return item.createdAt;
          }),
        },
        markers: {
          size: [4, 7],
        },
      },
      series: [],
    };
  },
  computed: {
    ...mapGetters(['realEstate']),
    id() {
      return this.$route.params.id;
    },
  },
  async created() {
    await this.getRealEstate();
  },
  methods: {
    ...mapActions(['fetchRealEstate']),
    async getRealEstate() {
      const realEstate = await this.fetchRealEstate(this.id);
      if (realEstate.priceChanges.length < 2) {
        return;
      }
      const changes = realEstate.priceChanges.slice(0).reverse();
      this.series = [
        {
          name: 'Kaina',
          data: changes.map(item => {
            return {
              x: item.createdAt,
              y: item.price,
            };
          }),
        },
      ];
      const averagePrice = Math.round(changes.map(({ price }) => price).reduce((a, b) => a + b, 0) / changes.length);
      this.options = {
        ...this.options,
        tooltip: {
          ...this.options.tooltip,
          x: {
            show: true,
            formatter: value => moment(changes[value - 1].createdAt).format('YYYY [m.] MMMM DD [d.] HH:mm'),
          },
        },
        annotations: {
          yaxis: [
            {
              y: averagePrice,
              borderColor: '#00E396',
              label: {
                borderColor: '#00E396',
                style: {
                  color: '#fff',
                  background: '#00E396',
                },
                text: `Kainos vidurkis ${formatCurrency(averagePrice)}`,
              },
            },
          ],
        },
      };
    },
  },
};

function formatCurrency(value) {
  return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`;
}
</script>

<style scoped></style>
