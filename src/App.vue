<template>
  <div id="app">
    <router-view />
    
    <Footer />
    
    <Player />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Footer from '@/components/Footer.vue'
import Player from '@/components/Player.vue'

export default {
  name: 'App',
  components: {
    Footer,
    Player
  },
  computed: mapState(['showFooter'])
}

</script>
<style lang="scss">
.slide-enter,
.slide-leave-to {
  transform: translate3d(0, 100%, 0);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform .45s;
}

.slide-enter-to,
.slide-leave {
  transform: translate3d(0, 0, 0);
}

</style>
