import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/http/axios'
import api from '@/http/api'

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
    footerOffset: 0, // 0 1 2 footer的三种显示状态
    beforeFooterState: 0,
    globalLoading: false,
    toastText: '',
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
    setFooter(state, tag) {
      state.footerOffset = tag
    },
    setGLoading(state, isShow) {
      state.globalLoading = isShow
    },
    setToast(state, str) {
      state.toastText = str
    },
    M_player(state, { tag, playload }) {
      const { player } = state

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
        pushQueue({ id, name, ar, al, songs, lyric }) {
          player.queue.push({ id, name, ar, al, songs, lyric })
        },
        switchAudio(current) {
          player.queueActive = current

          // 切歌后首先初始化当前和总播放时间
          player.currentTime = 0
          player.endTime = 1
        },
        playModel() {
          // 打开播放器时，处理footer动画
          if (!player.isFull) {
            state.beforeFooterState = state.footerOffset
            state.footerOffset = 2
          } else {
            setTimeout(() => {
              state.footerOffset = state.beforeFooterState
            }, 400)
          }
          player.isFull = !player.isFull
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

      try {
        const { data: { data } } = await axios.get(api.apiMvRanking(limit, offset, area == '全部' ? '' : area))

        for (const item of data) {
          // 对mv数组的每一项添加src属性用于控制播放
          Object.assign(item, { src: '' })
        }

        mvRanking.loadingStatus = 'none'

        if (!type) commit('pushMv', { data })
        else commit('replaceMv', { data })
      } catch(e) {
        mvRanking.loadingStatus = String(e)
      }
    },
    async asyncMvDetail({ commit, state: { mvRanking: { list } } }, { id, index, el }) {
      list[index].src = 'loading'

      try {
        const { data: { data } } = await axios.get(api.apiMvUrl(id))
        commit('playMv', { data, index, el })

        setTimeout(() => {
          el.load()
          el.play()
        }, 0)
      } catch(e) {
        commit('setToast', String(e))
        list[index].src = ''
      }
    },
    async loadRankList({ commit, state }) {
      try {
        const { data: { list } } = await axios.get(api.apiRankList())
        state.rankList = list
      } catch(e) {
        commit('setToast', String(e))
      }
    },
    async readyPlay({ dispatch, commit, state: { player: { queue } } }, item) {
      let index = queue.findIndex(curr => curr.id === item.id)

      commit({
        type: 'M_player',
        tag: 'playModel'
      })

      commit('setGLoading', true)
      
      if (index === -1) {
        try {
          const { data: { data } } = await axios.get(api.apiAudioUrl(item.id))
          const { data: { lrc: { lyric } } } = await axios.get(api.apiLyric(item.id))

          if (data[0].url == null) {
            commit('setGLoading', false)
            commit('setToast', '没有找到音乐')
            return
          }

          commit({
            type: 'M_player',
            tag: 'pushQueue',
            playload: Object.assign(item, { songs: data, lyric })
          })

          index = queue.length - 1
        } catch(e) {
          commit('setGLoading', false)
          commit('setToast', String(e))
          return
        }
      }
      
      commit({
        type: 'M_player',
        tag: 'switchAudio',
        playload: index
      })

      dispatch('switchAudio')
    },
    switchAudio({ dispatch, commit, state: { player, player: { queue, queueActive, instance } } }) {
      const { songs } = queue[queueActive]
      const url = songs[0].url

      if (instance) {
        instance.src = url
        instance.load()
      } else {
        const ad = new Audio(url)

        ad.load()
        
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
          commit('setGLoading', false)
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
        ad.addEventListener('ended', function() {
          const { queue, queueActive } = player

          commit({
            type: 'M_player',
            tag: 'switchAudio',
            playload: queueActive === queue.length - 1 ? 0 : queueActive + 1
          })

          dispatch('switchAudio')
        })
      }
    }
  },
  modules: {}
})
