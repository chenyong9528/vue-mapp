<template>
  <footer :style="{ transform: `translate3d(0, ${ showFooter ? 0 : '1.5rem' }, 0)` }">
    <router-link to="/" exact>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-play"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-play-fill"></use>
      </svg>
      <p>Mv</p>
    </router-link>
    <router-link to="/ranking" exact>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-integral"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-integral-fill"></use>
      </svg>
      <p>Ranking</p>
    </router-link>
    <router-link to="/search" exact>
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
  computed: mapState(['showFooter'])
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
  background-color: rgba(#fff, .98);
  transition: transform .35s;
  &:before {
    @include t-bd(#a4a4a4);
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
          display: block;
        }
      }
    }
  }
}
</style>
