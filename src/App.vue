<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <Footer />
    <Player />
    <LoadingGlobal />
  </div>
</template>
<script>
import Footer from '@/components/Footer.vue'
import Player from '@/components/Player.vue'
import LoadingGlobal from '@/components/LoadingGlobal.vue'

export default {
  name: 'App',
  components: {
    Footer,
    Player,
    LoadingGlobal
  }
}

</script>
<style lang="scss">

</style>
