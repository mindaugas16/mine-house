import axios from 'axios';
import { LOADING, UPDATE_REAL_ESTATE, UPDATE_REAL_ESTATES, UPDATE_REAL_ESTATES_META } from '../mutation-types';

export default {
  state: {
    realEstates: [],
    realEstatesMeta: null,
    loading: false,
  },
  actions: {
    async fetchRealEstates({ commit }, params) {
      commit(LOADING, true);
      try {
        const { data } = await axios.get('http://localhost:3000/api/real-estates', { params });
        let { data: realEstates, meta: realEstatesMeta } = data;
        // @TODO: return from BE json instead of json as text
        realEstates = realEstates.map(realEstate => {
          return {
            ...realEstate,
            lastPriceChanges: realEstate.lastPriceChanges
              .map(row => JSON.parse(row))
              .sort((a, b) => {
                return b.changedAt - a.changedAt;
              }),
          };
        });
        commit(UPDATE_REAL_ESTATES, realEstates);
        commit(UPDATE_REAL_ESTATES_META, realEstatesMeta);
      } catch (err) {
        console.error(err);
      }
      commit(LOADING, false);
    },
    async markAsSeen({ commit }, id) {
      try {
        const { data: values } = await axios.patch(`http://localhost:3000/api/real-estates/${id}/mark-as-seen`, {});
        commit(UPDATE_REAL_ESTATE, { id, values });
      } catch (err) {
        console.error(err);
      }
    },
    async markAsStarred({ commit }, { id, starred }) {
      try {
        await axios.patch(`http://localhost:3000/api/real-estates/${id}/mark-as-starred`, { starred });
        commit(UPDATE_REAL_ESTATE, { id, values: { starred } });
      } catch (err) {
        console.error(err);
      }
    },
  },
  mutations: {
    [LOADING](state, loading) {
      state.loading = loading;
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
    realEstatesMeta(state) {
      return state.realEstatesMeta;
    },
    loading(state) {
      return state.loading;
    },
  },
};
