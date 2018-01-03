<template>
  <div class="voez-song-list">
    <group title="最新歌曲" v-if="newSongs.length">
      <cell
        v-for="(song, index) of sortName(newSongs)"
        key="index"
        :title="song.name"
        is-link
        v-link="'leaderboard/' + song.id"
      ></cell>
    </group>
    <group title="关注的歌曲" v-if="favoriteSongs.length">
      <cell
        v-for="(song, index) of sortName(favoriteSongs)"
        key="index"
        :title="song.name"
        is-link
        v-link="`leaderboard/${song.id}`"
      ></cell>
    </group>
    <group :title="'全部 ' + list.length + ' 首歌曲'">
      <cell
        v-for="(song, index) of sortName(list)"
        key="index"
        :title="song.name"
        is-link
        v-link="`leaderboard/${song.id}`"
      ></cell>
    </group>
  </div>
</template>
<script>
  import vuexActions from '../../vuex/actions'
  import {setItem} from '../../helpers/storage'

  import {Group, Cell} from 'vux'

  export default {
    components: {
      Group,
      Cell
    },
    route: {
      activate ({next}) {
        if (this.newSongs.length) {
          localStorage.setItem('lastnewsong', this.newSongs[0].id)
        }
        next()
      },
      data ({next}) {
        next()
      }
    },
    computed: {
      newSongs () {
        return this.list.filter(song => song.recent * 1)
      }
    },
    methods: {
      sortName (list) {
        return list.sort((song1, song2) => {
          let name1 = song1.name.replace(/(^-|-$)/g, '')
          let name2 = song2.name.replace(/(^-|-$)/g, '')

          return name1.localeCompare(name2)
        })
      },
      updateSongs (songs) {
        this.storeUpdateSongs(songs)
        setItem('songs', JSON.stringify(songs))
      }
    },
    vuex: {
      getters: {
        list: state => state.songList,
        favoriteSongs: state => state.clientFavorite.map(id => state.songMap[id])
      },
      actions: vuexActions
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .voez-song-list {
    -webkit-transform-style: preserve-3d;
    padding-bottom: env(safe-area-inset-bottom);

    .weui_cell {
      -webkit-transform: translate3d(0, 0, 0);
      -webkit-backface-visibility: hidden;
    }
  }

  .detail-box {
    .voez-song-list {
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
