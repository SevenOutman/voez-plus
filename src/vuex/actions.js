/**
 * Created by Doma on 16/9/19.
 */

export default {
  storeUpdateSongs: ({commit}, songs) => {
    commit('UPDATE_SONGS', songs)
  },
  storeUpdateAnnouncements ({commit}, announcements) {
    if (!announcements || !announcements.length) {
      announcements = [{
        content: '暂无公告。'
      }]
    }
    commit('UPDATE_ANNOUNCEMENTS', announcements)
  },
  storeUpdateLoginStatus ({commit}, status) {
    commit('UPDATE_LOGIN_STATUS', status)
  },
  storeUpdateUser ({commit}, user) {
    commit('UPDATE_USER', user)
  },
  storeUpdateSetting ({commit}, setting) {
    commit('UPDATE_SETTING', setting)
  },
  storeUpdateClient ({commit}, client) {
    commit('UPDATE_CLIENT_ID', client.client_id)
    commit('UPDATE_CLIENT_FAVORITE', client.favorite)
  }
}
