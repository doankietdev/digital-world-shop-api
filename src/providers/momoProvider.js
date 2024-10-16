import { v4 as uuidv4 } from 'uuid'
import { APP, CLIENT, PARTNERS } from '~/configs/environment'
import momoAxiosClient from '~/configs/momoAxiosClient'
import { generateSignature } from '~/utils/auth'
import { PARTNER_APIS } from '~/utils/constants'

const { MOMO: { PARTNER_CODE, ACCESS_KEY, SECRET_KEY, ORDER_EXPIRE_TIME } } = PARTNERS
const IPN_URL = `${APP.HOST}/api/v1/checkout/momo/callback`
const REDIRECT_URL = `${CLIENT.URL}${CLIENT.PAID_ORDERS_PATH}`
const REQUEST_TYPE = 'payWithMethod'

const createSignature = ({ amount, extraData, orderId, orderInfo, requestId }) => {
  const rawSignature = 'accessKey=' + ACCESS_KEY + '&amount=' + amount + '&extraData=' + extraData + '&ipnUrl=' + IPN_URL + '&orderId=' + orderId + '&orderInfo=' + orderInfo + '&partnerCode=' + PARTNER_CODE + '&redirectUrl=' + REDIRECT_URL + '&requestId=' + requestId + '&requestType=' + REQUEST_TYPE
  return generateSignature(SECRET_KEY, rawSignature)
}

const verifySignature = (signature, { amount, extraData, orderId, orderInfo, requestId }) => {
  const originalSignature = createSignature({
    orderId,
    amount,
    extraData,
    orderInfo,
    requestId,
    requestType: REQUEST_TYPE
  })
  return signature === originalSignature
}

/**
 * Create pay URL | includes: payExpireTime in minutes
 * @param {{
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
 *  taxAmount: number,
 *  orderInfo: string,
 *  extraData: object
 * }} data
 * @returns {Promise<object>}
 */
const initPayment = async ({
  orderId,
  items,
  amount,
  taxAmount,
  orderInfo = '',
  extraData = {}
}) => {
  const requestId = uuidv4()
  const base64ExtraData = Buffer.from(JSON.stringify(extraData)).toString('base64')

  const signature = createSignature({
    amount,
    extraData: base64ExtraData,
    orderId,
    orderInfo,
    requestId
  })

  return await momoAxiosClient.post(PARTNER_APIS.MOMO.APIS.INIT_PAYMENT, {
    partnerCode: PARTNER_CODE,
    requestId,
    requestType: REQUEST_TYPE,
    lang: 'en',
    signature,
    orderId,
    amount,
    taxAmount: taxAmount,
    orderInfo,
    redirectUrl: REDIRECT_URL,
    ipnUrl: IPN_URL,
    extraData: base64ExtraData,
    items,
    orderExpireTime: ORDER_EXPIRE_TIME
  })
}

export default {
  createSignature,
  verifySignature,
  initPayment
}