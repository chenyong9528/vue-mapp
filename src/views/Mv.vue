<template>
  <div class="container container-mv">
    <Tabs :tabsActive="tabsActive" :tabs="tabs" @tabClick="tabClick" />
    <ul class="mv" v-if="list">
      <li v-for="item of list" :key="item.id">
        <div class="mv-bd">
          <video :poster="item.cover" playsinline autoplay></video>
          <svg class="icon" aria-hidden="true" @click="play(item.id, $event)">
            <use xlink:href="#icon-play-fill"></use>
          </svg>
          <i class="icon-loading mv-loading"></i>
          <div class="mv-playCount">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-play"></use>
            </svg>
            <span>{{ item.playCount }}</span>
          </div>
        </div>
        <div class="mv-ft">
          <h2>{{ item.name }}</h2>
          <p>{{ item.artistName }}</p>
        </div>
      </li>
    </ul>
    <div ref="hasBottom"></div>
    <LoadingLocal :status="mvRanking.loadingStatus" />
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import axios from '@/http/axios'
import api from '@/http/api'
import Tabs from '@/components/Tabs.vue'
import LoadingLocal from '@/components/LoadingLocal.vue'

export default {
  name: 'Mv',
  data() {
    return {
      tabsActive: 0,
      tabs: ['内地', '港台', '欧美', '日本', '韩国'],
      vio: null,
      vs: [],
    }
  },
  components: {
    Tabs,
    LoadingLocal,
  },
  computed: {
    ...mapState([
      'mvRanking',
    ]),
    list() {
      return this.mvRanking.list[this.tabsActive]?.data
    },
  },
  created() {
    this.loadMv({ index: this.tabsActive })
  },
  mounted() {
    const io = new IntersectionObserver((entries) => {
      const item = entries[0]
      if (item.isIntersecting) {

        if (this.mvRanking.loadingStatus == 'loading') return

        this.loadMv({ index: this.tabsActive })
      }
    }, {
      threshold: [1],
      rootMargin: '0px 0px -12% 0px',
    })

    io.observe(this.$refs.hasBottom)

    //初始化vio用于观察video并控制播放状态
    this.vio = this.createVideoIo()
  },
  methods: {
    ...mapActions([
      'loadMv',
    ]),
    ...mapMutations(['setToast']),
    async play(id, e) {
      const target = e.currentTarget
      const video = target.previousElementSibling
      const i = target.nextElementSibling
      const div = i.nextElementSibling

      target.remove()
      div.remove()
      i.style.display = 'block'

      try {
        const { data: { data: { url } } } = await axios.get(api.apiMvUrl(id))
        
        video.src = url
        video.load()
        video.play()
        i.remove()
        video.controls = true
        // 把播放过的视频存起来，切换tabs时把它们从内存中清除
        this.vs.push(video)
      } catch(e) {
        this.setToast(String(e))
      }
    },
    tabClick(index) {
      if (this.vs.length) {
        // 清除播放过的视频
        for (const v of this.vs) {
          v.pause()
          v.removeAttribute('src')
          v.load()
        }
        this.vs = []
      }

      const prevIndex = this.tabsActive
      
      this.tabsActive = index
      this.loadMv({ index, prevIndex })
    },
    createVideoIo() {
      return new IntersectionObserver((entries) => {
        const item = entries[0]
        const video = item.target

        if (item.isIntersecting) {
          if (!isNaN(video.duration)) video.play()
        } else {
          if (!video.paused) video.pause()
        }
      }, {
        threshold: [0.7],
        rootMargin: '0px 0px 0px 0px',
      })
    }
  },
  watch: {
    list(n) {
      if (!n) return
      this.$nextTick(() => {
        const vs = document.querySelectorAll('video')

        this.vio.disconnect()

        for (const v of vs) {
          this.vio.observe(v)
        }
      })
    }
  }
}

</script>
<style lang="scss">
.container-mv {
  background-color: #f7f7f7;
}
.mv {
  min-height: 100vh;
  box-sizing: border-box;
  padding: .88rem 0 .4rem;
  li {
    margin: 0 .58rem;
    border-radius: .8rem;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 1px 1px .6rem #d4d4d4;
    &:not(:last-child) {
      margin-bottom: .88rem;
    }
  }
  &-bd {
    position: relative;
    width: 100%;
    height: 6.31rem;
    overflow: hidden;
    >.icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      width: 1.4rem;
      height: 1.4rem;
      color: var(--T-0);
      -webkit-tap-highlight-color: transparent;
    }
    video {
      width: 100%;
      height: 100%;
      transform: scale(1.01);
    }
  }
  &-loading {
    display: none;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -.6rem;
    margin-left: -.6rem;
    z-index: 1;
    width: 1.2rem;
    height: 1.2rem;
    animation: loading 1s steps(12, end) infinite;
  }
  &-playCount {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
    padding: .04rem .12rem;
    display: flex;
    align-items: center;
    font-size: 10px;
    background-color: rgba(#000, .5);
    color: #fff;
    .icon {
      width: .45rem;
      height: .45rem;
      margin-right: .04rem;
    }
  }
  &-ft {
    padding: .45rem;
    h2 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 22px;
      font-weight: 500;
    }
    p {
      margin-top: .15rem;
      font-size: 16px;
      color: var(--G-2);
    }
  }
}

@keyframes loading {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}

</style>
