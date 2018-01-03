<template>
  <div>
    <dialog class="vplus-login-dialog" :scroll="false" :show.sync="showLoginDialog"
            dialog-transition="vplus-login-dialog" hide-on-blur>
      <login></login>
    </dialog>
    <div class="master-detail-layout">
      <view-box class="view-box master-box">
        <!--header slot-->
        <div class="vux-demo-header-box" slot="header" v-if="isWebApp">
          <x-header :left-options="{showBack: false}" title="VOEZ+"
                    @on-click-title="scrollTop" @on-click-back="goBack"></x-header>
        </div>
        <!--default slot-->
        <home></home>
      </view-box>
      <view-box class="view-box detail-box" v-ref:view-box>
        <action-sheet :menus="actionSheet.menus" :show-cancel="actionSheet.showCancel" cancel-text="取消"
                      :show.sync="actionSheet.show"
                      v-ref:action-sheet></action-sheet>
        <loading :show="routerLoading" text="加载中"></loading>
        <loading :show="loading.show" :text="loading.text"></loading>
        <toast :show.sync="toast.show" :type="toast.type">{{ toast.text }}</toast>
        <confirm :show.sync="showLoginConfirm" title="提示" confirm-text="确定"
                 cancel-text="取消" @on-confirm="goLogin">
          <p>您即将使用《兰空VOEZ》游戏账号和密码登录『我的 VOEZ+』测试版，本站不是官方授权的站点，登录即代表您已知晓并同意以下条款。</p>
          <p>1. 本站将会记录、存储您的 VOEZ 账号和密码。</p>
          <p>2. 本站不会冒用您的信息，不会使用您的 VOEZ 账号和密码进行除您在本站手动操作范围以外的任何活动。</p>
          <p>3. 登录将会占用您 VOEZ 账号的绑定设备数。</p>
          <p>4. 您知晓以下风险并将自行承担可能带来的后果：</p>
          <p>本站遭到第三方攻击而造成您的 VOEZ 账号和密码泄露。</p>
          <p>VOEZ 官方的接口改变而导致本站部分或全部功能无法继续使用。</p>
        </confirm>
        <confirm :show.sync="confirm.show" title="提示" confirm-text="确定"
                 cancel-text="取消" @on-confirm="confirm.onConfirm" @on-cancel="confirm.onCancel">
          <p>{{ confirm.text }}</p>
        </confirm>
        <confirm :show.sync="showReloginConfirm" title="提示" confirm-text="确定"
                 cancel-text="取消" @on-confirm="$router.go('my')">
          <p>进入『我的 VOEZ+』将导致您正在游玩的《兰空VOEZ》下线。</p>
        </confirm>
        <dialog class="vplus-welcome-dialog" :scroll="false" :show="showWelcomeDialog">
          <p>欢迎使用 VOEZ+</p>
          <div class="img-box">
            <img src="http://voez.sevenoutman.com/assets/azami.jpg" alt="薊">
          </div>
          <div class="vplus-welcome-dialog-content">
            <p>好久不见，我是薊。</p>
            <p>欢迎来玩。记得阅读『关于』。</p>
            <p>&nbsp;</p>
            <p>薊 2016.9</p>
          </div>
          <span class="vux-close" style="margin: 8px auto" @click="showWelcomeDialog = false"></span>
        </dialog>
        <!--header slot-->
        <div class="vux-demo-header-box" slot="header" v-if="isWebApp">
          <x-header :left-options="leftOptions" :transition="headerTransition" :title="title"
                    @on-click-title="scrollTop" @on-click-back="goBack"></x-header>
          <!--<x-header :left-options="leftOptions" :title="title"-->
          <!--@on-click-title="scrollTop" @on-click-back="goBack"></x-header>-->
        </div>
        <!--default slot-->
        <router-view class="router-view" v-ref:router-view
                     :transition="'vux-pop-' + (direction === 'forward' ? 'in' : (direction === 'reverse' ? 'out' : ''))"></router-view>
        <!--<router-view class="router-view" v-ref:router-view></router-view>-->
      </view-box>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-undef */

  import vuexStore from './vuex/store'
  import vuexActions from './vuex/actions'

  import {Loading, Toast, Confirm, XDialog as Dialog, Actionsheet as ActionSheet, ViewBox} from 'vux'

  import Home from './components/iPadHome.vue'
  import Login from './components/login/index-ipad.vue'

  import XHeader from './components/common/x-header.vue'

  import noop from './helpers/noop'

  export default {
    components: {
      Loading,
      Toast,
      Confirm,
      Dialog,
      ActionSheet,
      ViewBox,
      XHeader,
      Home,
      Login
    },
    data () {
      return {
        showStartup: false,
        isWebApp: isWebApp(),
        actionSheet: {
          show: false,
          menus: {},
          showCancel: true
        },
        loading: {
          show: false,
          text: '加载中'
        },
        toast: {
          show: false,
          type: 'text',
          text: ''
        },
        confirm: {
          show: false,
          text: '',
          onConfirm: () => {
          },
          onCancel: () => {
          }
        },
        showLoginDialog: false,
        showLoginConfirm: false,
        showReloginConfirm: false,
        showWelcomeDialog: false
      }
    },
    computed: {
      leftOptions () {
        return {
          backText: this.route.backText,
          showBack: this.route.routeIndex > 1,
          preventGoBack: true
        }
      },
      headerTransition () {
        return this.direction === 'forward' ? 'vux-header-fade-in-right'
          : (this.direction === 'reverse' ? 'vux-header-fade-in-left' : '')
      },
      title () {
        if (this.route.title) {
          if (this.route.title instanceof Function) {
            return this.route.title(this.$refs.routerView)
          }
          return this.route.title
        }
        return 'VOEZ+'
      }
    },
    methods: {
      scrollTop () {
        this.$refs.viewBox.$els.viewBoxBody.scrollTop = 0
      },
      goBack () {
        if (this.route.routeIndex > 0) {
          this.$router.go(this.route.backRoute)
        }
      },
      hideStartupView () {
        let endTime = Date.now()
        setTimeout(() => {
          let startup = document.querySelector('.startup')

          // Browser environment sniffing
          let inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]'
          let UA = inBrowser && window.navigator.userAgent.toLowerCase()
          let isIE9 = UA && UA.indexOf('msie 9.0') > 0
          // let transitionProp
          // let transitionEndEvent
          // let animationProp
          let animationEndEvent

          // Transition property/event sniffing
          if (inBrowser && !isIE9) {
            // let isWebkitTrans = window.ontransitionend === undefined && window.onwebkittransitionend !== undefined
            let isWebkitAnim = window.onanimationend === undefined && window.onwebkitanimationend !== undefined
            // transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition'
            // transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend'
            // animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation'
            animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend'
          }

          startup.addEventListener(animationEndEvent, () => {
            startup.style.display = 'none'
            startup.parentNode.removeChild(startup)
          }, false)

          if (startup.classList) {
            startup.classList.add('voez-startup-fade-leave')
          } else {
            startup.className = startup.className + ' voez-startup-fade-leave'
          }

          if (this.route.path === '/') {
            let lastvisit = localStorage.getItem('lastvisit') * 1 || 0
            if (!lastvisit) {
              localStorage.setItem('lastvisit', Date.now())

              setTimeout(() => {
                this.$broadcast('sys:dialog.welcome')
              }, 1000)
            }
          }
        }, Math.max(500, 2000 - (endTime - window.startTime)))
      },
      autoLogin (callback) {
        let authName = localStorage.getItem('auth_name')
        let authToken = localStorage.getItem('auth_token')
        if (authName && authToken) {
          this.$http.post('account/autologin', {
            'auth_name': authName,
            'auth_token': authToken
          }).then(response => {
            let res = JSON.parse(response.body)
            if (res.result && res.code === 0) {
              if (res.info.auth_name && res.info.auth_token) {
                localStorage.setItem('auth_name', res.info.auth_name)
                localStorage.setItem('auth_token', res.info.auth_token)
              }
              this.storeUpdateUser(res.info.user)
              this.storeUpdateSetting(res.info.setting)
              callback && callback()
            }
          })
        } else {
          callback && callback()
        }
      },
      updateSongs (songs) {
        this.storeUpdateSongs(songs)
        localStorage.setItem('songs', JSON.stringify(songs))
      },
      goLogin () {
        this.showLoginConfirm = false
        this.showWelcomeDialog = false
        this.confirm.show = false
        this.actionSheet.show = false

        this.showLoginDialog = true
      }
    },
    store: vuexStore,
    vuex: {
      getters: {
        loginStatus: state => state.loginStatus,
        route: state => state.route,
        routerLoading: state => state.routerLoading,
        direction: state => state.direction,
        setting: state => state.setting,
        clientId: state => state.clientId
      },
      actions: vuexActions
    },
    events: {
      'sys:actionsheet' (options) {
        let menus = {}
        Object.keys(options.menus).forEach(key => {
          menus[key] = options.menus[key].text
          this.$refs.actionSheet.$on(`on-click-menu-${key}`, options.menus[key].action)
        })
        this.actionSheet.menus = menus
        this.actionSheet.showCancel = options.showCancel
        this.$nextTick(() => {
          this.actionSheet.show = true

          this.confirm.show = false
          this.showLoginConfirm = false
          this.showLoginDialog = false
          this.showWelcomeDialog = false
        })
      },
      'sys:loading.on' (text) {
        this.loading.text = text || '加载中'
        this.loading.show = true
      },
      'sys:loading.off' () {
        this.loading.show = false
      },
      'sys:toast' (text) {
        this.toast.type = 'text'
        this.toast.text = text
        this.toast.show = true
      },
      'sys:toast.success' (text) {
        this.toast.type = 'success'
        this.toast.text = text
        this.toast.show = true
      },
      'sys:toast.cancel' (text) {
        this.toast.type = 'cancel'
        this.toast.text = text
        this.toast.show = true
      },
      'sys:toast.warn' (text) {
        this.toast.type = 'warn'
        this.toast.text = text
        this.toast.show = true
      },
      'sys:confirm' (options) {
        this.confirm.text = options.text || ''
        this.confirm.onConfirm = options.onConfirm || noop
        this.confirm.onCancel = options.onCancel || noop
        this.confirm.show = true

        this.actionSheet.show = false
        this.showLoginConfirm = false
        this.showLoginDialog = false
        this.showWelcomeDialog = false
      },
      'sys:login' () {
        this.goLogin()
      },
      'login:success' () {
        this.$router.go('/my')
        setTimeout(() => {
          this.showLoginDialog = false
        }, 1000)
      },
      'home:login-confirm' () {
        this.showWelcomeDialog = false
        this.showLoginDialog = false
        this.confirm.show = false
        this.actionSheet.show = false

        this.showLoginConfirm = true
      },
      'home:welcome' () {
        this.showLoginDialog = false
        this.showLoginConfirm = false
        this.confirm.show = false
        this.actionSheet.show = false

        this.showWelcomeDialog = true
      }
    },
    watch: {
      'actionSheet.show' (val) {
        if (!val) {
          Object.keys(this.actionSheet.menus).forEach(key => {
            this.$refs.actionSheet.$off(`on-click-menu-${key}`)
          })
        }
      }
    },
    created () {
      this.storeUpdateSongs(JSON.parse(localStorage.getItem('songs')) || [])

      this.$http.post('client/autologin', {
        client_id: this.clientId
      }).then(response => {
        let res = JSON.parse(response.body)
        if (res.result && res.code === 0) {
          this.storeUpdateClient(res.info.client)
        }
      })

      this.$http.get('voez/songs').then(response => {
        let res = JSON.parse(response.body)
        if (res.result && res.code === 0) {
          this.updateSongs(res.info.songs)
        }
      })

      this.$http.get('voez/announcement').then(response => {
        let res = JSON.parse(response.body)
        if (res.result && res.code === 0) {
          this.storeUpdateAnnouncements(res.info.announcement)
          this.hideStartupView()
        }
      }).catch(() => {
        alert('VOEZ+ 遇到问题正在维护，请稍后再试')
      })
      this.autoLogin(() => {
      })
      let preload = new Image()
      preload.src = 'http://voez.sevenoutman.com/voez/cover/default/750'

      if (!isWebApp()) {
        this.$watch('title', val => {
          document.title = val
          const ua = navigator.userAgent.toLowerCase()
          if (ua.indexOf('iphone') > -1 &&
            (ua.indexOf('micromessenger') > -1 || ua.indexOf('qq') > -1)) {
            const iframe = document.createElement('iframe')
            iframe.src = '/assets/icon_57.png'
            const listener = () => {
              setTimeout(() => {
                iframe.removeEventListener('load', listener)
                setTimeout(() => {
                  document.body.removeChild(iframe)
                }, 0)
              }, 0)
            }
            iframe.addEventListener('load', listener)
            document.body.appendChild(iframe)
          }
        })
      }
    },
    ready () {
      let touchStart = null

      const TRIGGER_SLOPE = 0.2
      const TRIGGER_DISTANCE = 50
      const TRIGGER_VELOCITY = 150
      const ifSwipeRight = e => {
        if (e.changedTouches.length === 1 && touchStart) {
          let touch = e.changedTouches[0]
          let deltaX = touch.pageX - touchStart.x
          if (deltaX > TRIGGER_DISTANCE) {
            let deltaY = touch.pageY - touchStart.y
            if (Math.abs(deltaY / deltaX) < TRIGGER_SLOPE) {
              let deltaTime = Date.now() - touchStart.timestamp
              if (deltaX / (deltaTime / 1000) > TRIGGER_VELOCITY) {
                e.preventDefault()
                e.stopPropagation()
                this.goBack()
                document.removeEventListener('touchmove', ifSwipeRight, false)
              }
            }
          }
        }
      }
      this.$refs.viewBox.$el.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
          let touch = e.touches[0]
          touchStart = {
            x: touch.pageX,
            y: touch.pageY,
            timestamp: Date.now()
          }
          document.addEventListener('touchmove', ifSwipeRight, false)
        }
      }, false)

      this.$router.beforeEach(() => {
        this.showLoginConfirm = false
        this.showWelcomeDialog = false
        this.confirm.show = false
        this.actionSheet.show = false
      })
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import '~vux/src/styles/reset.less';

  html, body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    background-color: #fbf9fe;
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    /*-webkit-overflow-scrolling: touch;*/
  }

  body.ipad::before {
    content: " ";
    position: absolute;
    left: 320px;
    top: 0;
    height: 100%;
    width: 1px;
    border-left: 1px solid #d9d9d9;
    color: #d9d9d9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
    z-index: 10001;
  }

  body.ipad.pro::before {
    left: 375px;
  }

  span[id^=cnzz] {
    display: none !important;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  #app {
    height: 100%;
  }

  /* v-r-transition, default is {forward: 'forward', back: 'back'}*/
  .forward-enter, .forward-leave {
    transform: translate3d(-100%, 0, 0);
  }

  .back-enter, .back-leave {
    transform: translate3d(100%, 0, 0);
  }

  .master-detail-layout {
    display: flex;
    height: 100%;
    overflow-y: auto;

    .view-box {
      height: 100%;
      transform: translate3d(0, 0, 0);

      &.master-box {
        width: 320px;
        background-color: #fbf9fe;
        z-index: 2;
      }
      &.detail-box {
        flex-grow: 1;
        .weui_dialog {
          width: auto !important;
          box-shadow: 0 1px 20px 0 rgba(0, 0, 0, .2);
        }
        .weui_mask, .weui_fade_toggle {
          background-color: rgba(0, 0, 0, .2);
        }
      }
      .vux-demo-header-box {
        z-index: 100;
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        .vux-header-title, h1 {
          margin-left: 88px;
        }
      }

      .router-view {
        background-color: #fbf9fe;
      }

      .weui_tab_bd {
        padding-bottom: 0;
      }

      [slot='header'] + .weui_tab_bd {
        padding-top: 46px;
      }

    }
  }

  .vplus-login-dialog {
    .weui_dialog {
      width: 400px;
      border-radius: 5px;
      padding-bottom: 15px;
      z-index: 10003;
    }
    .weui_mask {
      z-index: 10002;
    }
    .vplus-login-dialog-transition {
      -webkit-transition-duration: .4s;
      transition-duration: .4s;
      -webkit-transform: translate3d(-50%, -50%, 0) !important;
      transform: translate3d(-50%, -50%, 0) !important;
      -webkit-transition-property: opacity, -webkit-transform !important;
      transition-property: opacity, -webkit-transform !important;
      transition-property: transform, opacity !important;
      transition-property: transform, opacity, -webkit-transform !important;
    }

    .vplus-login-dialog-enter {
      transform: translate3d(-50%, 150%, 0) !important;
    }

    .vplus-login-dialog-leave {
      transform: translate3d(-50%, 150%, 0) !important;
    }
  }

  .vplus-welcome-dialog {
    .weui_dialog {
      width: 272px;
    }
    p {
      color: #666666;
      line-height: 40px;
    }
    .img-box {
      height: 118px;
      overflow: hidden;
      & > img {
        max-width: 100%;
        margin-top: -143px;
        display: block;
      }
    }
    .vplus-welcome-dialog-content {

      height: 150px;
      padding: 10px 15px;
      text-align: start;

    }
  }

  .pro .master-detail-layout .view-box.master-box {
    width: 375px;
  }

  /**
  * vue-router transition
  */
  .vux-pop-out-transition,
  .vux-pop-in-transition {
    width: 100%;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    backface-visibility: hidden;
  }

  .vux-pop-out-enter,
  .vux-pop-out-leave,
  .vux-pop-in-enter,
  .vux-pop-in-leave {
    will-change: transform;
    height: 100%;
    position: absolute;
    left: 0;
  }

  .vux-pop-out-enter {
    animation-name: popInLeft;
  }

  .vux-pop-out-leave {
    z-index: 1;
    animation-name: popOutRight;
  }

  .vux-pop-in-enter {
    z-index: 1;
    animation-name: popInRight;
  }

  .vux-pop-in-leave {
    animation-name: popOutLeft;
  }

  @keyframes popInLeft {
    from {
      transform: translate3d(-30%, 0, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes popOutLeft {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(-30%, 0, 0);
    }
  }

  @keyframes popInRight {
    from {
      transform: translate3d(100%, 0, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes popOutRight {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(100%, 0, 0);
    }
  }

</style>
