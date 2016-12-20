<template>
    <div class="vplus-setting">
        <!--, 同时其他人可以在排行榜看到你的判定数-->
        <group title="开启后你可以查看排行榜其他人成绩的判定数">
            <switch title="查看判定数" :value="setting.show_note_count" @on-change="setShowNoteCount"></switch>
        </group>
        <group title="每次登录『我的 VOEZ+』时都提醒你 VOEZ 将会掉线">
            <switch title="挤号提醒" :value="setting.login_confirm" @on-change="setLoginConfirm"></switch>
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
                setting: {}
            }
        },
        route:      {
            data({next}) {
                this.$http.get('account/setting').then(response => {
                    let res = JSON.parse(response.body)
                    if (res.result && res.code == 0) {
                        this.updateSetting(res.info)
                        next()
                    }
                })
            },
            activate() {
                this.storeStopRouterLoading()
            }
        },
        vuex:       {
            actions: {
                storeStopRouterLoading({dispatch}) {
                    dispatch('UPDATE_ROUTER_LOADING', false)
                }
            }
        },
        methods:    {
            setShowNoteCount(val) {
                this.saveSetting('show_note_count', val)
            },
            setLoginConfirm(val) {
                this.saveSetting('login_confirm', val)
            },
            saveSetting(key, value) {
                if (this.setting[key] != value) {

                    this.$http.post('account/setting', {
                        [key]: value ? 1 : 0
                    }).then(response => {
                        let res = JSON.parse(response.body)
                        if (res.result && res.code == 0) {
                            this.updateSetting(res.info)
                        }
                    })

                }
            },
            updateSetting(setting) {
                Object.keys(setting).forEach(key => {
                    if (key != 'vplus_user_id' && key != 'last_modify_setting' && key != 'date_modified') {
                        this.$set("setting." + key, !!(setting[key] * 1))
                    }
                })
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    .vplus-setting {
        overflow: hidden;
    }

    .detail-box {
        .vplus-setting {
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