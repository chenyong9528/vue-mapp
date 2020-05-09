import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import '@/assets/style/global.scss'
import LoadingGlobal from '@/components/LoadingGlobal.vue'

Vue.config.productionTip = false

Vue.prototype.$loading = (function() {
  let loadingInstance = null

  return {
    show() {
      if (!loadingInstance) {
        loadingInstance = new (Vue.extend(LoadingGlobal))
        document.body.appendChild(loadingInstance.$mount().$el)
      }
      loadingInstance.show()
    },
    hide() {
      loadingInstance.hide()
    }
  }
})()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
