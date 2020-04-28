import Vue from 'vue'
import VueRouter from 'vue-router'
import Mv from '../views/Mv.vue'

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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Ranking.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
