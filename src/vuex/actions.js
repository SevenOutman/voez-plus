/**
 * Created by Doma on 16/9/19.
 */

export default {
    storeUpdateSongs: ({dispatch}, songs) => {
        dispatch("UPDATE_SONGS", songs)
    },
    storeUpdateAnnouncements({dispatch}, announcements) {
        if (!announcements || !announcements.length) {
            announcements = [{
                content: '暂无公告。'
            }]
        }
        dispatch('UPDATE_ANNOUNCEMENTS', announcements)
    },
    storeUpdateLoginStatus({dispatch}, status) {
        dispatch('UPDATE_LOGIN_STATUS', status)
    },
    storeUpdateUser({dispatch}, user) {
        dispatch('UPDATE_USER', user)
    },
    storeUpdateSetting({dispatch}, setting) {
        dispatch('UPDATE_SETTING', setting)
    },
    storeUpdateClient({dispatch}, client) {
        dispatch('UPDATE_CLIENT_ID', client.client_id)
        dispatch('UPDATE_CLIENT_FAVORITE', client.favorite)
    }
}