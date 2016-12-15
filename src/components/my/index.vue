<template>
    <div class="vplus-my">
        <group>
            <cell title="昵称">{{ user.name }}</cell>
            <cell title="啾啾余额">{{ keys || 0 }}</cell>
            <cell title="解锁歌曲">{{ songs || 0 }} / {{ totalSongs }}</cell>
        </group>
        <group>
            <cell title="总成绩" @click="toggleExpandTotal">
                <span slot="value">{{ overall.total || 0 | currency '' 0 }}</span>
                <div class="vplus-my-modes" :class="{ expanded: expandTotal }" slot="child">
                    <span class="vplus-my-mode-easy"></span>
                    <span class="vplus-my-mode-hard"></span>
                    <span class="vplus-my-mode-special"></span>
                </div>
            </cell>
            <template v-if="expandTotal">
                <cell class="vplus-my-mode-easy" title="Easy">{{ overall.easy || 0 | currency '' 0 }}</cell>
                <cell class="vplus-my-mode-hard" title="Hard">{{ overall.hard || 0 | currency '' 0 }}</cell>
                <cell class="vplus-my-mode-special" title="Special">{{ overall.special || 0 | currency '' 0 }}</cell>
            </template>
        </group>
        <group>
            <cell title="游玩谱面" @click="toggleExpandPlayed">
                <span slot="value">{{ played.easy + played.hard + played.special || 0 }}</span>
                <div class="vplus-my-modes" :class="{ expanded: expandPlayed }" slot="child">
                    <span class="vplus-my-mode-easy"></span>
                    <span class="vplus-my-mode-hard"></span>
                    <span class="vplus-my-mode-special"></span>
                </div>
            </cell>
            <template v-if="expandPlayed">
                <cell class="vplus-my-mode-easy" title="Easy">{{ played.easy || 0 }}</cell>
                <cell class="vplus-my-mode-hard" title="Hard">{{ played.hard || 0 }}</cell>
                <cell class="vplus-my-mode-special" title="Special">{{ played.special || 0 }}</cell>
            </template>
        </group>
        <group>
            <cell title="All Perfect" @click="toggleExpandAP">
                <span slot="value">{{ ap.easy + ap.hard + ap.special || 0 }}</span>
                <div class="vplus-my-modes" :class="{ expanded: expandAP }" slot="child">
                    <span class="vplus-my-mode-easy"></span>
                    <span class="vplus-my-mode-hard"></span>
                    <span class="vplus-my-mode-special"></span>
                </div>
            </cell>
            <template v-if="expandAP">
                <cell class="vplus-my-mode-easy" title="Easy">{{ ap.easy || 0 }}</cell>
                <cell class="vplus-my-mode-hard" title="Hard">{{ ap.hard || 0 }}</cell>
                <cell class="vplus-my-mode-special" title="Special">{{ ap.special || 0 }}</cell>
            </template>
        </group>
        <group>
            <cell title="Full Combo" @click="toggleExpandFC">
                <span slot="value">{{ fc.easy + fc.hard + fc.special || 0 }}</span>
                <div class="vplus-my-modes" :class="{ expanded: expandFC }" slot="child">
                    <span class="vplus-my-mode-easy"></span>
                    <span class="vplus-my-mode-hard"></span>
                    <span class="vplus-my-mode-special"></span>
                </div>
            </cell>
            <template v-if="expandFC">
                <cell class="vplus-my-mode-easy" title="Easy">{{ fc.easy || 0 }}</cell>
                <cell class="vplus-my-mode-hard" title="Hard">{{ fc.hard || 0 }}</cell>
                <cell class="vplus-my-mode-special" title="Special">{{ fc.special || 0 }}</cell>
            </template>
        </group>
        <group>
            <cell title="设置" link="setting"></cell>
        </group>
        <group>
            <cell title="退出当前账号" @click="confirmLogout"></cell>
        </group>
    </div>
</template>
<script>
    import Group from 'vux/src/components/group/index.vue'
    import Cell from 'vux/src/components/cell/index.vue'
    import Switch from 'vux/src/components/switch/index.vue'
    export default {
        components: {
            Group,
            Cell,
            Switch
        },
        data() {
            return {
                keys:         '',
                songs:        '',
                overall:      {},
                played:       {},
                ap:           {},
                fc:           {},
                expandTotal:  true,
                expandAP:     false,
                expandFC:     false,
                expandPlayed: false
            }
        },
        route:      {
            data({next}) {
                this.$http.get('voez/my').then(response => {
                    let res = JSON.parse(response.body)
                    if (res.result && res.code == 0) {
                        next(res.info)
                    }
                })
            },
            activate() {
                this.storeStopRouterLoading()
            }
        },
        vuex:       {
            getters: {
                user:       state => state.user,
                totalSongs: state => state.songList.length,
                songList:   state => state.songList
            },
            actions: {
                storeStopRouterLoading({dispatch}) {
                    dispatch('UPDATE_ROUTER_LOADING', false)
                },
                storeUpdateUser({dispatch}, user) {
                    dispatch('UPDATE_USER', user)
                },
            }
        },
        methods:    {
            toggleExpandTotal() {
                this.expandTotal = !this.expandTotal
            },
            toggleExpandAP() {
                this.expandAP = !this.expandAP
            },
            toggleExpandFC() {
                this.expandFC = !this.expandFC
            },
            toggleExpandPlayed() {
                this.expandPlayed = !this.expandPlayed
            },
            confirmLogout() {
                this.$dispatch("sys:actionsheet", {
                    showCancel: true,
                    menus:      {
                        logout: {
                            text:   "<span style=\"color:red\">退出当前账号</span>",
                            action: this.logout
                        }
                    }
                })
            },
            logout() {
                this.$http.get('account/logout').then(response => {
                    let res = JSON.parse(response.body)
                    if (res.result && res.code == 0) {
                        this.storeUpdateUser(null)
                        localStorage.removeItem('auth_token')
                        this.$router.go('login')
                    }
                })
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    .vplus-my {
        overflow: hidden;

        & > div:last-child {
            margin-bottom: 15px;
        }

        .weui_cell_ft {
            color: #6869a1;
        }

        .vplus-my-mode-easy {
            padding-right: 12px;
            border-right: 3px solid #169CBF;
        }
        .vplus-my-mode-hard {
            padding-right: 12px;

            border-right: 3px solid #E13841;
        }
        .vplus-my-mode-special {
            padding-right: 12px;

            border-right: 3px solid #F09412;
        }
        .vplus-my-modes {
            position: absolute;
            top: 0;
            right: 0;

            & > span {
                text-align: right;
                height: 44px / 3;
                line-height: 44px / 3;
                color: #ffffff;
                display: block;
            }
            &.expanded > span {
                border-right-color: transparent;
            }
        }

    }

    .detail-box {
        .vplus-my {
            padding: 15px 30px 30px;
            box-sizing: border-box;
            .weui_cells {
                border-radius: 5px;
                &::before, &::after {
                    display: none;
                }
            }
        }
    }
</style>