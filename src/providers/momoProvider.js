import { v4 as uuidv4 } from 'uuid'
import { PARTNERS } from '~/configs/environment'
import momoAxiosClient from '~/configs/momoAxiosClient'
import { PARTNER_APIS } from '~/utils/constants'

const { MOMO: { PARTNER_CODE, ACCESS_KEY, SECRET_KEY, ORDER_EXPIRE_TIME } } = PARTNERS

/**
 * Create pay URL | includes: payExpireTime in minutes
 * @param {{
 *  partnerClientId: string,
 *  orderId: string,
 *  items: [{
 *    id: string,
 *    name: string,
 *    imageUrl: string,
 *    price: number,
 *    currency: string,
 *    quantity: string,
 *    totalPrice: number
 *  }],
 *  amount: number,
 *  shippingFee: number,
 *  transactionDescription: string,
 *  redirectUrl: string,
 *  ipnUrl: string
 *  payExpireTime: number
 * }} data
 * @returns {Promise<object>}
 */
const createPayUrl = async ({
  partnerClientId,
  orderId = '',
  items,
  amount,
  shippingFee,
  transactionDescription = '',
  extraData = '',
  redirectUrl,
  ipnUrl
}) => {
  const requestId = uuidv4()
  const requestType = 'payWithMethod'

  const rawSignature = 'accessKey=' + ACCESS_KEY + '&amount=' + amount + '&extraData=' + extraData + '&ipnUrl=' + ipnUrl + '&orderId=' + orderId + '&orderInfo=' + transactionDescription + '&partnerCode=' + PARTNER_CODE + '&redirectUrl=' + redirectUrl + '&requestId=' + requestId + '&requestType=' + requestType
  const crypto = require('crypto')
  const signature = crypto.createHmac('sha256', SECRET_KEY)
    .update(rawSignature)
    .digest('hex')

  return await momoAxiosClient.post(PARTNER_APIS.MOMO.APIS.CREATE_PAY_URL, {
    partnerCode: PARTNER_CODE,
    partnerName: 'Test',
    requestId,
    requestType,
    lang: 'en',
    signature,
    partnerClientId,
    orderId,
    amount,
    taxAmount: shippingFee,
    orderInfo: transactionDescription,
    redirectUrl,
    ipnUrl,
    extraData: '',
    items,
    orderExpireTime: ORDER_EXPIRE_TIME
  })
}

export default {
  createPayUrl
}