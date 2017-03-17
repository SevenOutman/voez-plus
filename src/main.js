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
Vue.http.options.root        = /voez/.test(location.host) ? location.protocol + '//' + location.host : 'http://voez.sevenoutman.com'


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

const iPad = /ipad/.test(window.navigator.userAgent.toLocaleLowerCase())
const pro  = iPad && document.body.clientWidth >= 1024 && document.body.clientHeight >= 1024

let router
if (isWebApp() && iPad) {
    console.log('iPad WebApp')
    router = require('./helpers/router-ipad').default
    document.body.classList.add('ipad')
    if (pro) {
        document.body.classList.add('pro')
    }
} else {
    console.log('Not iPad WebApp')
    router = require('./helpers/router').default
}

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
import iPadApp from './iPadApp'
import App from './App'
router.start((isWebApp() && iPad) ? iPadApp : App, '#app')

var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cspan id='cnzz_stat_icon_1260437888'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s4.cnzz.com/z_stat.php%3Fid%3D1260437888' type='text/javascript'%3E%3C/script%3E"));
