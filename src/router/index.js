import Vue from 'vue'
import VueRouter from 'vue-router'
import Mv from '../views/Mv.vue'
import store from '../store'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Mv',
    component: Mv
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: () => import('../views/Ranking.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/top/:idx',
    name: 'Top',
    props: true,
    component: () => import('../views/Top.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const navName = ['Mv', 'Ranking', 'Search']
  const isToNav = navName.some((curr) => curr === to.name)

  store.commit('setFooter', isToNav ? 0 : 1)
  
  next()
})

export default router
