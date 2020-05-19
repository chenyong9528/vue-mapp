<template>
  <div class="tabs-wrapper" ref="wrapper" :style="{ top: `calc(${ top })` }">
    <div class="tabs-container" ref="container">
      <ul class="tabs">
        <li v-for="(item, index) of tabs" :key="item" :class="{ active: index === active }" @click="tabsSwitch(index)">{{ item }}</li>
      </ul>
      <span class="tabs-bar" :style="{ transform: `translate3d(${ offsetBar }px, 0, 0)` }"></span>
    </div>
  </div>
</template>
<script>
import Velocity from 'velocity-animate'

const screenWidth = window.screen.width
const tabsLiWidth = screenWidth / 12.42 * 3

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
      active: this.tabsActive
    }
  },
  computed: {
    offsetBar() {
      return tabsLiWidth * this.active + tabsLiWidth / 2 - 14
    }
  },
  methods: {
    tabsSwitch(index) {

      this.active = index

      Velocity(this.$refs.container, 'scroll', {
        container: this.$refs.wrapper,
        axis: 'x',
        duration: 350,
        easing: 'linear',
        offset: this.offsetBar - screenWidth / 2 + 14
      })

      this.$emit('tabClick', index)
    }
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
    @include b-bd(#ebebeb);
  }
}
.tabs-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 28px;
  height: 4px;
  transition-timing-function: linear;
  transition: transform .35s;
  background-color: var(--T-0);
}
.tabs {
  display: flex;
  width: max-content;
  font-size: 15px;
  background-color: #fff;
  li {
    width: 3rem;
    padding: .3rem;
    flex-shrink: 0;
    font-size: 16px;
    text-align: center;
    box-sizing: border-box;
    background-color: #fff;
    -webkit-tap-highlight-color: transparent;
    &.active {
      color: var(--T-0);
    }
  }
}

</style>
