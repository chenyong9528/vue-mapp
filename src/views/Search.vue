<template>
  <div class="container">
    <form class="form" action @submit="handleSubmit">
      <div class="form-bar">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-search"></use>
        </svg>
        <input type="search" :placeholder="defaultSearch.length ? defaultSearch[0] : ''" v-model="searchText" @focus="showCancel = true" ref="sText">
      </div>
      <span class="form-cancel" v-show="showCancel" @click="handleCancel">取消</span>
    </form>
    <div class="search-suggest" v-if="searchSuggest === null || searchSuggest.length">
      <div v-if="searchSuggest === null" class="none">无结果</div>
      <ul v-else class="search-suggest-list">
        <li v-for="({ keyword }, index) of searchSuggest" :key="index" @click="assignSearch(keyword)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-search"></use>
          </svg>
          <span>{{ keyword }}</span>
        </li>
      </ul>
    </div>
    <div class="search-result" v-else-if="searchResult.length">
      <Tabs :tabs="tabs" :top="top" @tabClick="tabClick" />
      <div class="search-result-content">
        <ul class="search-result-single" v-show="tabsActive === 0">
          <li v-for="({ id, name, artists, album }, index) of searchResult" :key="index" @click="play(id)">
            <h5>{{ name }}</h5>
            <p>{{ `${ artists.map(curr => curr.name).join('/') }-${ album.name }` }}</p>
          </li>
        </ul>
        <div ref="hasBottom"></div>
        <LoadingLocal :status="loadingResult" />
      </div>
    </div>
    <div class="hot-search" v-else-if="searchText.trim().length === 0">
      <h5>热搜榜</h5>
      <ul class="hot-search-list" v-if="hotSearch.length">
        <li class="hot-search-item" v-for="({ content, searchWord, iconUrl }, index) of hotSearch" :key="index" @click="assignSearch(searchWord)">
          <span :style="{ color: index < 4 ? '#e84c45' : false }">{{ index + 1 }}</span>
          <div>
            <h6><span>{{ searchWord }}</span><img v-if="iconUrl" :src="iconUrl"></h6>
            <p>{{ content }}</p>
          </div>
        </li>
      </ul>
      <LoadingLocal :status="loadingHot" v-else />
    </div>
    <LoadingLocal status="loading" v-else />
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import axios from '@/http/axios'
import api from '@/http/api'
import Tabs from '@/components/Tabs.vue'
import LoadingLocal from '@/components/LoadingLocal.vue'

