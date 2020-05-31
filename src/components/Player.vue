<template>
  <div>
    <transition name="slide"><!-- @touchmove.stop.prevent -->
      <div class="player" :style="{ backgroundImage: `url(${ completeImg })` }" v-show="player.isFull">
        <header class="player-header">
          <span @touchstart="M_player({ tag: 'playModel', playload: false })">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-arrow-down"></use>
            </svg>
          </span>
          <div>
            <h5>{{ getBase('name') }}</h5>
            <p>{{ getBase('ar') }}</p>
          </div>
          <span></span>
        </header>
        <div v-if="!showLyric" @click="showLyric = true" class="player-record">
          <img src="../assets/images/player_handle.png" :style="{ transform: `rotate(${ player.isPlay ? 0 : '-30deg' })` }">
          <div :style="{ 'animation-play-state': tempPlay ? 'running' : 'paused' }">
            <span :style="{ backgroundImage: `url(${ completeImg })` }"></span>
          </div>
        </div>
        <div v-else @click="showLyric = false" class="player-lyric">
          <ul v-if="getLyric">
            <li v-for="({ content, time }, index) of getLyric" :key="index" :class="{ current: player.currentTime >= time }">{{ content }}</li>
          </ul>
        </div>
        <section class="player-control">
          <div class="player-control-prog">
            <span>{{ diyTime(tempTime ? tempTime : player.currentTime) }}</span>
            <div class="player-control-bar" ref="controlBar">
              <div :style="{ width: `${ getProg }%` }"><span @touchstart="handleStart" @touchmove="handleMove" @touchend="handleEnd"></span></div>
            </div>
            <span>{{ diyTime(player.endTime) }}</span>
          </div>
          <div class="player-control-btngroup">
            <div @touchstart="currentAudio">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-backwardfill"></use>
              </svg>
            </div>
            <div>
              <svg class="icon" aria-hidden="true" v-if="!player.isPlay" @touchstart="player.instance.play()">
                <use xlink:href="#icon-play-fill"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else @touchstart="player.instance.pause()">
                <use xlink:href="#icon-suspended-fill"></use>
              </svg>
            </div>
            <div @touchstart="nextAudio">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-play_forward_fill"></use>
              </svg>
            </div>
          </div>
        </section>
        <div class="player-blur" :style="{ backgroundImage: `url(${ completeImg })` }"></div>
      </div>
    </transition>
    <section class="player-btmbar" :style="{ transform: `translate3d(0, ${ showFooter ? '-1.49rem' : 0 }, 0)` }">
      <div class="player-btmbar-box" :class="{ disabled: !player.queue.length }" @touchstart="M_player({ tag: 'playModel', playload: true })">
        <span :style="{ backgroundImage: `url(${ completeImg })`, 'animation-play-state': player.isPlay ? 'running' : 'paused' }"></span>
        <p>{{ getBase('name') }}</p>
        <svg width="128" height="128" viewBox="0 0 128 128" @touchstart.stop="switchPlay">
          <circle cx="64" cy="64" r="55" fill="none" stroke="#3478F6" stroke-width="10" />
          <circle cx="64" cy="64" r="49" fill="none" stroke="#3478F6" stroke-width="10" stroke-dasharray="307.87" :stroke-dashoffset="getOffset" transform="rotate(-90, 64, 64)" />
          <template v-if="!player.isPlay">
            <polyline points="53 45 53 83 85.9 64 53 45" stroke="#3478F6" stroke-width="12" stroke-linecap="round" fill="#3478F6" stroke-linejoin="round" />
          </template>
          <template v-else>
            <polyline points="52 42 52 86" stroke="#3478F6" stroke-width="12" stroke-linecap="butt" stroke-linejoin="miter" />
            <polyline points="76 42 76 86" stroke="#3478F6" stroke-width="12" stroke-linecap="butt" stroke-linejoin="miter" />
          </template>
        </svg>
      </div>
    </section>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import img from '../assets/images/player_placeholder.png'

