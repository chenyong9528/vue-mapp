<template>
  <div v-if="playlist">
    <div class="top-banner">
      <img :src="playlist.coverImgUrl">
      <svg class="icon" aria-hidden="true" @click="replaceJump">
        <use xlink:href="#icon-arrow-lift"></use>
      </svg>
      <ul class="top-banner-ul">
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-comments"></use>
          </svg>
          <p>{{ toUnitW(playlist.commentCount) }}</p>
        </li>
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-share"></use>
          </svg>
          <p>{{ toUnitW(playlist.shareCount) }}</p>
        </li>
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-exchangerate"></use>
          </svg>
          <p>{{ toReduceDate(playlist.updateTime) }}</p>
        </li>
      </ul>
    </div>
    <section class="top-list-section">
      <header class="top-list-header">
        <div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-play"></use>
          </svg>
          <em>播放全部</em>
          <span>(共{{ playlist.tracks.length }}首)</span>
        </div>
        <span>收藏({{ toUnitW(playlist.subscribedCount) }})</span>
      </header>
      <ul class="top-list">
        <li v-for="(item, index) of playlist.tracks" :key="item.id" @click="readyPlay(item)">
          <div class="top-list-rank">
            <h5 :style="{ color: `${ index < 3 ? '#de3537' : 'var(--G-2)' }` }">{{ index + 1 }}</h5>
            <p><strong>↑</strong>{{ playlist.trackIds[index].ratio ? playlist.trackIds[index].ratio : 1 }}%</p>
          </div>
          <div class="top-list-name">
            <h4>{{ item.name }}<span v-if="item.alia.length">({{ item.alia.join('/') }})</span></h4>
            <p>{{ `${ item.ar.map(curr => curr.name).join('/') }-${ item.al.name }` }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import axios from '@/http/axios'
import api from '@/http/api'

export default {
  name: 'Top',
  props: ['idx'],
  data() {
    return {
      playlist: null
    }
  },
  async created() {
    this.$loading.show()
    try {
      const { data: { playlist } } = await axios.get(api.apiTopList(this.idx))
      this.playlist = Object.freeze(playlist)
    } catch(e) {
      this.setToast(String(e))
    }
    this.$loading.hide()
  },
  methods: {
    ...mapActions(['readyPlay']),
    ...mapMutations(['setToast']),
    toUnitW(val) {
      if (val > 10000) return `${ Math.floor(val / 10000) }.${ Math.floor((val % 10000) / 1000) }w`
      return val
    },
    toReduceDate(time) {
      const date = new Date(time)
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const d = date.getDate()
      const ny = (new Date()).getFullYear()

      if (ny === y) return `${ m }月${ d }日`
      return `${ y }年${ m }月${ d }日`
    },
    replaceJump() {
      this.$router.replace('/ranking')
    },
  }
}

</script>
<style lang="scss">
.top-banner {
  position: relative;
  font-size: 0;
  >img {
    width: 100%;
  }
  >.icon {
    position: absolute;
    left: .36rem;
    top: .45rem;
    z-index: 2;
    width: .9rem;
    height: .9rem;
    color: #fff;
    -webkit-tap-highlight-color: transparent;
  }
  &-ul {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1.1rem;
    z-index: 2;
    display: flex;
    justify-content: space-around;
    li {
      font-size: 14px;
      text-align: center;
      color: #fff;
      .icon {
        width: 1.04rem;
        height: 1.04rem;
      }
    }
  }
}
.top-list-section {
  margin-top: -.6rem;
  padding-bottom: 1.8rem;
  border-top-left-radius: .6rem;
  border-top-right-radius: .6rem;
  background-color: #f0f0f1;
}
.top-list-header {
  position: sticky;
  top: 0;
  border-top-left-radius: .6rem;
  border-top-right-radius: .6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .18rem .2rem;
  background-color: #f0f0f1;
  div {
    display: flex;
    align-items: center;
    .icon {
      width: .86rem;
      height: .86rem;
      margin-right: .1rem;
    }
    em {
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
    }
    span {
      color: var(--G-2);
    }
  }
  >span {
    display: inline-block;
    height: 1.1rem;
    line-height: 1.1rem;
    padding: 0 .4rem;
    border-radius: .7rem;
    font-size: 14px;
    color: #fff;
    background: linear-gradient(to right, #4baae6, var(--T-0));
  }
}
.top-list {
  li {
    display: flex;
    align-items: center;
    height: 1.84rem;
  }
  &-rank {
    padding: 0 .21rem;
    text-align: center;
    h5 {
      font-size: 19px;
      font-weight: 500;
    }
    p {
      min-width: 39px;
      overflow: hidden;
      font-size: 9px;
      color: var(--G-1);
    }
  }
  &-name {
    flex: 1;
    width: 0;
    padding-right: .3rem;
    h4 {
      font-size: 17px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      span {
        color: var(--G-2);
      }
    }
    p {
      font-size: 13px;
      color: var(--G-2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

</style>
