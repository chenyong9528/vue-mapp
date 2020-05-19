<template>
  <div class="container" style="background-color: #f7f7f7;">
    <Tabs :tabsActive="tabsActive" :tabs="tabs" @tabClick="tabClick" />
    <ul class="mv" v-if="mvRanking.list.length">
      <li v-for="(item, index) of mvRanking.list" :key="item.id">
        <div class="mv-bd">
          <video :src="isComplete(item.src) ? item.src : ''" :controls="isComplete(item.src)" :poster="item.cover" autoplay>
            <p>Sorry, your browser doesn't support embedded videos.</p>
          </video>
          <template v-if="!item.src">
            <svg class="icon" aria-hidden="true" @click="play(item.id, index)">
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
      tabs: ['全部', '内地', '港台', '欧美', '日本', '韩国']
    }
  },
  components: {
    Tabs,
    LoadingLocal
  },
  computed: {
    ...mapState([
      'mvRanking'
    ])
  },
  created() {
    this.loadMv({ area: this.tabs[this.tabsActive], type: 0 })
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
  },
  methods: {
    ...mapActions([
      'loadMv',
      'asyncMvDetail'
    ]),
    play(id, index) {
      this.asyncMvDetail({ id, index })
    },
    isComplete(src) {
      return Boolean(src && src != 'loading')
    },
    tabClick(index) {
      this.tabsActive = index
      this.loadMv({ area: this.tabs[index], type: 1 })
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
    >.icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      width: 1.4rem;
      height: 1.4rem;
      color: var(--T-0);
    }
    video {
      width: 100%;
      height: 100%;
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
    padding: .04rem .2rem;
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
      font-size: 24px;
      font-weight: 500;
    }
    p {
      margin-top: .3rem;
      font-size: 18px;
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
