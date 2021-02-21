import {
  LOADING,
  SET_REAL_ESTATE,
  UPDATE_REAL_ESTATE,
  UPDATE_REAL_ESTATES,
  UPDATE_REAL_ESTATES_META,
} from '../mutation-types';
import ApiService from '../../services/api.service';

function priceChangePercentage(v1, v2) {
  return (((v1 - v2) / ((v1 + v2) / 2)) * 100).toFixed(2);
}

export default {
  state: {
    realEstates: [],
    realEstatesMeta: null,
    loading: false,
    realEstate: null,
  },
  actions: {
    async fetchRealEstates({ commit }, params) {
      commit(LOADING, true);
      try {
        const { data } = await ApiService.get(`/real-estates`, params);
        let { data: realEstates, meta: realEstatesMeta } = data;

        realEstates = realEstates.map(realEstate => {
          return {
            ...realEstate,
            lastPriceChangeDiffPercentage:
              realEstate.priceChanges.length > 1
                ? priceChangePercentage(realEstate.price, realEstate.priceChanges[1].price)
                : null,
          };
        });
        commit(UPDATE_REAL_ESTATES, realEstates);
        commit(UPDATE_REAL_ESTATES_META, realEstatesMeta);
      } catch (err) {
        console.error(err);
      }
      commit(LOADING, false);
    },
    async fetchRealEstate({ commit }, id) {
      try {
        const { data } = await ApiService.get(`/real-estates/${id}`);

        const realEstate = {
          ...data,
          priceChanges: data.priceChanges.map((item, i) => {
            return {
              ...item,
              diffPercentage: data.priceChanges[i + 1]
                ? priceChangePercentage(+data.priceChanges[i].price, +data.priceChanges[i + 1].price)
                : null,
            };
          }),
          lastPriceChangeDiffPercentage:
            data.priceChanges.length > 1 ? priceChangePercentage(data.price, data.priceChanges[1].price) : null,
        };
        commit(SET_REAL_ESTATE, realEstate);
        return realEstate;
      } catch (err) {
        console.error(err);
      }
    },
    async markAsSeen({ commit }, id) {
      try {
        const { data: values } = await ApiService.patch(`/real-estates/${id}/mark-as-seen`, {});
        commit(UPDATE_REAL_ESTATE, { id, values });
      } catch (err) {
        console.error(err);
      }
    },
    async favorite({ commit }, { id, favorite }) {
      try {
        await ApiService.patch(`/real-estates/${id}/favorite`, { favorite });
        commit(UPDATE_REAL_ESTATE, { id, values: { favorite } });
      } catch (err) {
        console.error(err);
      }
    },
  },
  mutations: {
    [LOADING](state, loading) {
      state.loading = loading;
    },
    [SET_REAL_ESTATE](state, realEstate) {
      state.realEstate = realEstate;
    },
    [UPDATE_REAL_ESTATES](state, items) {
      state.realEstates = items;
    },
    [UPDATE_REAL_ESTATES_META](state, meta) {
      state.realEstatesMeta = meta;
    },
    [UPDATE_REAL_ESTATE](state, { id, values }) {
      state.realEstates = state.realEstates.map(item => {
        if (item.id !== id) {
          return item;
        }
        return {
          ...item,
          ...values,
        };
      });
    },
  },
  getters: {
    realEstates(state) {
      return state.realEstates;
    },
    realEstate(state) {
      return state.realEstate;
    },
    realEstatesMeta(state) {
      return state.realEstatesMeta;
    },
    loading(state) {
      return state.loading;
    },
  },
};
