<template>
    <div class="vplus-favorite">
        <div v-if="isEditing">
            <checklist :title="'全部' + songList.length + '首歌曲'" :options="songsToSelect | orderBy sortName"
                       :value.sync="selectedSongs"
                       :required="false"></checklist>
            <checklist title="已关注歌曲" :options="cachedFavoriteSongs | orderBy sortName" :value.sync="selectedSongs"
                       :required="false"></checklist>
            <div style="padding: 10px">
                <x-button type="primary" @click="submit">保存</x-button>
                <x-button type="default" @click="cancel">取消</x-button>
            </div>
        </div>
        <div v-else>
            <divider style="margin: 10px 0" v-show="!favoriteSongs.length">你还没有关注的歌曲</divider>
            <group :title="'共' + favoriteSongs.length + '首歌曲'" v-show="favoriteSongs.length">
                <cell :title="song.name" v-for="song of favoriteSongs | orderBy sortName"></cell>
            </group>
            <div style="padding: 10px">
                <x-button type="primary" @click="edit" v-show="!favoriteSongs.length">添加歌曲</x-button>

                <x-button type="primary" @click="edit" v-show="favoriteSongs.length">编辑</x-button>
                <x-button type="warn" @click="empty" v-show="favoriteSongs.length">清空</x-button>
            </div>
        </div>
    </div>
</template>
<script>
    import Group from 'vux/src/components/group/index.vue'
    import Cell from 'vux/src/components/cell/index.vue'
    import Checklist from 'vux/src/components/checklist/index.vue'
    import Divider from 'vux/src/components/divider/index.vue'
    import XButton from 'vux/src/components/x-button/index.vue'
    export default {
        components: {
            Group,
            Cell,
            Checklist,
            Divider,
            XButton
        },
        data() {
            return {
                isEditing:     false,
                selectedSongs: []
            }
        },
        computed:   {
            favoriteSongs() {
                return this.favorite.map(id => this.songMap[id])
            },
            songsToSelect() {
                return this.songList.map(song => {
                    return {key: song.id, value: song.name}
                })
            },
            cachedFavoriteSongs() {
                return this.selectedSongs.map(id => {
                    return {
                        key:   id,
                        value: this.songMap[id].name
                    }
                })
            }
        },
        methods:    {
            edit() {
                // 避免 selectedSongs 变化时 favorite 也变化
                this.selectedSongs = this.favorite.map(id => id)
                this.isEditing     = true
            },
            empty() {
                this.$dispatch("sys:actionsheet", {
                    showCancel: true,
                    menus:      {
                        'confirm.noop': {
                            text: "确定清空吗?<br/><span style=\"color:#666;font-size:12px;\">此操作不可撤销</span>",
                            action() {
                            }
                        },
                        'delete':       {
                            text:   "<span style=\"color:red\">清空</span>",
                            action: () => {
                                this.saveFavorite([0]).then(() => {
                                    this.isEditing = false
                                })
                            }
                        }
                    }
                })
            },
            submit(){
                this.saveFavorite(this.selectedSongs.length ? this.selectedSongs : [0]).then(() => {
                    this.isEditing = false
                })
            },
            cancel() {
                this.isEditing = false
            },
            saveFavorite(favorite) {
                this.$dispatch("sys:loading.on", "操作中")
                return this.$http.post('client/favorite', {
                    favorite
                }).then(response => {
                    let res = JSON.parse(response.body)
                    if (res.result && res.code == 0) {
                        this.storeUpdateClientFavorite(res.info.favorite)
                        this.$dispatch("sys:loading.off")
                        this.$dispatch("sys:toast.success", "操作成功")
                    } else {
                        this.$dispatch("sys:loading.off")
                        this.$dispatch("sys:toast.cancel", "操作失败")
                    }
                })
            },
            sortName(song1, song2) {
                let name1 = (song1.name || song1.value).replace(/(^-|-$)/g, "")
                let name2 = (song2.name || song2.value).replace(/(^-|-$)/g, "")

                return name1.localeCompare(name2)
            }
        },
        vuex:       {
            getters: {
                favorite: state => state.clientFavorite,
                songMap:  state => state.songMap,
                songList: state => state.songList
            },
            actions: {
                storeUpdateClientFavorite({dispatch}, favorite) {
                    dispatch("UPDATE_CLIENT_FAVORITE", favorite)
                }
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    .vplus-favorite {
        overflow: hidden;
    }

    .detail-box {
        .vplus-favorite {
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