export default {
  name: 'Player',
  data() {
    return {
      tempTime: false,/* 非false时接管player.currentTime */
      startX: 0,
      completeImg: img,
      tempPlay: false,
      showLyric: true
    }
  },
  computed: {
    ...mapState(['showFooter', 'player']),
    getSrc() {
      const { queue, queueActive } = this.player

      return queue[queueActive]?.al.picUrl
    },
    getLyric() {
      const { queue, queueActive } = this.player
      
      return queue[queueActive]?.lyric.split('\n').map(curr => {
        return {
          content: curr.slice(11),
          time: curr.slice(1, 10).split(':').reduce((c, n) => c * 60 + Number(n))
        }
      })
    },
    getIsPlay() {
      return this.player.isPlay
    },
    getBase() {
      return (tag) => {
        const { queue, queueActive } = this.player

        switch (tag) {
          case 'name':
            return queue[queueActive]?.name || '球球音乐，让生活充满音乐'
          case 'ar':
            return queue[queueActive]?.ar.map(curr => curr.name).join(',') || ''
          default:
            return
        }
      }
    },
    getProg() {
      const { currentTime, endTime } = this.player
      
      return ((this.tempTime ? this.tempTime : currentTime) / endTime * 100).toFixed(2)
    },
    getOffset() {
      const { currentTime, endTime } = this.player

      return (307.87 - currentTime / endTime * 307.87).toFixed(2)
    },
    diyTime: () => (time) => {
      time = parseInt(time)

      return `0${ Math.floor(time / 60) }:${ (time % 60) > 9 ? (time % 60 ): `0${ time % 60 }`}`
    }
  },
  methods: {
    ...mapMutations(['M_player']),
    ...mapActions(['switchAudio']),
    currentAudio() {
      const { queue, queueActive } = this.player

      this.M_player({
        tag: 'switchAudio',
        playload: queueActive ? queueActive - 1 : queue.length - 1
      })
      this.switchAudio()
    },
    nextAudio() {
      const { queue, queueActive } = this.player

      this.M_player({
        tag: 'switchAudio',
        playload: queueActive === queue.length - 1 ? 0 : queueActive + 1
      })
      this.switchAudio()
    },
    switchPlay() {
      const { isPlay, instance } = this.player

      isPlay ? instance.pause() : instance.play()
    },
    handleStart(e) {
      const { currentTime } = this.player

      e.target.style.width = '.42rem'
      e.target.style.height = '.42rem'
      this.startX = e.touches[0].clientX
      this.tempTime = currentTime
    },
    handleMove(e) {
      const { width, x } = this.$refs.controlBar.getBoundingClientRect()

      this.handleMove = (e) => {
        const clientX = e.touches[0].clientX
        const { endTime } = this.player

        // 处理滑到到边界的问题
        if (clientX < x) {
          this.tempTime = 0.001
          return
        }
        if (clientX > (x + width)) {
          this.tempTime = endTime
          return
        }

        const offset = clientX - this.startX
        const onePxToTime = 1 / width * endTime

        this.startX = clientX
        this.tempTime += offset * onePxToTime
      }
      this.handleMove(e)
    },
    handleEnd(e) {
      const { instance } = this.player
      e.target.style.width = '.27rem'
      e.target.style.height = '.27rem'
      instance.currentTime = this.tempTime

      // 滑动结束会先回到音乐当前进度，再恢复拉到的位置，
      // 原因是instance回调晚于vue计算属性的执行，提前更新updateCurrentTime来解决
      this.M_player({
        tag: 'updateCurrentTime',
        playload: this.tempTime
      })

      this.tempTime = false
    }
  },
  watch: {
    getSrc(n) {
      const img = new Image()
      img.src = n

      img.onload = () => {
        this.completeImg = n
      }
    },
    getIsPlay(n) {
      if (n) {
        setTimeout(() => {
          this.tempPlay = n
        }, 380)
      } else {
        this.tempPlay = n
      }
    }
  }
}

</script>
<style lang="scss">
.player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 600;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  transition: background-image 1.2s;
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1.7rem;
    padding: 0 .52rem;
    color: #e1e1e1;
    span {
      display: inline-block;
      width: 1.02rem;
      height: 1.02rem;
      font-size: 0;
      -webkit-tap-highlight-color: transparent;
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
        font-size: 17px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      p {
        font-size: 12px;
        color: #ccc;
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
      transition: transform .5s;
      transform-origin: .47rem .47rem;
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
      animation: linearRotate 22s linear infinite;
      span {
        display: block;
        width: 6.37rem;
        height: 6.37rem;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        transition: background-image 1.2s;
      }
    }
  }
  &-lyric {
    height: 74vh;
    overflow-y: auto;
    >ul {
      li {
        padding: 0 12px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &.current {
          color: blue;
        }
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
        font-size: 11px;
        color: rgba(#000, .25);
      }
    }
    &-bar {
      flex: 1;
      height: .07rem;
      font-size: 0;
      border-radius: .1rem;
      background-color: rgba(#000, .25);
      div {
        position: relative;
        height: 100%;
        border-radius: .1rem;
        background-color: rgba(#000, .2);
        span {
          width: .27rem;
          height: .27rem;
          border-radius: 50%;
          background-color: #fff;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(50%, -50%);
          &:after {
            position: absolute;
            content: " ";
            width: .6rem;
            height: .6rem;
            top: calc(50% - .3rem);
            left: calc(50% - .3rem);
            border-radius: 50%;
            background-color: transparent;
            z-index: 1;
          }
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
        -webkit-tap-highlight-color: transparent;
        &:nth-child(2) {
          width: 2.1rem;
          height: 2.1rem;
          margin: 0 .75rem;
        }
        .icon {
          width: 100%;
          height: 100%;
          color: #e1e1e1;
          -webkit-tap-highlight-color: transparent;
        }
      }
    }
  }
  &-blur {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    margin: -1.4rem;
    filter: blur(.8rem);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    transition: background-image 1.2s;
  }
  &-btmbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 450;
    height: 1.35rem;
    background-color: #fff;
    transition: transform .35s;
    box-shadow: 0 -2px .36rem rgba(#000, .08);
    &-box {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 .54rem 0 1.85rem;
      &.disabled {
        pointer-events: none;
        p, svg {
          opacity: .5;
          color: #777;
        }
      }
      >span {
        position: absolute;
        left: .18rem;
        bottom: .17rem;
        z-index: 2;
        width: 1.35rem;
        height: 1.35rem;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        animation: linearRotate 22s linear infinite;
        transition: background-image 1.2s;
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
        width: .96rem;
        height: .96rem;
        -webkit-tap-highlight-color: transparent;
      }
    }
  }
}
@keyframes linearRotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
