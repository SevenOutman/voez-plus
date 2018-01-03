/**
 * Created by Doma on 16/9/15.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'

Vue.use(Vuex)

const state = {
  clientId: '',
  clientFavorite: [],

  direction: 'forward',

  loginStatus: false,
  user: {
    id: '',
    name: ''
  },
  setting: {},

  routerLoading: false,

  announcements: [],

  songList: [],
  songMap: {}
}

const mutations = {
  UPDATE_CLIENT_ID (state, id) {
    state.clientId = state.clientId || id
  },
  UPDATE_CLIENT_FAVORITE (state, favorite) {
    state.clientFavorite = favorite || []
  },
  UPDATE_ROUTER_LOADING (state, status) {
    state.routerLoading = status
  },
  UPDATE_DIRECTION (state, direction) {
    state.direction = direction
  },
  UPDATE_LOGIN_STATUS (state, status) {
    state.loginStatus = status
  },
  UPDATE_USER (state, user) {
    state.user = user || {}
    state.loginStatus = !!state.user.id
  },
  UPDATE_SETTING (state, setting) {
    state.setting = setting || {}
  },
  UPDATE_ANNOUNCEMENTS (state, announcements) {
    state.announcements = announcements
  },
  UPDATE_SONGS (state, songs) {
    state.songMap = {}
    state.songList = songs
    state.songList.forEach(song => {
      state.songMap[song.id] = song
    })
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters: {
    loginStatus: state => state.loginStatus,
    route: state => state.route,
    routerLoading: state => state.routerLoading,
    direction: state => state.direction,
    setting: state => state.setting,
    clientId: state => state.clientId,
    isLoading: state => state.isLoading,
    user: state => state.user,
    hasVplusUser: state => !!state.user.id,
    favoriteCount: state => state.clientFavorite.length,
    newSongs: state => state.songList.filter(song => song.recent * 1),

    announcements: state => state.announcements
  }
})
