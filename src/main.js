import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/font'
import 'normalize.css'
import '@/assets/style/global.scss'

Vue.config.productionTip = false

Vue.prototype.$loading = (function() {

  return {
    show() {
      store.commit('setGLoading', true)
    },
    hide() {
      store.commit('setGLoading', false)
    }
  }
})()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