export default {
  name: 'Search',
  data() {
    return {
      tabs: ['单曲', '专辑', '歌手', '歌单', '用户', 'MV', '歌词', '电台', '视频', '综合'],
      top: '2.4rem',
      tabsActive: 0,
      showCancel: false,
      searchText: '',
      defaultSearch: [],
      hotSearch: [],
      searchSuggest: [],
      searchResult: [],
      loadingResult: 'none',
      loadingHot: 'loading',
      mark: false,
      io: null,
      offset: 20
    }
  },
  components: {
    Tabs,
    LoadingLocal
  },
  created() {
    axios.get(api.apiDefaultSearch())
    .then(({ data: { data: { showKeyword, realkeyword } } }) => {
      this.defaultSearch.push(showKeyword)
      this.defaultSearch.push(realkeyword)
    })
    .catch((e) => {
      console.log(String(e))
    })
    axios.get(api.apiHotSearch())
    .then(({ data: { data } }) => {
      this.hotSearch =  Object.freeze(data)
    })
    .catch((e) => {
      this.loadingHot = String(e)
    })

    this.io = new IntersectionObserver(async (entries) => {
      const item = entries[0]
      if (item.isIntersecting) {
        if (this.loadingResult == 'loading' || this.tabsActive !== 0) return

        this.loadingResult = 'loading'

        try {
          const { data: { result: { songCount, songs } } } = await axios.get(api.apiSearch(this.searchText, 10, this.offset))

          if (this.offset >= songCount) {
            this.loadingResult = 'no'
            return
          }

          this.offset += 10
          this.searchResult.push(...songs)
          this.loadingResult = 'none'
        } catch(e) {
          this.loadingResult = String(e)
        }
      }
    }, {
      threshold: [1],
      rootMargin: '0px 0px -12% 0px',
    })
  },
  methods: {
    ...mapActions(['readyPlay']),
    ...mapMutations(['setToast']),
    handleCancel() {
      this.showCancel = false
      this.searchText = ''
      this.searchSuggest = []
      this.searchResult = []
    },
    handleSubmit(e) {
      e.preventDefault()

      this.$refs.sText.blur()
      this.assignSearch(this.searchText || this.defaultSearch[1])

      if (this.searchText) this.searchSuggest = []
    },
    tabClick(index) {
      this.tabsActive = index
      if (index > 0) this.loadingResult = 'no'
      else this.loadingResult = 'none'
    },
    async play(id) {
      this.$loading.show()

      try {
        const { data: { songs } } = await axios.get(api.apiSongDetail(id))

        this.readyPlay(songs[0])
      } catch(e) {
        this.setToast(String(e))
      }

      this.$loading.hide()
      
    },
    async assignSearch(key) {
      this.mark = true

      // 清除tabs之前保留的状态
      this.tabsActive = 0
      this.loadingResult = 'none'

      if (this.searchText == key) {
        this.searchSuggest = []
      } else {
        this.searchText = key
      }

      if (!this.showCancel) this.showCancel = true

      try {
        const { data: { result: { songs } } } = await axios.get(api.apiSearch(key))

        this.mark = false
        this.searchResult = songs

        this.offset = 20
        this.io.disconnect()
        this.$nextTick(() => this.io.observe(this.$refs.hasBottom))
      } catch(e) {
        this.setToast(String(e))
      }
    }
  },
  watch: {
    async searchText(n) {
      this.searchSuggest = []

      if (n.trim().length === 0 || this.mark) return

      this.searchResult = []

      try {
        const { data: { result: { allMatch = null } } } = await axios.get(api.apiSearchSuggest(n.trim()))
        if (this.searchText) this.searchSuggest = allMatch
      } catch(e) {
        this.setToast(String(e))
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/style/_mixin.scss';

.form {
  display: flex;
  align-items: flex-start;
  height: 2.4rem;
  padding: .9rem 20px 0;
  background-color: #fff;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 500;
  &-bar {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 6px;
    border-radius: .1rem;
    overflow: hidden;
    background-color: #eeeeef;
    .icon {
      width: 27px;
      height: 27px;
      color: #8e8e92;
    }
    input {
      flex: 1;
      padding: .26rem 4px;
      font-size: 16px;
      border: none;
      outline: none;
      background-color: transparent;
      caret-color: var(--T-0);
    }
  }
  &-cancel {
    width: 1.38rem;
    padding: .15rem 0;
    font-size: 16px;
    color: var(--T-0);
    white-space: nowrap;
    text-align: right;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
}
.hot-search {
  padding: .3rem .5rem;
  background-color: #fff;
  > h5 {
    font-size: 15px;
    height: .98rem;
    line-height: .98rem;
    font-weight: 600;
  }
  &-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0 .36rem;
  }
  &-item {
    display: flex;
    align-items: center;
    height: 1.78rem;
    -webkit-tap-highlight-color: transparent;
    >span {
      display: inline-block;
      width: 20px;
      margin-right: .24rem;
      font-size: 17px;
    }
    div {
      width: 0;
      flex: 1;
      h6 {
        display: flex;
        align-items: center;
        span {
          font-size: 15px;
          font-weight: 500;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        img {
          height: .42rem;
          margin-left: .2rem;
        }
      }
      p {
        margin-top: .1rem;
        font-size: 11px;
        color: var(--G-2);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
.search-suggest {
  .none {
    padding: .6rem;
    text-align: center;
  }
  &-list {
    li {
      display: flex;
      align-items: center;
      padding-left: .6rem;
      -webkit-tap-highlight-color: transparent;
      &:active {
        background-color: #f0f0f0;
      }
      .icon {
        width: .66rem;
        height: .66rem;
        margin-right: .2rem;
        color: var(--G-2);
      }
      span {
        position: relative;
        display: block;
        flex: 1;
        width: 0;
        height: 1.35rem;
        line-height: 1.35rem;
        padding-right: .6rem;
        font-size: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:after {
          @include b-bd(#e7e7e7);
          @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
            transform: scaleY(0.3333333);
          }
        }
      }
    }
  }
}
.search-result {
  &-content {
    padding: .36rem .6rem 0;
  }
  &-single {
    li {
      position: relative;
      padding: .3rem 0;
      -webkit-tap-highlight-color: transparent;
      &:after {
        @include b-bd(#e7e7e7);
        @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
          transform: scaleY(0.3333333);
        }
      }
      h5 {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
      p {
        font-size: 12px;
        color: var(--G-2);
      }
    }
  }
}
</style>
