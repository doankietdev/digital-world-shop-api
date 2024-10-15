import axios from 'axios'
import { PARTNER_APIS } from '~/utils/constants'

const instance = axios.create({
  baseURL: PARTNER_APIS.MOMO.API_ROOT
})

instance.interceptors.request.use(
  function (config) {
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
