import currencyFreaksProvider from '~/providers/currencyFreaksProvider'
import { REDIS_KEYS } from '~/utils/constants'
import { isRedisWorking, readData, writeData } from './redis.service'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const getExchangeRate = async (currency = 'USD', base = 'USD') => {
  const allowedCurrencies = ['USD', 'VND']
  if (!allowedCurrencies.includes(currency)) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid currency')

  let exchangeRates = {}
  let exchangeRate = null
  const _isRedisWorking = isRedisWorking()
  const KEY = `${REDIS_KEYS.EXCHANGE_RATES}_${base}`
  if (_isRedisWorking) {
    const cachedValue = await readData(KEY)
    if (cachedValue) {
      exchangeRates = JSON.parse(cachedValue)
      exchangeRate = exchangeRates[currency]
      if (exchangeRate) return Number(exchangeRate) || null
    }
  }

  exchangeRates = {
    ...exchangeRates,
    ...(await currencyFreaksProvider.getExchangeRates([currency], base))
  }
  if (_isRedisWorking) {
    writeData(KEY, JSON.stringify(exchangeRates), { EX: 30 * 24 * 60 * 60 })
  }
  return Number(exchangeRates[currency]) || null
}
export default {
  getExchangeRate
}