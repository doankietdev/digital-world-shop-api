import axios from 'axios'
import { PARTNER_APIS } from '~/utils/constants'
import { PARTNERS } from '~/configs/environment'

const { CURRENCY_FREAKS } = PARTNERS

const instance = axios.create({
  baseURL: PARTNER_APIS.CURRENCY_FREAKS.API_ROOT
})

instance.interceptors.request.use(
  function (config) {
    config.params = {
      ...config.params,
      apikey: CURRENCY_FREAKS.API_KEY
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default instance
