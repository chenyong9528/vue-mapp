<template>
  <footer :style="{ transform: `translate3d(0, ${ offset }rem, 0)` }">
    <router-link to="/" exact replace>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-play"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-play-fill"></use>
      </svg>
      <p>Mv</p>
    </router-link>
    <router-link to="/ranking" exact replace>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-integral"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-integral-fill"></use>
      </svg>
      <p>Ranking</p>
    </router-link>
    <router-link to="/search" exact replace>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-search"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-search"></use>
      </svg>
      <p>Search</p>
    </router-link>
  </footer>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'Footer',
  computed: {
    ...mapState(['footerOffset']),
    offset() {
      switch (this.footerOffset) {
        case 0:
          return 0
        case 1:
          return 1.5
        default:
          return 3
      }
    },
  }
}

</script>
<style lang="scss">
@import '@/assets/style/_mixin.scss';

footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  background-color: rgba(#fff, .99);
  transition: transform .35s;
  &:before {
    @include t-bd(#a4a4a4);
    @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
      transform: scaleY(0.3333333);
    }
  }
  a {
    flex: 1;
    height: 1.5rem;
    box-sizing: border-box;
    padding-top: .1rem;
    text-align: center;
    font-size: 0;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    color: #959594;
    .icon {
      width: .98rem;
      height: .98rem;
      margin: 0 auto;
      &:nth-child(2) {
        display: none;
      }
	}
    p {
      margin: 0;
      font-size: 10px;
    }
    &.router-link-active {
      color: var(--T-0);
      .icon {
        &:first-child {
          display: none;
        }
        &:nth-child(2) {
          display: unset;
        }
      }
    }
  }
}
</style>
