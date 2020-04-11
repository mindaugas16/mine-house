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
      const { data } = await axios.get('http://localhost:3000/api/real-estates', { params });
      const { data: realEstates, meta: realEstatesMeta } = data;
      commit(UPDATE_REAL_ESTATES, realEstates);
      commit(UPDATE_REAL_ESTATES_META, realEstatesMeta);
      commit(LOADING, false);
    },
    async markAsSeen({ commit }, id) {
      const { data: values } = await axios.patch(`http://localhost:3000/api/real-estates/${id}/mark-as-seen`, {});
      commit(UPDATE_REAL_ESTATE, { id, values });
    },
    async markAsStarred({ commit }, { id, starred }) {
      await axios.patch(`http://localhost:3000/api/real-estates/${id}/mark-as-starred`, { starred });
      commit(UPDATE_REAL_ESTATE, { id, values: { starred } });
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
        if (item._id !== id) {
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
