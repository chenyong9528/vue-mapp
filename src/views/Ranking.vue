<template>
  <div class="container" v-if="g_rankList().length">
    <dl class="rank-dl">
      <dt>官方榜单</dt>
      <dd>
        <ul class="rank-follow">
          <li v-for="item of g_rankList(1)" :key="item.id">
            <router-link :to="getUrl(item.name)" class="rank-follow-link" replace>
              <div class="rank-header">
                <img :src="item.coverImgUrl">
                <span>{{ item.updateFrequency }}</span>
              </div>
              <ol>
                <li v-for="({ first, second }, idx) of item.tracks" :key="idx">{{ idx + 1 }}.{{ first }} - {{ second }}</li>
              </ol>
            </router-link>
          </li>
        </ul>
      </dd>
    </dl>
    <dl class="rank-dl">
      <dt>其他榜单</dt>
      <dd>
        <ul class="rank-other">
          <li v-for="item of g_rankList(0)" :key="item.id">
            <router-link :to="getUrl(item.name)" class="rank-other-link" replace>
              <div class="rank-header">
                <img :src="item.coverImgUrl">
                <span>{{ item.updateFrequency }}</span>
              </div>
              <h5>{{ item.name }}</h5>
            </router-link>
          </li>
        </ul>
      </dd>
    </dl>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

const arr = [
  '云音乐新歌榜',
  '云音乐热歌榜',
  '网易原创歌曲榜',
  '云音乐飙升榜',
  '4',
  'UK排行榜周榜',
  '美国Billboard周榜',
  'KTV唛榜',
  'iTunes榜',
  'Hit FM Top榜',
  '日本Oricon周榜',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '法国 NRJ Vos Hits 周榜',
  '台湾Hito排行榜',
  'Beatport全球电子舞曲榜',
  '云音乐ACG音乐榜',
  '云音乐说唱榜',
  '云音乐古典音乐榜',
  '云音乐电音榜',
  '抖音排行榜',
  '新声榜',
  '云音乐韩语榜'
]

export default {
  name: 'Ranking',
  async created() {
    if (this.g_rankList().length) return
    this.$loading.show()
    await this.loadRankList()
    this.$loading.hide()
  },
  computed: {
    ...mapGetters([
      'g_rankList'
    ])
  },
  methods: {
    ...mapActions([
      'loadRankList'
    ]),
    getUrl(name) {
      const idx = arr.findIndex(curr => curr == name)

      if (idx !== -1) return `/top/${idx}`
      return `#`
    }
  }
}

</script>
<style lang="scss">
.rank-dl {
  padding: .57rem .47rem 0;
  background-color: #fff;
  dt {
    height: 1.34rem;
    line-height: 1.34rem;
    font-size: 18px;
    font-weight: 600;
  }
}
.rank-follow {
  >li:not(:last-child) {
    margin-bottom: .3rem;
  }
  &-link {
    display: flex;
    align-items: center;
    div {
      margin-right: .46rem;
    }
    @at-root .rank-header {
      position: relative;
      width: 3.6rem;
      height: 3.6rem;
      border-radius: .18rem;
      overflow: hidden;
      font-size: 0;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      span {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        height: .84rem;
        line-height: .84rem;
        padding: .24rem .18rem 0;
        font-size: 12px;
        color: #fff;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .18));
      }
    }
    ol {
      flex: 1;
      overflow: hidden;
      li {
        height: .84rem;
        line-height: .84rem;
        font-size: 14px;
        color: #676767;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
.rank-other {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .4rem .3rem;
  li {
    overflow: hidden;
  }
  &-link h5 {
    font-size: 14px;
    font-weight: 500;
    height: .86rem;
    line-height: .86rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

</style>
