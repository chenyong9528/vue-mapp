import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import api from '../api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mvRanking: {
      list: [],
      limit: 10,
      offset: 0,
      loadingStatus: 'none'
    }
  },
  mutations: {
    pushMv({ mvRanking }, { data }) {
      mvRanking.list.push(...data)
      mvRanking.offset += mvRanking.limit
    },
    replaceMv({ mvRanking }, { data }) {
      mvRanking.list = [...data]
      mvRanking.offset = mvRanking.limit
    },
    playMv({ mvRanking: { list } }, { data, index }) {
      list[index].src = data.brs[480]
    }
  },
  actions: {
    async loadMv({ commit, state: { mvRanking } }, { area, type = 0 /* 0---首次或加载更多 1---切换tabs*/ }) {
      // 切换tabs时首先初始化
      if (type) {
        mvRanking.list = []
        mvRanking.offset = 0
      }

      mvRanking.loadingStatus = 'loading'
      
      const { limit, offset } = mvRanking
      const { data: { data } } = await axios.get(api.apiMvRanking(limit, offset, area == '全部' ? '' : area))

      for (const item of data) {
        // 对mv数组的每一项添加scr属性用于控制播放
        Object.assign(item, { src: '' })
      }

      mvRanking.loadingStatus = 'none'

      if (!type) commit('pushMv', { data })
      else commit('replaceMv', { data })
    },
    async asyncMvDetail({ commit, state: { mvRanking: { list } } }, { id, index }) {
      list[index].src = 'loading'
      const { data: { data } } = await axios.get(api.apiMvDetail(id))
      commit('playMv', { data, index })
    }
  },
  modules: {}
})
