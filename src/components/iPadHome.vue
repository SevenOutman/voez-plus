<template>
    <div class="voez-home">


        <announcement></announcement>
        <group>
            <cell title="实时歌曲排行榜" link="/songs"></cell>
            <cell title="关注歌曲" link="/favorite">{{ favoriteCount }}首</cell>
            <cell title="我的 VOEZ+" :value="user.name || '邀请测试中'" is-link @click="goMy">
            </cell>
        </group>
        <group>
            <cell title="关于" link="/about">
                <span slot="after-title" class="vux-reddot-s" v-if="hasNewAbout"></span>
                <span slot="value" v-if="hasNewAbout">有更新</span>
            </cell>
            <cell title="和薊合影" is-link @click="$dispatch('home:welcome')"></cell>
            <cell title="添加到主屏幕" v-if="!isWebApp">
                <span slot="after-title" class="vux-reddot-s" v-if="isIOS"></span>
                <div slot="value">
                    <span v-if="!isIOS">仅限 iOS</span>
                    <template v-else>
                        <span v-if="!isSafari" style="color: green">在 Safari 中打开</span>
                        <span v-else style="display: inline-block; color: green">
                            点击下方的
                            <?xml version="1.0" standalone="no"?>
                            <svg style="display: inline-block; vertical-align: middle; margin: -4px 0 0 -4px" width="20"
                                 viewBox="0 0 1024 1024" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg">
                            <g transform="translate(0, 825.0) scale(1, -1)">
                                <path d="M896 492.512l-191.488 0 0-64.512 128 0 0-512-640 0 0 512 128 0 0 64.512-192.512 0 0-641.024 768 0 0 641.024zM480.256 694.24l0-585.728 63.488 0 0 585.728 117.76-114.688 43.008 40.96-192.512 191.488-191.488-191.488 41.984-41.984 117.76 115.712z"
                                      fill="green"></path>
                            </g>
                        </svg>
                        </span>
                    </template>
                </div>
            </cell>
        </group>
    </div>
</template>

<script type="text/babel">
    import Group from 'vux/src/components/group'
    import Cell from 'vux/src/components/cell/index.vue'
    import Announcement from './announcement/index.vue'
    import Dialog from 'vux/src/components/dialog/index.vue'
    import Confirm from 'vux/src/components/confirm/index.vue'

    export default {
        components: {
            Announcement,
            Group,
            Cell,
            Dialog,
            Confirm
        },
        data () {
            return {
                ua:                 navigator.userAgent.toLocaleLowerCase(),
                showWelcomeDialog:  false,
                hasNewAbout:        false,
                latestAbout:        1482249598989,
                showLoginConfirm:   false,
                showReloginConfirm: false
            }
        },
        computed:   {
            isIOS() {
                var ipad   = /(iPad).*OS\s([\d_]+)/i.test(this.ua)
                var ipod   = /(iPod)(.*OS\s([\d_]+))?/i.test(this.ua)
                var iphone = !ipad && /(iPhone\sOS)\s([\d_]+)/i.test(this.ua)
                return ipad || ipod || iphone
            },
            isSafari() {
                return /safari/.test(this.ua)
            },
            isWebApp() {
                return isWebApp()
            }
        },
        methods:    {
            goMy() {
                if (!this.hasVplusUser) {
                    // 从未登录过, 显示登录提示
                    this.showLoginConfirm = true
                    this.$dispatch('home:login-confirm')
                } else {
                    // 已经登录过, 准备进入我的VOEZ+
                    this.$http.get('account/prelogin').then(response => {
                        let res = JSON.parse(response.body)
                        if (res.result && res.code == 0) {
                            if (!res.info.need_login_confirm) {
                                // 无需登录提醒
                                this.$router.go('/my')
                            } else {
//                                this.showReloginConfirm = true
                                this.$dispatch("sys:confirm", {
                                    text:      '进入『我的 VOEZ+』将导致您正在游玩的《兰空VOEZ》下线。',
                                    onConfirm: () => {
                                        this.$router.go('/my')
                                    }
                                })
                            }
                        } else {
                            this.$dispatch("sys:toast", "登录已失效")
//                            this.$router.go('/login')
                            this.$dispatch('sys:login')
                        }
                    })
                }
            }
        },
        events:     {
            'sys:dialog.welcome'() {
                this.showWelcomeDialog = true
            }
        },
        vuex:       {
            getters: {
                isLoading:     state => state.isLoading,
                user:          state => state.user,
                hasVplusUser:  state => !!state.user.id,
                favoriteCount: state => state.clientFavorite.length
            }
        },
        route:      {
            data({next}) {
                let lastabout = localStorage.getItem('lastabout') * 1 || 0
                next({
                    hasNewAbout: lastabout < this.latestAbout
                })
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import '~vux/src/styles/reddot';
    @import '~vux/src/styles/close';

    .voez-home {
        .weui_dialog_confirm {
            .weui_dialog_hd, .weui_dialog_bd {
                font-size: 12px;
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
                height: 100px;
                overflow: hidden;
                & > img {
                    max-width: 100%;
                    margin-top: -125px;
                    display: block;
                }
            }
            .vplus-welcome-dialog-content {

                height: 150px;
                padding: 10px 15px;
                text-align: start;

            }
        }
        .voez-announcement + * {
            margin-top: -1px;
            .weui_cells {
                margin-top: 0;
            }
        }
    }
</style>