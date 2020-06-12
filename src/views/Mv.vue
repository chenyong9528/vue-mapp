<template>
  <div class="container" style="background-color: #f7f7f7;">
    <Tabs :tabsActive="tabsActive" :tabs="tabs" @tabClick="tabClick" />
    <ul class="mv" v-if="list">
      <li v-for="(item, index) of list.data" :key="item.id">
        <div class="mv-bd">
          <video :src="isComplete(item.src) ? item.src : false" :controls="isComplete(item.src)" :poster="item.cover" playsinline autoplay>
            <p>Sorry, your browser doesn't support embedded videos.</p>
          </video>
          <template v-if="!item.src">
            <svg class="icon" aria-hidden="true" @click="play(item.id, index, $event)">
              <use xlink:href="#icon-play-fill"></use>
            </svg>
            <div class="mv-playCount">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-play"></use>
              </svg>
              <span>{{ item.playCount }}</span>
            </div>
          </template>
          <i v-else-if="item.src == 'loading'" class="icon-loading mv-loading"></i>
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
import { mapState, mapActions } from 'vuex'
import Tabs from '@/components/Tabs.vue'
import LoadingLocal from '@/components/LoadingLocal.vue'

export default {
  name: 'Mv',
  data() {
    return {
      tabsActive: 0,
      tabs: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      vio: null
    }
  },
  components: {
    Tabs,
    LoadingLocal
  },
  computed: {
    ...mapState([
      'mvRanking'
    ]),
    list() {
      return this.mvRanking.list[this.tabs[this.tabsActive]]
    }
  },
  created() {
    this.loadMv({ area: this.tabs[this.tabsActive] })
  },
  mounted() {
    const io = new IntersectionObserver((entries) => {
      const item = entries[0]
      if (item.isIntersecting) {

        if (this.mvRanking.loadingStatus == 'loading') return

        this.loadMv({ area: this.tabs[this.tabsActive], type: 0 })
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
      'asyncMvDetail'
    ]),
    play(id, index, e) {
      this.asyncMvDetail({ id, index, el: e.currentTarget.previousElementSibling })
    },
    isComplete(src) {
      return Boolean(src && src != 'loading')
    },
    tabClick(index) {
      this.tabsActive = index
      this.loadMv({ area: this.tabs[index] })
    },
    createVideoIo() {
      return new IntersectionObserver((entries) => {
        const item = entries[0]
        const video = item.target.firstElementChild.firstElementChild

        if (item.isIntersecting) {
          if (!isNaN(video.duration)) video.play()
        } else {
          if (!video.paused) video.pause()
        }
      }, {
        threshold: [0.5],
        rootMargin: '0px 0px 0px 0px',
      })
    }
  },
  watch: {
    list() {
      // if (n.length) {
      //   this.$nextTick(() => {
      //     let i = this.mvRanking.offset - 10
      //     const lis = document.querySelectorAll('.mv li')

      //     this.vio.disconnect()

      //     for (i; i < lis.length; i++) {
      //       this.vio.observe(lis[i])
      //     }
      //   })
      // }
    }
  }
}

</script>
<style lang="scss">
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
