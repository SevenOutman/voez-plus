/**
 * Created by Doma on 2016/12/14.
 */
import VueRouter from 'vue-router'
import {sync} from 'vuex-router-sync'

import store from '../vuex/store'
import uuid from './uuid'

import Home from '../components/Home.vue'
import About from '../components/About.vue'
import SongList from '../components/song-list/index.vue'
import Favorite from '../components/favorite/index.vue'
import Leaderboard from '../components/leaderboard/index.vue'
import Login from '../components/login/index.vue'

let history = window.sessionStorage
history.clear()
history.setItem('/', 0)

const routes = [
  {path: '/', component: Home, routeIndex: 0, title: 'VOEZ+'},
  {
    path: '/about',
    component: About,
    meta: {
      routeIndex: 1,
      backRoute: '/',
      backText: 'VOEZ+',
      title: '关于'
    }
  },
  {
    path: '/songs',
    component: SongList,
    alias: ['/song'],
    meta: {
      routeIndex: 1,
      backRoute: '/',
      backText: 'VOEZ+',
      title: '歌曲列表'
    }
  },
  {
    path: '/leaderboard/:songId',
    component: Leaderboard,
    alias: ['/song/:songId'],
    meta: {
      routeIndex: 2,
      backRoute: '/songs',
      backText: '歌曲',
      title (comp) {
        return comp.song.name
      }
    }
  },
  {
    path: '/favorite',
    component: Favorite,
    meta: {
      routeIndex: 1,
      backRoute: '/',
      backText: 'VOEZ+',
      title: '关注歌曲'
    }
  },
  {
    path: '/login',
    component: Login,
    meta: {
      routeIndex: 1,
      backRoute: '/',
      backText: 'VOEZ+',
      title: '登录'
    }
  },
  {
    path: '/my',
    component (resolve) {
      store.dispatch('UPDATE_ROUTER_LOADING', true)
      require(['../components/my/index.vue'], resolve)
    },
    meta: {
      routeIndex: 2,
      backRoute: '/',
      title: '我的 VOEZ+',
      backText: '首页',
      auth: true
    }
  },
  {
    path: '/setting',
    component (resolve) {
      store.dispatch('UPDATE_ROUTER_LOADING', true)
      require(['../components/setting/index.vue'], resolve)
    },
    meta: {
      routeIndex: 3,
      backRoute: '/my',
      title: '设置',
      backText: '我的 VOEZ+',
      auth: true
    }
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

sync(store, router)

let clientId = localStorage.getItem('client_id')
if (!clientId) {
  clientId = uuid()
  localStorage.setItem('client_id', clientId)
}
store.commit('UPDATE_CLIENT_ID', clientId)

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !store.state.loginStatus) {
    router.replace('/login')
  } else {
    const toIndex = history.getItem(to.path) || to.meta.routeIndex
    const fromIndex = history.getItem(from.path) || from.meta.routeIndex

    if (toIndex >= fromIndex) {
      store.commit('UPDATE_DIRECTION', 'forward')
    } else {
      store.commit('UPDATE_DIRECTION', 'reverse')
    }
    to.path !== '/' && history.setItem(to.path, toIndex)

    setTimeout(next, 50)
  }
})
router.afterEach((to, from) => {
  localStorage.setItem('exitstatus', to.path)
  localStorage.setItem('exittime', Date.now())
  window._czc && window._czc.push(['_trackPageview', to.path, from.path])
})
export default router
