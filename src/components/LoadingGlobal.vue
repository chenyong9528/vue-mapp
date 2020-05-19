<template>
<div class="g-loading" @touchmove.stop.prevent v-show="globalLoading">
  <div class="g-loading-center">
    <i class="icon-loading"></i>
    <p>Loading...</p>
  </div>
</div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'LoadingGlobal',
  computed: mapState(['globalLoading'])
}
</script>
<style lang="scss">
.g-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  &-center {
    width: 110px;
    height: 110px;
    border-radius: 6px;
    font-size: 14px;
    color: #fff;
    background-color: rgba(0,0,0,.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    i {
      display: inline-block;
      width: 38px;
      height: 38px;
      margin: 5px 0;
      animation: Gloading 1s steps(12, end) infinite;
    }
  }
}

@keyframes Gloading {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}
</style>