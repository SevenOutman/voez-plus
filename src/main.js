import Vue from 'vue'
import VueTouch from 'vue-touch'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.use(VueTouch)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.http.options.emulateJSON = true
Vue.http.options.root        = /voez/.test(location.host) ? location.protocol + '//' + location.host : 'http://dev.voez.sevenoutman.com'

const router = new VueRouter({
    saveScrollPosition: true
})

import App from './App'
import Home from './components/Home.vue'
import About from './components/About.vue'
import SongList from './components/song-list/index.vue'
import Favorite from './components/favorite/index.vue'
import Leaderboard from './components/leaderboard/index.vue'
import Login from './components/login/index.vue'
router.map({
    '/':                    {
        component:  Home,
        routeIndex: 0,
        title:      'VOEZ+'
    },
    '/about':               {
        component:  About,
        routeIndex: 1,
        backRoute:  '/',
        backText:   'VOEZ+',
        title:      '关于'
    },
    '/songs':               {
        component:  SongList,
        routeIndex: 1,
        backRoute:  '/',
        backText:   'VOEZ+',
        title:      '歌曲列表'
    },
    '/leaderboard/:songId': {
        component:  Leaderboard,
        routeIndex: 2,
        backRoute:  '/songs',
        backText:   '歌曲',
        title(comp) {
            return comp.song.name
        }
    },
    '/favorite':            {
        component:  Favorite,
        routeIndex: 1,
        backRoute:  '/',
        backText:   'VOEZ+',
        title:      '关注歌曲'
    },
    '/login':               {
        component:  Login,
        routeIndex: 1,
        backRoute:  '/',
        backText:   'VOEZ+',
        title:      '登录'
    },
    '/my':                  {
        component(resolve) {
            store.dispatch('UPDATE_ROUTER_LOADING', true)
            require(['./components/my/index.vue'], resolve)
        },
        routeIndex: 2,
        backRoute:  '/',
        title:      '我的 VOEZ+',
        backText:   '首页',
        auth:       true
    },
    '/setting':             {
        component(resolve){
            store.dispatch('UPDATE_ROUTER_LOADING', true)
            require(['./components/setting/index.vue'], resolve)
        },
        routeIndex: 3,
        backRoute:  '/my',
        title:      '设置',
        backText:   '我的 VOEZ+',
        auth:       true
    }
})

router.alias({
    '/song':         '/songs',
    '/song/:songId': '/leaderboard/:songId'
})

router.redirect({
    '*': '/',
})

import store from './vuex/store'

function isLocalStorageSupported() {
    var testKey = 'test',
        storage = window.sessionStorage;
    try {
        storage.setItem(testKey, 'testValue');
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

function FakeStorage() {
    let _data = {}
    return {
        clear() {
            _data = {}
        },
        setItem(key, value) {
            _data[key] = value
        },
        getItem(key) {
            return _data[key]
        },
        removeItem(key) {
            _data[key] && delete _data[key]
        }
    }
}

window.isPrivateMode = !isLocalStorageSupported()

if (window.isPrivateMode || !window.localStorage) {
    window.localStorage = new FakeStorage()
}
if (window.isPrivateMode || !window.sessionStorage) {
    window.sessionStorage = new FakeStorage()
}

let history          = window.sessionStorage
history.clear()
history.setItem('/', 0)

router.beforeEach(({from, to, next, abort, redirect}) => {
    if (to.auth && !store.state.loginStatus) {
        redirect('/login')
    } else {

        const toIndex   = history.getItem(to.path) || to.routeIndex
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
    window._czc && window._czc.push(["_trackPageview", to.patch, from.path]);
})

import {sync} from 'vuex-router-sync'
sync(store, router)

import uuid from './helpers/uuid'
let clientId = localStorage.getItem('client_id')
if (!clientId) {
    clientId = uuid()
    localStorage.setItem('client_id', clientId)
}
store.dispatch('UPDATE_CLIENT_ID', clientId)


if (window.navigator.standalone === true) {
    let lastpage = localStorage.getItem('exitstatus')
    if (lastpage) {

        let lasttime = localStorage.getItem('exittime') * 1 || 0

        if (window.startTime - lasttime < 7200000) {
            router.replace(lastpage)
        }
    }
} else {
    router.replace('/')
}
router.start(App, '#app')

var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cspan id='cnzz_stat_icon_1260437888'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s4.cnzz.com/z_stat.php%3Fid%3D1260437888' type='text/javascript'%3E%3C/script%3E"));
