const { REDIS_KEY } = require('~/utils/constants')
const { cache } = require('./redis.service')
const { default: currencyFreaksProvider } = require('~/providers/currencyFreaksProvider')

const getExchangeRate = async (currency) => {
  const exchangeRates = await cache({
    key: REDIS_KEY.EXCHANGE_RATES,
    options: { EX: 2592000 }
  }, currencyFreaksProvider.getExchangeRates, [currency])
  const exchangeRate = exchangeRates[currency]
  return Number(exchangeRate)
}

export default {
  getExchangeRate
}