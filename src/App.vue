<template>
  <div>
    <loading :show="routerLoading" text="加载中"></loading>
    <loading :show="loading.show" :text="loading.text"></loading>
    <toast :show.sync="toast.show" :type="toast.type">{{ toast.text }}</toast>
    <confirm :show.sync="confirm.show" title="提示" confirm-text="确定"
             cancel-text="取消" @on-confirm="confirm.onConfirm" @on-cancel="confirm.onCancel">
      <p>{{ confirm.text }}</p>
    </confirm>
    <action-sheet
      :menus="actionSheet.menus"
      :show-cancel="actionSheet.showCancel"
      cancel-text="取消"
      :show.sync="actionSheet.show"
      ref="action-sheet"
    ></action-sheet>
    <view-box class="view-box" ref="view-box">
      <!--header slot-->
      <div class="vux-demo-header-box" slot="header" v-if="isWebApp">
        <x-header :left-options="leftOptions" :transition="headerTransition" :title="title"
                  @on-click-title="scrollTop" @on-click-back="goBack"></x-header>
      </div>
      <!--default slot-->
      <router-view
        ref="router-view"
        class="router-view"
        :transition="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')"
      ></router-view>
    </view-box>
  </div>
</template>
<script type="text/babel">
  /* eslint-disable no-undef */

  import {mapActions, mapGetters} from 'vuex'
  import {axios} from './helpers/request'
  import {Loading, Toast, Confirm, Actionsheet as ActionSheet, ViewBox} from 'vux'

  import XHeader from './components/common/x-header.vue'

  import noop from './helpers/noop'
  import {getItem} from './helpers/storage'

  export default {
    components: {
      Loading,
      Toast,
      Confirm,
      ActionSheet,
      ViewBox,
      XHeader
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
        }
      }
    },
    computed: {
      leftOptions () {
        return {
          backText: this.$route.backText,
          showBack: this.$route.path !== '/',
          preventGoBack: true
        }
      },
      headerTransition () {
        return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
      },
      title () {
        if (this.$route.title) {
          if (this.$route.title instanceof Function) {
            return this.$route.title(this.$refs.routerView)
          }
          return this.$route.title
        }
        return 'VOEZ+'
      },
      ...mapGetters([
        'loginStatus',
        'routerLoading',
        'direction',
        'setting',
        'clientId'
      ])
    },
    methods: {
      scrollTop () {
        this.$refs.viewBox.$els.viewBoxBody.scrollTop = 0
      },
      goBack () {
        if (this.$route.meta.routeIndex > 0) {
          this.$router.push(this.$route.meta.backRoute)
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

          if (this.$route.path === '/') {
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
      ...mapActions([
        'storeUpdateSongs',
        'storeUpdateUsers',
        'storeUpdateSetting',
        'storeUpdateClient',
        'storeUpdateAnnouncements'
      ])
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
    beforeMount () {
      this.storeUpdateSongs(JSON.parse(getItem('songs')) || [])

      axios.post('client/autologin', {
        client_id: this.clientId
      }).then(({data}) => {
        let res = data
        if (res.result && res.code === 0) {
          this.storeUpdateClient(res.info.client)
        }
      })

      axios('voez/songs').then(({data}) => {
        let res = data
        if (res.result && res.code === 0) {
          this.updateSongs(res.info.songs)
        }
      })

      axios('voez/announcement').then(({data}) => {
        let res = data
        if (res.result && res.code === 0) {
          this.storeUpdateAnnouncements(res.info.announcement)
          this.hideStartupView()
        }
      }).catch((err) => {
        console.log(err)
        alert('VOEZ+ 遇到问题正在维护，请稍后再试')
      })
      this.autoLogin(() => {
      })
      let preload = new Image()
      preload.src = 'http://voez.sevenoutman.com/voez/cover/default/750'

      if (!isWebApp()) {
        this.$watch('title', function (val) {
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
    mounted () {
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
      document.addEventListener('touchstart', e => {
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
    /*-webkit-overflow-scrolling: touch;*/
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

  .view-box {
    transform: translate3d(0, 0, 0);
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
