import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/http/axios'
import api from '@/http/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mvRanking: {
      list: {},
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
    addMv({ mvRanking, mvRanking: { list } }, { index, data }) {
      const _data = list[index]?.data

      // 载入过的tabs，做加载更多操作，否则新增一项
      if (_data) {
        _data.push(...data)
        list[index].offset += 10
      } else {
        mvRanking.list = { ...list, ...{ [index]: { data, offset: 10 } } }
      }
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
    async loadMv({ commit, state: { mvRanking, mvRanking: { list } } }, { index, prevIndex }) {
      const doc = document.documentElement || document.body

      if (prevIndex !== undefined) {
        // 切换tabs时保存滚动条位置
        list[prevIndex].scrollTop = doc.scrollTop
        if (list[index]) {
          // 切换tabs并且已经载入过了
          doc.scrollTop = list[index].scrollTop
          return
        }
      }

      mvRanking.loadingStatus = 'loading'
      
      const offset = list[index]?.offset
      const tabs = {
        0: '内地',
        1: '港台',
        2: '欧美',
        3: '日本',
        4: '韩国',
      }

      try {
        const { data: { data } } = await axios.get(api.apiMvRanking(tabs[index], offset))

        mvRanking.loadingStatus = 'none'

        commit('addMv', { index, data })
      } catch(e) {
        mvRanking.loadingStatus = String(e)
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
          const p1 = axios.get(api.apiAudioUrl(item.id))
          const p2 = axios.get(api.apiLyric(item.id))

          const [
            { data: { data } },
            { data: { lrc: { lyric } } },
          ] = await Promise.all([p1, p2])

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
      let ntime = (new Date()).getTime()

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
          const ctime = (new Date()).getTime()

          if (ctime - ntime < 980) return

          ntime = ctime

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
