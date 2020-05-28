<template>
  <div class="toast" v-if="toastText != ''">{{ toastText }}</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Toast',
  computed: mapState(['toastText']),
  methods: mapMutations(['setToast']),
  watch: {
    toastText(n) {
      if (n == '') return

      setTimeout(() => {
        this.setToast('')
      }, 2500)
    }
  }
}

</script>
<style>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  padding: .24rem .45rem;
  border-radius: .15rem;
  font-size: 16px;
  color: #fff;
  background-color: rgba(0, 0, 0, .5);
}

</style>
