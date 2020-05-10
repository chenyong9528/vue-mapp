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
    },
    rankList: [],
    showFooter: true,
    player: {
      queue: [],
      queueActive: -1,
      instance: null,
      isFull: false,
      isPlay: false,
      currentTime: 0,
      endTime: 1
    }
  },
  getters: {
    g_rankList: ({ rankList }) => (tag) => {
      if (tag === 1) return rankList.filter(curr => curr.tracks.length > 0)
      if (tag === 0) return rankList.filter(curr => curr.tracks.length === 0)
      return rankList
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
      list[index].src = data.url
    },
    setFooter(state, isShow) {
      state.showFooter = isShow
    },
    M_player({ player }, { tag, playload }) {
      const o = {
        playAudio() {
          player.isPlay = true
        },
        pauseAudio() {
          player.isPlay = false
        },
        updateCurrentTime(currentTime) {
          player.currentTime = currentTime
        },
        initEndTime(endTime) {
          player.endTime = endTime
        },
        pushQueue({ id, name, ar, al, songs }) {
          player.queue.push({ id, name, ar, al, songs })
        },
        switchAudio(current) {
          player.queueActive = current
        },
        playModel(b) {
          player.isFull = b
        },
        initAudioInstance(instance) {
          player.instance = instance
        }
      }

      o[tag](playload)
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
      const { data: { data } } = await axios.get(api.apiMvUrl(id))
      commit('playMv', { data, index })
    },
    async loadRankList({ state }) {
      const { data: { list } } = await axios.get(api.apiRankList())
      state.rankList = list
    },
    async readyPlay({ dispatch, commit, state: { player: { queue } } }, item) {
      let index = queue.findIndex(curr => curr.id === item.id)

      commit({
        type: 'M_player',
        tag: 'playModel',
        playload: true
      })
        
      if (index === -1) {
        const { data: { data } } = await axios.get(api.apiAudioUrl(item.id))

        commit({
          type: 'M_player',
          tag: 'pushQueue',
          playload: Object.assign(item, { songs: data })
        })

        index = queue.length - 1
      }

      commit({
        type: 'M_player',
        tag: 'switchAudio',
        playload: index
      })

      dispatch('switchAudio')
    },
    switchAudio({ commit, state: { player: { queue, queueActive, instance } } }) {
      const { songs } = queue[queueActive]
      const url = songs[0].url

      if (instance) {
        instance.src = url
        instance.load()
      } else {
        const ad = new Audio(url)

        commit({
          type: 'M_player',
          tag: 'initAudioInstance',
          playload: ad
        })

        ad.addEventListener('canplay', function() {
          this.play()
          commit({
            type: 'M_player',
            tag: 'playAudio'
          })
        })
        ad.addEventListener('durationchange', function() {
          commit({
            type: 'M_player',
            tag: 'initEndTime',
            playload: this.duration
          })
        })
        ad.addEventListener('timeupdate', function() {
          commit({
            type: 'M_player',
            tag: 'updateCurrentTime',
            playload: this.currentTime
          })
        })
        ad.addEventListener('play', function() {
          commit({
            type: 'M_player',
            tag: 'playAudio'
          })
        })
        ad.addEventListener('pause', function() {
          commit({
            type: 'M_player',
            tag: 'pauseAudio'
          })
        })
      }
    }
  },
  modules: {}
})
