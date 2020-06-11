<template>
  <div class="tabs-wrapper" ref="wrapper" :style="{ top: `calc(${ top })` }">
    <div class="tabs-container" ref="container">
      <ul class="tabs">
        <li v-for="(item, index) of tabs" :key="item" :class="{ active: index === active }" @click="tabsSwitch(index)"><span>{{ item }}</span></li>
      </ul>
      <span class="tabs-bar" :style="{ transform: `translate3d(${ offsetBar }px, 0, 0)` }"></span>
    </div>
  </div>
</template>
<script>
import Velocity from 'velocity-animate'

const screenWidth = window.screen.width

export default {
  name: 'Tabs',
  props: {
    tabsActive: {
      type: Number,
      default: 0
    },
    tabs: {
      type: Array
    },
    top: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      active: this.tabsActive,
      tabsLiWidth: 0
    }
  },
  computed: {
    offsetBar() {
      return this.tabsLiWidth * this.active + this.tabsLiWidth / 2 - 14
    }
  },
  mounted() {
    const self = this
    const defaultLiWidth = screenWidth / 12.42 * 3
    const horizontalLiWidth = 36 * 3

    if (window.orientation == 0) {
      this.tabsLiWidth = defaultLiWidth
    } else {
      this.tabsLiWidth = horizontalLiWidth
    }

    window.addEventListener('orientationchange', function() {
      if (this.orientation == 0) {
        self.tabsLiWidth = defaultLiWidth
      } else {
        self.tabsLiWidth = horizontalLiWidth
      }
    })
  },
  methods: {
    tabsSwitch(index) {

      this.active = index

      Velocity(this.$refs.container, 'scroll', {
        container: this.$refs.wrapper,
        axis: 'x',
        duration: 350,
        easing: 'ease-out',
        offset: this.offsetBar - screenWidth / 2 + 14
      })

      this.$emit('tabClick', index)
      
    },
    
  }
}

</script>
<style lang="scss">
@import '@/assets/style/_mixin.scss';

.tabs-wrapper {
  position: sticky;
  top: 0;
  width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
  z-index: 500;
}
.tabs-wrapper::-webkit-scrollbar {
  display: none;
}
.tabs-container {
  position: relative;
  width: max-content;
  font-size: 0;
  &:after {
    @include b-bd(#ddd);
    @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
      transform: scaleY(0.3333333);
    }
  }
}
.tabs-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 28px;
  height: 4px;
  transition-timing-function: ease-out;
  transition: transform .35s;
  background-color: var(--T-0);
  z-index: 4;
}
.tabs {
  display: flex;
  width: max-content;
  background-color: #fff;
  li {
    width: 3rem;
    height: 1.38rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    background-color: #fff;
    -webkit-tap-highlight-color: transparent;
    span {
      transition: transform .35s;
    }
    &.active {
      color: var(--T-0);
      span {
        transform: scale(1.2);
      }
    }
  }
}

</style>
