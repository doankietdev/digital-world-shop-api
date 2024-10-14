import currencyFreaksAxiosClient from '~/configs/currencyFreaksAxiosClient'
import { PARTNER_APIS } from '~/utils/constants'

const { CURRENCY_FREAKS: { APIS } } = PARTNER_APIS

const getExchangeRates = async (currencies = ['VND']) => {
  const { rates } = await currencyFreaksAxiosClient.get(APIS.GET_LATEST_CURRENCY_EXCHANGE_RATES, {
    params: { symbols: currencies.join(',') }
  })
  return rates
}

export default {
  getExchangeRates
}