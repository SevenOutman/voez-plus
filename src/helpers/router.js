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

const router = new VueRouter({
  saveScrollPosition: true
})

sync(store, router)

let clientId = localStorage.getItem('client_id')
if (!clientId) {
  clientId = uuid()
  localStorage.setItem('client_id', clientId)
}
store.dispatch('UPDATE_CLIENT_ID', clientId)

router.map({
  '/': {
    component: Home,
    routeIndex: 0,
    title: 'VOEZ+'
  },
  '/about': {
    component: About,
    routeIndex: 1,
    backRoute: '/',
    backText: 'VOEZ+',
    title: '关于'
  },
  '/songs': {
    component: SongList,
    routeIndex: 1,
    backRoute: '/',
    backText: 'VOEZ+',
    title: '歌曲列表'
  },
  '/leaderboard/:songId': {
    component: Leaderboard,
    routeIndex: 2,
    backRoute: '/songs',
    backText: '歌曲',
    title (comp) {
      return comp.song.name
    }
  },
  '/favorite': {
    component: Favorite,
    routeIndex: 1,
    backRoute: '/',
    backText: 'VOEZ+',
    title: '关注歌曲'
  },
  '/login': {
    component: Login,
    routeIndex: 1,
    backRoute: '/',
    backText: 'VOEZ+',
    title: '登录'
  },
  '/my': {
    component (resolve) {
      store.dispatch('UPDATE_ROUTER_LOADING', true)
      require(['../components/my/index.vue'], resolve)
    },
    routeIndex: 2,
    backRoute: '/',
    title: '我的 VOEZ+',
    backText: '首页',
    auth: true
  },
  '/setting': {
    component (resolve) {
      store.dispatch('UPDATE_ROUTER_LOADING', true)
      require(['../components/setting/index.vue'], resolve)
    },
    routeIndex: 3,
    backRoute: '/my',
    title: '设置',
    backText: '我的 VOEZ+',
    auth: true
  }
})

router.alias({
  '/song': '/songs',
  '/song/:songId': '/leaderboard/:songId'
})

router.redirect({
  '*': '/'
})

router.beforeEach(({from, to, next, abort, redirect}) => {
  if (to.auth && !store.state.loginStatus) {
    redirect('/login')
  } else {
    const toIndex = history.getItem(to.path) || to.routeIndex
    const fromIndex = history.getItem(from.path) || from.routeIndex

    if (toIndex >= fromIndex) {
      store.dispatch('UPDATE_DIRECTION', 'forward')
    } else {
      store.dispatch('UPDATE_DIRECTION', 'reverse')
    }
    to.path !== '/' && history.setItem(to.path, toIndex)

    setTimeout(next, 50)
  }
})
router.afterEach(({from, to}) => {
  localStorage.setItem('exitstatus', to.path)
  localStorage.setItem('exittime', Date.now())
  window._czc && window._czc.push(['_trackPageview', to.patch, from.path])
})
export default router
