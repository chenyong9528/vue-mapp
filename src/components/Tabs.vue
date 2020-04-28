<template>
  <div class="tabs-wrapper" ref="wrapper">
    <div class="tabs-container" ref="container">
      <ul class="tabs">
        <li v-for="(item, index) of tabs" :key="item" :class="{active: index==active}" @click="tabsSwitch(index)">{{ item }}</li>
      </ul>
      <span class="tabs-bar" :style="{left: `${offsetBar}px`}"></span>
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
        offset: this.offsetBar - screenWidth / 2 + 14
      })

      this.$emit('handleClick', index)
    }
  }
}

</script>
<style lang="scss">
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
}
.tabs-bar {
  position: absolute;
  bottom: 0;
  width: 28px;
  height: 4px;
  transition-timing-function: linear;
  transition: left .35s;
  background-color: var(--T-0);
}
.tabs {
  // display: grid;
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
