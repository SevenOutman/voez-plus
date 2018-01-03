import baseAxios from 'axios'
import qs from 'qs'

// baseAxios.defaults.baseURL = /voez/.test(location.host) ? location.protocol + '//' + location.host : 'http://voez.sevenoutman.com'
// baseAxios.defaults.headers.common['Accept'] = 'application/json'
// baseAxios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export const axios = baseAxios.create({
  baseURL: /voez/.test(location.host) ? location.protocol + '//' + location.host : 'http://voez.sevenoutman.com',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: data => qs.stringify(data)
})

export const voez = baseAxios.create({
  baseURL: 'http://al1-api.app.voez.cn',
  headers: {
    Accept: 'application/json'
  }
})
