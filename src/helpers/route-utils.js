/**
 * Created by Doma on 16/9/19.
 */
export const getRouteIndex = path => {

    path = path && path.path || path

    if (path == '/') {
        return 0
    }
    if (path == '/about') {
        return 1
    }
    if (path == '/login') {
        return 1
    }
    if (path == '/songs') {
        return 1
    }
    if (/^\/leaderboard\/\d+$/.test(path)) {
        return 2
    }
}