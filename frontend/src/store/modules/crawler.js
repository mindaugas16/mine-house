import ApiService from '@/services/api.service';
import {
  ADD_CRAWLER,
  CRAWLERS_LOADING,
  DELETE_CRAWLER,
  PATCH_CRAWLER,
  SET_CRAWLERS,
  SET_SELECTED_CRAWLER,
} from '@/store/mutation-types';

export default {
  state: {
    crawlers: [],
    loading: false,
    selectedCrawler: null,
  },
  actions: {
    async fetchCrawlers({ commit }) {
      commit(CRAWLERS_LOADING, true);
      try {
        const { data } = await ApiService.get(`/crawlers/`);
        commit(SET_CRAWLERS, data);
      } catch (err) {
        console.error(err);
      }
      commit(CRAWLERS_LOADING, false);
    },
    async deleteCrawler({ commit }, id) {
      try {
        await ApiService.delete(`/crawlers/${id}`);
        commit(DELETE_CRAWLER, id);
      } catch (err) {
        console.error(err);
      }
    },
    async createCrawler({ commit }, body) {
      try {
        const { data } = await ApiService.put(`/crawlers/`, body);

        commit(ADD_CRAWLER, { ...data, realEstatesCount: 0 });
      } catch (err) {
        console.error(err);
      }
    },
    async runCrawler({ commit }, id) {
      try {
        const { data } = await ApiService.post(`/crawlers/${id}/run`, {});

        commit(PATCH_CRAWLER, { id, newItems: data.newItems, crawledAt: Date.now() });
      } catch (err) {
        console.error(err);
      }
    },
    selectCrawler({ commit }, crawler) {
      commit(SET_SELECTED_CRAWLER, crawler);
    },
  },
  mutations: {
    [CRAWLERS_LOADING](state, payload) {
      state.loading = payload;
    },
    [SET_CRAWLERS](state, payload) {
      state.crawlers = payload;
    },
    [DELETE_CRAWLER](state, payload) {
      state.crawlers = [...state.crawlers].filter(crawler => crawler.id !== payload);
    },
    [ADD_CRAWLER](state, payload) {
      state.crawlers = [payload, ...state.crawlers];
    },
    [SET_SELECTED_CRAWLER](state, payload) {
      state.selectedCrawler = payload;
    },
    [PATCH_CRAWLER](state, { id, newItems }) {
      state.crawlers = [...state.crawlers].map(item => {
        if (item.id === id) {
          return { ...item, realEstatesCount: +item.realEstatesCount + +newItems };
        }
        return item;
      });
    },
  },
  getters: {
    crawlers(state) {
      return state.crawlers;
    },
    crawlersLoading(state) {
      return state.loading;
    },
    selectedCrawler(state) {
      return state.selectedCrawler;
    },
  },
};
