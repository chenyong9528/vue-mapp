<template>
  <div id="app">
    <keep-alive :exclude="exList">
      <router-view></router-view>
    </keep-alive> 
    <Player />
    <Footer />
    <Toast />
    <LoadingGlobal />
  </div>
</template>
<script>
import Footer from '@/components/Footer.vue'
import Player from '@/components/Player.vue'
import LoadingGlobal from '@/components/LoadingGlobal.vue'
import Toast from '@/components/Toast.vue'

export default {
  name: 'App',
  data() {
    return {
      exList: ['Top']
    }
  },
  components: {
    Player,
    Footer,
    Toast,
    LoadingGlobal
  }
}

</script>
<style lang="scss">

</style>
