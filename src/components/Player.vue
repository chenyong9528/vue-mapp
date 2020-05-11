<template>
  <div>
    <transition name="slide">
      <div class="player" v-show="player.isFull">
        <header class="player-header">
          <span @click="M_player({ tag: 'playModel', playload: false })">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-arrow-down"></use>
            </svg>
          </span>
          <div>
            <h5>{{ getName }}</h5>
            <p>{{ getAr }}</p>
          </div>
          <span></span>
        </header>
        <div class="player-record">
          <img src="../assets/images/player_handle.png">
          <div>
            <img :src="getSrc">
          </div>
        </div>
        <section class="player-control">
          <div class="player-control-prog">
            <span>{{ diyTime(player.currentTime) }}</span>
            <div class="player-control-bar">
              <div :style="{ width: `${ player.currentTime/player.endTime*100 }%` }"><span></span></div>
            </div>
            <span>{{ diyTime(player.endTime) }}</span>
          </div>
          <div class="player-control-btngroup">
            <div>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-backwardfill"></use>
              </svg>
            </div>
            <div>
              <svg class="icon" aria-hidden="true" v-if="!player.isPlay" @click="player.instance.play()">
                <use xlink:href="#icon-play-fill"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else @click="player.instance.pause()">
                <use xlink:href="#icon-suspended-fill"></use>
              </svg>
            </div>
            <div name="name">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-play_forward_fill"></use>
              </svg>
            </div>
          </div>
        </section>
      </div>
    </transition>
    <section class="player-btmbar" v-show="!player.isFull" :style="{ bottom: showFooter ? '1.5rem' : '0', 'pointer-events': player.queue.length ? false : 'none' }">
      <img :src="getSrc">
      <p>{{ getName }}</p>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#3478F6" stroke-width="12" />
        <circle cx="60" cy="60" r="49" fill="none" stroke="#3478F6" stroke-width="12" stroke-dasharray="307.87" :stroke-dashoffset="getOffset" transform="rotate(-90, 60, 60)" />
        <template v-if="!player.isPlay">
          <polyline points="49 41 49 79 81.9 60 49 41" stroke="#3478F6" stroke-width="12" stroke-linecap="round" fill="#3478F6" stroke-linejoin="round" />
        </template>
        <template v-else>
          <polyline points="48 38 48 82" stroke="#3478F6" stroke-width="12" stroke-linecap="butt" stroke-linejoin="miter"/>
          <polyline points="72 38 72 82" stroke="#3478F6" stroke-width="12" stroke-linecap="butt" stroke-linejoin="miter"/>
        </template>
      </svg>
    </section>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import img from '../assets/images/player_placeholder.png'

export default {
  name: 'Player',
  computed: {
    ...mapState(['showFooter', 'player']),
    getSrc() {
      const { queue, queueActive } = this.player

      return queue.length ? queue[queueActive].al.picUrl : img
    },
    getName() {
      const { queue, queueActive } = this.player

      return queue.length ? queue[queueActive].name : '球球音乐，让生活充满音乐'
    },
    getAr() {
      const { queue, queueActive } = this.player
      
      return queue.length ? queue[queueActive].ar.map(curr => curr.name).join(',') : ''
    },
    getOffset() {
      const { currentTime, endTime } = this.player

      return (307.87 - currentTime / endTime * 307.87).toFixed(2)
    },
    diyTime: () => (time) => {
      time = parseInt(time)

      return `0${Math.floor(time/60)}:${(time%60)>10?(time%60):`0${time%60}`}`
    }
  },
  methods: {
    ...mapMutations(['M_player']),
  }
}

</script>
<style lang="scss">
.chart {
  position: relative;
  margin: 80px;
  width: 220px;
  height: 220px;
}
canvas {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}
.chart span {
  color: #555;
  display: block;
  line-height: 220px;
  text-align: center;
  width: 220px;
  font-family: sans-serif;
  font-size: 40px;
  font-weight: 100;
  margin-left: 5px;
}
.player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 600;
  overflow: hidden;
  background-image: url(http://p1.music.126.net/lsUCCufnX99LzJXCABqS5g==/109951164957880586.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  &:after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    margin: -1.4rem;
    filter: blur(.9rem);
    background-image: url(http://p1.music.126.net/lsUCCufnX99LzJXCABqS5g==/109951164957880586.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1.44rem;
    padding: 0 .4rem;
    color: #eaeaea;
    span {
      display: inline-block;
      width: .99rem;
      height: .99rem;
      font-size: 0;
      .icon {
        width: 100%;
        height: 100%;
      }
    }
    div {
      flex: 1;
      width: 0;
      padding: 0 .45rem;
      text-align: center;
      line-height: 1.2;
      h5 {
        font-size: 16px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
  &-record {
    position: relative;
    padding-top: 2.8rem;
    >img {
      position: absolute;
      z-index: 2;
      top: .2rem;
      left: 5.75rem;
      width: 3.18rem;
    }
    >div {
      width: 10.24rem;
      height: 10.24rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url(../assets/images/player_record2.png), url(../assets/images/player_record1.png);
      background-repeat: no-repeat, no-repeat;
      background-position: center center, center center;
      background-size: cover, cover;
      img {
        width: 6.37rem;
        height: 6.37rem;
        border-radius: 50%;
        object-fit: cover;
      }
    }
  }
  &-control {
    position: absolute;
    left: 0;
    right: 0;
    bottom: .75rem;
    z-index: 2;
    &-prog {
      display: flex;
      align-items: center;
      padding: 0 .12rem;
      >span {
        display: inline-block;
        width: 1.4rem;
        text-align: center;
        font-size: 10px;
        color: var(--G-1);
      }
    }
    &-bar {
      flex: 1;
      height: .07rem;
      font-size: 0;
      border-radius: .1rem;
      background-color: rgba(#000, .2);
      div {
        position: relative;
        height: 100%;
        border-radius: .1rem;
        background-color: rgba(#000, .3);
        span {
          width: .27rem;
          height: .27rem;
          border-radius: 50%;
          background-color: #fff;
          position: absolute;
          top: calc(50% - .135rem);
          right: -.135rem;
        }
      }
    }
    &-btngroup {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: .39rem;
      div {
        width: .87rem;
        height: .87rem;
        font-size: 0;
        &:nth-child(2) {
          width: 2.1rem;
          height: 2.1rem;
          margin: 0 .75rem;
        }
        .icon {
          width: 100%;
          height: 100%;
          color: #d1d1d3;
        }
      }
    }
  }
  &-btmbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 500;
    display: flex;
    align-items: center;
    height: 1.35rem;
    padding: 0 .54rem 0 1.85rem;
    background-color: #fff;
    transition: bottom .45s;
    img {
      position: absolute;
      left: .18rem;
      bottom: .17rem;
      z-index: 2;
      width: 1.35rem;
      height: 1.35rem;
      border-radius: 50%;
      object-fit: cover;
    }
    p {
      flex: 1;
      width: 0;
      padding-right: .36rem;
      font-size: 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    svg {
      width: .9rem;
      height: .9rem;
    }
  }
}

</style>
