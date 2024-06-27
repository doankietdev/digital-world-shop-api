import axios from 'axios'
import { PARTNER_APIS } from '~/utils/constants'
import { PARTNERS } from './environment'

const instance = axios.create({
  baseURL: PARTNER_APIS.GHN.API_ROOT
})

instance.interceptors.request.use(
  function (config) {
    config.headers['token'] = PARTNERS.GHN.TOKEN
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function (response) {
    return response.data.data
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default instance
