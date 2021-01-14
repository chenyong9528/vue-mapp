<template>
  <div class="container" v-if="g_rankList().length">
    <dl class="rank-dl">
      <dt>官方榜单</dt>
      <dd>
        <ul class="rank-follow">
          <li v-for="item of g_rankList(1)" :key="item.id">
            <router-link :to="`/top/${item.id}`" class="rank-follow-link" replace>
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
            <router-link :to="`/top/${item.id}`" class="rank-other-link" replace>
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
    ])
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
        height: .88rem;
        line-height: .88 rem;
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
